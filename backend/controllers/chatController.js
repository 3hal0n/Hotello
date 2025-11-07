const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Gemini AI (free tier, no quota issues)
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Proxy user message to AI API (tries Gemini first, falls back to OpenAI, then to fallback response)
async function chatWithAI(req, res) {
  const userId = req.auth?.userId || 'guest';
  
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message required' });
    }

    let aiResponse;
    let aiService = 'fallback';

    // Try Gemini AI first (free and more reliable)
    if (genAI && process.env.GEMINI_API_KEY) {
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
        aiService = 'Gemini AI';
        console.log('✅ Gemini AI chat success for user:', userId);
      } catch (geminiError) {
        console.log('⚠️ Gemini AI failed:', geminiError.message);
      }
    }

    // Fallback to OpenAI if Gemini failed
    if (!aiResponse && process.env.OPENAI_API_KEY) {
      try {
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
        aiService = 'OpenAI';
        console.log('✅ OpenAI chat success for user:', userId);
      } catch (openaiError) {
        console.log('⚠️ OpenAI also failed:', openaiError.message);
      }
    }

    // Final fallback - provide intelligent responses based on keywords
    if (!aiResponse) {
      aiService = 'Smart Fallback';
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('beach') || lowerMessage.includes('ocean') || lowerMessage.includes('sea')) {
        aiResponse = "Sri Lanka has stunning beaches! Check out Unawatuna for calm waters, Mirissa for whale watching, or Arugam Bay for surfing. Would you like me to show you hotels near any of these locations?";
      } else if (lowerMessage.includes('colombo') || lowerMessage.includes('city')) {
        aiResponse = "Colombo offers fantastic city hotels! From luxury properties like Shangri-La to boutique hotels in the Fort area. What's your budget and preferred area?";
      } else if (lowerMessage.includes('mountain') || lowerMessage.includes('hill') || lowerMessage.includes('kandy') || lowerMessage.includes('ella')) {
        aiResponse = "The hill country is magical! Kandy, Nuwara Eliya, and Ella offer cool climate and tea plantations. I can help you find the perfect mountain retreat!";
      } else if (lowerMessage.includes('safari') || lowerMessage.includes('wildlife') || lowerMessage.includes('yala')) {
        aiResponse = "Wildlife enthusiasts love Yala National Park! We have hotels near Yala, Udawalawe, and Wilpattu. Ready to spot elephants and leopards?";
      } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        aiResponse = "I can help you find great budget-friendly options! Sri Lanka has excellent guesthouses and mid-range hotels. What area interests you most?";
      } else if (lowerMessage.includes('luxury') || lowerMessage.includes('5 star') || lowerMessage.includes('resort')) {
        aiResponse = "Looking for luxury? Sri Lanka has world-class resorts! From Anantara to Shangri-La, I can show you the finest properties. Beach or city?";
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        aiResponse = "Hello! 👋 I'm your Sri Lanka hotel expert. Whether you're dreaming of beaches, mountains, or cultural sites, I'm here to help you find the perfect stay. What interests you?";
      } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        aiResponse = "You're welcome! Feel free to ask me anything about hotels or travel in Sri Lanka. I'm here to help! 😊";
      } else {
        aiResponse = "I'd love to help you find the perfect hotel in Sri Lanka! Could you tell me more about what you're looking for? Are you interested in beaches, cultural sites, mountains, or city stays?";
      }
      
      console.log('ℹ️ Using smart fallback response for user:', userId);
    }
    
    res.json({ success: true, response: aiResponse, service: aiService });
  } catch (error) {
    console.error('❌ AI chat error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      userId: userId,
    });
    
    // Provide user-friendly error response
    res.status(500).json({ 
      success: false, 
      message: 'AI chat error', 
      response: "I'm having a bit of trouble right now, but I'm still here to help! Could you rephrase your question about hotels in Sri Lanka?",
      error: error.message 
    });
  }
}

module.exports = { chatWithAI };
