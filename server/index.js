import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openaiApiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_GPT;
const openai =
  openaiApiKey && new OpenAI({
    apiKey: openaiApiKey,
  });

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Simple in-memory store for demo purposes
const doctors = [
  {
    id: 1,
    name: 'Dr. Aditi Rao',
    specialization: 'Cardiologist',
    hospital: 'City Heart Center',
    rating: 4.8,
    availability: 'Today, 3:00 PM - 7:00 PM',
  },
  {
    id: 2,
    name: 'Dr. Rahul Mehta',
    specialization: 'Pulmonologist',
    hospital: 'Metro Care Hospital',
    rating: 4.6,
    availability: 'Tomorrow, 10:00 AM - 1:00 PM',
  },
  {
    id: 3,
    name: 'Dr. Neha Sharma',
    specialization: 'General Physician',
    hospital: 'Green Valley Clinic',
    rating: 4.7,
    availability: 'Today, 5:00 PM - 9:00 PM',
  },
];

// Utility: basic rule-based symptom to specialist mapping
function mapSymptomsToSpecialist(symptomsText) {
  const text = symptomsText.toLowerCase();

  if (text.includes('chest') || text.includes('heart') || text.includes('breath')) {
    return 'Cardiologist';
  }
  if (text.includes('cough') || text.includes('asthma') || text.includes('lung')) {
    return 'Pulmonologist';
  }
  if (text.includes('skin') || text.includes('rash') || text.includes('allergy')) {
    return 'Dermatologist';
  }
  if (text.includes('eye') || text.includes('vision')) {
    return 'Ophthalmologist';
  }
  if (text.includes('child') || text.includes('kid')) {
    return 'Pediatrician';
  }
  return 'General Physician';
}

// Utility: very simple risk scoring for demo
function calculateRiskScore({ age, weight, bp, sugar }) {
  let score = 0;

  if (age >= 45) score += 1;
  if (age >= 60) score += 1;

  if (weight >= 90) score += 2;
  else if (weight >= 75) score += 1;

  if (bp >= 140) score += 2;
  else if (bp >= 130) score += 1;

  if (sugar >= 180) score += 2;
  else if (sugar >= 140) score += 1;

  let level = 'Low';
  if (score >= 5) level = 'High';
  else if (score >= 3) level = 'Medium';

  return { score, level };
}

// Chat endpoint (AI Chat Doctor)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: { message: 'messages array is required' } });
    }

    if (!openai) {
      // Fallback non-AI response
      return res.json({
        choices: [
          {
            message: {
              content:
                'AI chat is almost ready! Please configure your OPENAI_API_KEY in the server .env file to enable full medical chat responses.',
            },
          },
        ],
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.5,
    });

    return res.json(completion);
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: { message: error.message || 'Internal server error' } });
  }
});

// 1) AI Symptom Checker
app.post('/api/symptom-checker', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ error: 'symptoms (string) is required' });
    }

    const specialist = mapSymptomsToSpecialist(symptoms);

    if (!openai) {
      // Rule-based fallback
      return res.json({
        possibleConditions: ['Viral Fever', 'Common Cold', 'Flu-like illness'],
        recommendation:
          'This is a basic estimation. Please monitor your symptoms and consult a physician if fever persists beyond 24 hours, pain worsens, or you feel weak.',
        suggestedSpecialist: specialist,
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'You are an AI symptom checker. Given user symptoms, suggest 3-6 most likely conditions and a short safety recommendation. Do NOT give diagnosis, only possibilities and safety advice.',
        },
        {
          role: 'user',
          content: `Symptoms: ${symptoms}. Respond in compact JSON with keys: possibleConditions (string[]), recommendation (string). Do NOT include any extra text.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    return res.json({
      ...parsed,
      suggestedSpecialist: specialist,
    });
  } catch (error) {
    console.error('Symptom checker error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to analyze symptoms. Please try again.' });
  }
});

// 2) Prescription Scanner (image upload + OCR + interpretation)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/prescription-scan', upload.single('prescription'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'prescription image is required' });
    }

    // Run OCR on the image buffer
    const { buffer } = req.file;

    const ocrResult = await Tesseract.recognize(buffer, 'eng');
    const text = ocrResult.data.text;

    if (!openai) {
      // Simple fallback that just returns OCR text
      return res.json({
        extractedText: text,
        medicines: [],
        note: 'AI interpretation requires OPENAI_API_KEY in .env. Currently only raw text is returned.',
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that reads a doctor prescription text and extracts medicine information in a safe, clear way.',
        },
        {
          role: 'user',
          content: `Here is OCR text from a prescription:\n\n${text}\n\nExtract each medicine with fields: name, dosage, frequency, purpose (what it is used for), and any important cautions. Respond as JSON { medicines: Medicine[] } only.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    return res.json({
      extractedText: text,
      medicines: parsed.medicines || [],
    });
  } catch (error) {
    console.error('Prescription scan error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to process prescription. Please try again.' });
  }
});

