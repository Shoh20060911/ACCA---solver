const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/solve', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { question, subject } = req.body;

  const systemPrompt = `You are an expert ACCA (Association of Chartered Certified Accountants) tutor. Solve ACCA exam questions with crystal-clear, step-by-step working.

For every question:
1. Identify the topic/concept being tested
2. State the formula(s) to be used
3. Show every calculation step, labelled Step 1, Step 2, etc.
4. State the FINAL ANSWER clearly at the end with ✅
5. Add a brief Examiner Tip where relevant

Use plain text only. Be precise and exam-focused.
Current paper context: ${subject}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: question }] }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
    res.json({ text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ACCA Solver running on port ${PORT}`));
