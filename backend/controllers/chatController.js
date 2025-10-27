const OpenAI = require('openai');
const { getAuth } = require('@clerk/clerk-sdk-node');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Proxy user message to OpenAI API
async function chatWithAI(req, res) {
  try {
    const { userId } = getAuth(req);
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
    res.status(500).json({ success: false, message: 'AI chat error' });
  }
}

module.exports = { chatWithAI };
