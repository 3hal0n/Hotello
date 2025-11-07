const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Gemini AI (free tier, no quota issues)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDummy_Key_For_Testing');

// Proxy user message to AI API (tries Gemini first, falls back to OpenAI)
async function chatWithAI(req, res) {
  const userId = req.auth?.userId;
  
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message required' });
    }

    let aiResponse;

    // Try Gemini AI first (free and more reliable)
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are a helpful and friendly hotel booking assistant for Hotello, a hotel booking platform in Sri Lanka. 

Help users:
- Find hotels in Sri Lanka
- Answer questions about destinations
- Provide travel tips
- Assist with booking queries

Keep responses concise (2-3 sentences), helpful, and enthusiastic.

User message: ${message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiResponse = response.text();
      console.log('✅ Gemini AI chat success for user:', userId);
    } catch (geminiError) {
      console.log('⚠️ Gemini AI failed, trying OpenAI:', geminiError.message);
      
      // Fallback to OpenAI
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('No AI service available');
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
      
      aiResponse = completion.choices[0].message.content;
      console.log('✅ OpenAI chat success for user:', userId);
    }
    
    res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error('❌ AI chat error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      userId: userId,
    });
    
    // Provide user-friendly error response
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'The AI service has reached its usage limit. Please try again later.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'AI service configuration error. Please contact support.';
    } else if (error.message === 'No AI service available') {
      errorMessage = 'AI chat is currently unavailable. Please try again later.';
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
