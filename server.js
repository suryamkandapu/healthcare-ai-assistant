import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const API_KEY = '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';

// Helper function to call OpenRouter API
async function callOpenRouter(userMessage, systemPrompt) {
  try {
    const response = await fetch('https://openrouter.io/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Healthcare AI Assistant',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'API Error');
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw error;
  }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://openrouter.io/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Healthcare AI Assistant',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'API Error' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Symptom Checker endpoint
app.post('/api/symptom-check', async (req, res) => {
  try {
    const { symptoms } = req.body;

    const analysis = await callOpenRouter(
      `Patient symptoms: ${symptoms}`,
      'You are a medical AI assistant. Analyze the symptoms and provide a JSON response with: { "conditions": [ { "name": "condition name", "probability": 75 } ], "recommendation": "See a doctor if..." }'
    );

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Prescription Scanner endpoint
app.post('/api/scan-prescription', async (req, res) => {
  try {
    const { imageData } = req.body;

    const analysis = await callOpenRouter(
      `Extract medicine information from prescription image and provide JSON: { "medicines": [ { "name": "med", "dose": "500mg", "frequency": "twice daily", "usage": "after meals", "warnings": "avoid with milk" } ] }`,
      'You are a pharmacy AI. Extract medicine information from prescriptions.'
    );

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor Recommendation endpoint
app.post('/api/recommend-doctor', async (req, res) => {
  try {
    const { symptoms, location } = req.body;

    // Mock doctor database
    const doctors = [
      {
        id: 1,
        name: 'Dr. Sarah Anderson',
        specialization: 'General Medicine',
        hospital: 'City Medical Center',
        rating: 4.9,
        available: true,
        nextAvailable: 'Today, 4:00 PM',
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialization: 'Cardiology',
        hospital: 'Heart Care Institute',
        rating: 4.8,
        available: true,
        nextAvailable: 'Tomorrow, 10:00 AM',
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialization: 'Internal Medicine',
        hospital: 'Wellness Hospital',
        rating: 4.7,
        available: false,
        nextAvailable: 'Day after, 2:00 PM',
      },
    ];

    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Risk Prediction endpoint
app.post('/api/predict-health-risk', async (req, res) => {
  try {
    const { age, weight, bloodPressure, bloodSugar } = req.body;

    const riskAnalysis = await callOpenRouter(
      `Health metrics - Age: ${age}, Weight: ${weight}kg, BP: ${bloodPressure}, Blood Sugar: ${bloodSugar}. Predict risks and provide JSON: { "risks": { "diabetes": "LOW", "heartDisease": "MEDIUM", "overall": "LOW" }, "recommendations": ["Exercise regularly", "Reduce salt intake"] }`,
      'You are a health risk analyst. Analyze health metrics and predict health risks.'
    );

    res.json({ success: true, riskAnalysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emergency Dispatch endpoint
app.post('/api/emergency-dispatch', async (req, res) => {
  try {
    const { location, urgency } = req.body;

    const dispatchInfo = {
      status: 'Ambulance Dispatched',
      ambulanceNumber: 'AMB-' + Math.floor(Math.random() * 10000),
      arrivalTime: '5 minutes',
      location: location,
      nearestHospital: 'City Medical Center, 0.8 km away',
      driver: 'John Smith',
      phone: '+1-555-0100',
    };

    res.json({ success: true, dispatchInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Monitoring endpoint
app.post('/api/health-metrics', async (req, res) => {
  try {
    const { userId } = req.body;

    const metrics = {
      heartRate: 72,
      bloodPressure: '120/80',
      sleepHours: 7.5,
      stepsToday: 8432,
      healthScore: 85,
      lastUpdated: new Date().toLocaleTimeString(),
    };

    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Smart Appointment endpoint
app.post('/api/appointment-system', async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const appointment = {
      id: 'APT-' + Math.floor(Math.random() * 100000),
      doctorId,
      date,
      time,
      status: 'Confirmed',
      reminder: '24 hours before appointment',
      createdAt: new Date().toISOString(),
    };

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Medicine Reminder endpoint
app.post('/api/medicine-reminders', async (req, res) => {
  try {
    const { medicineName, dose, times } = req.body;

    const reminder = {
      id: 'MED-' + Math.floor(Math.random() * 100000),
      medicineName,
      dose,
      times,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    res.json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Healthcare AI Server running on http://localhost:${PORT}`);
});
