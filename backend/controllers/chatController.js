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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'AI service not configured',
        response: 'Sorry, the AI chat service is currently unavailable. Please contact support.' 
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful and friendly hotel booking assistant for Hotello. Help users find hotels in Sri Lanka, answer questions about destinations, provide travel tips, and assist with booking queries. Keep responses concise, helpful, and enthusiastic.' 
        },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    
    const aiResponse = completion.choices[0].message.content;
    console.log('AI chat success for user:', userId);
    res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error('AI chat error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      userId,
      hasApiKey: !!process.env.OPENAI_API_KEY,
    });
    
    // Provide user-friendly error response
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'The AI service has reached its usage limit. Please try again later.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'AI service configuration error. Please contact support.';
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'AI chat error', 
      response: errorMessage,
      error: error.message 
    });
  }
}

module.exports = { chatWithAI };