// 3) Smart Doctor Recommendation
app.get('/api/recommend-doctor', (req, res) => {
  try {
    const { symptoms } = req.query;
    if (!symptoms) {
      return res.status(400).json({ error: 'symptoms query parameter is required' });
    }

    const specialist = mapSymptomsToSpecialist(symptoms);
    const matching = doctors.filter((d) => d.specialization === specialist);

    const fallback =
      matching.length > 0
        ? matching
        : doctors.filter((d) => d.specialization === 'General Physician');

    return res.json({
      suggestedSpecialist: specialist,
      doctors: fallback,
    });
  } catch (error) {
    console.error('Doctor recommendation error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to recommend doctor. Please try again.' });
  }
});

// 4) AI Health Risk Prediction
app.post('/api/risk-prediction', (req, res) => {
  try {
    const { age, weight, bp, sugar } = req.body;

    if ([age, weight, bp, sugar].some((v) => v === undefined || v === null || v === '')) {
      return res.status(400).json({
        error: 'age, weight, bp, and sugar are all required numeric fields',
      });
    }

    const numericPayload = {
      age: Number(age),
      weight: Number(weight),
      bp: Number(bp),
      sugar: Number(sugar),
    };

    if (Object.values(numericPayload).some((v) => Number.isNaN(v))) {
      return res.status(400).json({ error: 'All fields must be valid numbers' });
    }

    const { score, level } = calculateRiskScore(numericPayload);

    return res.json({
      level,
      score,
      message:
        level === 'High'
          ? 'Your inputs suggest a higher risk. Please consult a doctor as soon as possible.'
          : level === 'Medium'
          ? 'Your risk appears moderate. Consider lifestyle changes and regular check-ups.'
          : 'Your risk looks low based on the entered data. Maintain a healthy lifestyle and routine check-ups.',
    });
  } catch (error) {
    console.error('Risk prediction error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to predict risk. Please try again.' });
  }
});

// 5) Emergency AI Call Assistant (text-based urgency classification)
app.post('/api/emergency', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'description (string) is required' });
    }

    if (!openai) {
      // Simple rule-based urgency
      const lower = description.toLowerCase();
      let level = 'Low';
      if (lower.includes('severe') || lower.includes('unconscious') || lower.includes('not breathing')) {
        level = 'Critical';
      } else if (lower.includes('chest pain') || lower.includes('heavy bleeding')) {
        level = 'High';
      } else if (lower.includes('dizziness') || lower.includes('shortness of breath')) {
        level = 'Medium';
      }
      return res.json({
        level,
        recommendation:
          level === 'Critical'
            ? 'Call emergency services immediately.'
            : level === 'High'
            ? 'Seek urgent medical care now.'
            : level === 'Medium'
            ? 'Monitor closely and consult a doctor soon.'
            : 'This does not sound like an emergency, but consult a doctor if unsure.',
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You classify medical emergencies based on a short description. Return JSON with fields: level (Critical | High | Medium | Low), recommendation (short text), and shouldCallAmbulance (boolean).',
        },
        {
          role: 'user',
          content: `Patient description: ${description}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    return res.json(parsed);
  } catch (error) {
    console.error('Emergency assistant error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to analyze emergency. Please call local emergency number.' });
  }
});

// 8 & 9) Very simple in-memory appointment + reminders demo
let appointments = [];
let reminders = [];

app.post('/api/appointments', (req, res) => {
  try {
    const { name, email, date, time, reason } = req.body;
    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: 'name, email, date and time are required' });
    }

    const newAppointment = {
      id: appointments.length + 1,
      name,
      email,
      date,
      time,
      reason: reason || '',
      createdAt: new Date().toISOString(),
      status: 'Scheduled',
    };

    appointments.push(newAppointment);

    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to create appointment. Please try again.' });
  }
});

app.get('/api/appointments', (req, res) => {
  return res.json(appointments);
});

app.post('/api/reminders', (req, res) => {
  try {
    const { medicineName, times, note } = req.body;
    if (!medicineName || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ error: 'medicineName and at least one time are required' });
    }

    const newReminder = {
      id: reminders.length + 1,
      medicineName,
      times,
      note: note || '',
      createdAt: new Date().toISOString(),
    };

    reminders.push(newReminder);
    return res.status(201).json(newReminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to create reminder. Please try again.' });
  }
});

app.get('/api/reminders', (req, res) => {
  return res.json(reminders);
});

app.get('/', (_req, res) => {
  res.send('Healthcare AI Assistant API is running');
});

app.listen(port, () => {
  console.log(`Healthcare AI Assistant API listening on http://localhost:${port}`);
});

