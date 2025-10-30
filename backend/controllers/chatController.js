const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Proxy user message to OpenAI API
async function chatWithAI(req, res) {
  try {
    const userId = req.auth?.userId;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message required' });
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful hotel assistant.' },
        { role: 'user', content: message },
      ],
      max_tokens: 150,
    });
    const aiResponse = completion.choices[0].message.content;
    res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error('AI chat error:', {
      error: error,
      userId,
      body: req.body,
      auth: req.auth,
      openaiKey: process.env.OPENAI_API_KEY ? 'set' : 'missing',
    });
    res.status(500).json({ success: false, message: 'AI chat error', error: error.message });
  }
}

module.exports = { chatWithAI };
