import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const API_KEY = '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';

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

app.listen(PORT, () => {
  console.log(`Healthcare AI Server running on http://localhost:${PORT}`);
});
