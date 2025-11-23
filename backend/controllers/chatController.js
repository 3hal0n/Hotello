const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Hotels = require('../models/Hotels');

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

    // Get hotel data for context
    let hotelContext = '';
    try {
      const hotels = await Hotels.find({}).limit(20).lean();
      if (hotels.length > 0) {
        const locations = [...new Set(hotels.map(h => h.location))];
        const avgPrice = Math.round(hotels.reduce((sum, h) => sum + h.pricePerNight, 0) / hotels.length);
        hotelContext = `\n\nHotel Database Context:\n- ${hotels.length} hotels available in Sri Lanka\n- Popular locations: ${locations.slice(0, 10).join(', ')}\n- Average price: $${avgPrice}/night\n- Top hotels: ${hotels.slice(0, 5).map(h => `${h.name} in ${h.location}`).join(', ')}`;
      }
    } catch (dbError) {
      console.log('⚠️ Could not fetch hotel context:', dbError.message);
    }

    let aiResponse;
    let aiService = 'fallback';

    // Try Gemini AI first (free and more reliable)
    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `You are Hotello AI, an expert Sri Lankan travel assistant specializing in hotel recommendations.

YOUR ROLE:
- Recommend specific hotels from our database
- Provide detailed destination advice for Sri Lanka
- Suggest itineraries and travel tips
- Help with location-specific queries (beaches, mountains, cities, wildlife)

KEY LOCATIONS IN SRI LANKA:
- Colombo (city, business, shopping)
- Kandy (cultural, hills, temples)
- Galle/Unawatuna (beaches, fort, coastal)
- Mirissa/Tangalle (beaches, whale watching)
- Ella/Nuwara Eliya (mountains, tea plantations, hiking)
- Yala/Udawalawe (safari, wildlife)
- Arugam Bay (surfing, adventure)
- Bentota/Negombo (beach resorts)
${hotelContext}

RESPONSE RULES:
1. Be specific - mention actual hotel names and locations when relevant
2. Keep responses 2-4 sentences, friendly and enthusiastic
3. If user asks about family/romantic/beach/business hotels, recommend specific areas and mention we have options there
4. For vague queries, ask ONE clarifying question about preference (beach/city/mountains or budget)

User: ${message}
Assistant:`;

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
      
      if (lowerMessage.includes('family') || lowerMessage.includes('kid') || lowerMessage.includes('children')) {
        aiResponse = "Perfect! For families, I recommend hotels in Bentota (beach resorts with kids clubs), Kandy (cultural exploration), or Nuwara Eliya (cool climate). Most have pools and family-friendly amenities. Which location sounds best?";
      } else if (lowerMessage.includes('romantic') || lowerMessage.includes('honeymoon') || lowerMessage.includes('couple')) {
        aiResponse = "How romantic! 💑 Sri Lanka has amazing spots for couples: Mirissa and Tangalle for secluded beaches, Ella for mountain romance, or boutique hotels in Galle Fort. What's your vibe - beach or mountains?";
      } else if (lowerMessage.includes('beach') || lowerMessage.includes('ocean') || lowerMessage.includes('sea') || lowerMessage.includes('coastal')) {
        aiResponse = "Sri Lanka's beaches are incredible! 🏖️ Unawatuna (calm, family-friendly), Mirissa (whale watching, sunset), Tangalle (secluded), Arugam Bay (surfing), or Bentota (luxury resorts). Which appeals to you?";
      } else if (lowerMessage.includes('business') || lowerMessage.includes('work') || lowerMessage.includes('conference')) {
        aiResponse = "For business stays, Colombo is your best bet! 💼 We have hotels with conference rooms, business centers, and excellent WiFi near the airport and city center. How many days will you need?";
      } else if (lowerMessage.includes('colombo') || lowerMessage.includes('city')) {
        aiResponse = "Colombo offers everything from luxury hotels to boutique stays! Near the Fort for heritage charm, Galle Face for ocean views, or Cinnamon Gardens for tranquility. What's your priority?";
      } else if (lowerMessage.includes('mountain') || lowerMessage.includes('hill') || lowerMessage.includes('kandy') || lowerMessage.includes('ella') || lowerMessage.includes('nuwara')) {
        aiResponse = "The hill country is breathtaking! ⛰️ Kandy (cultural hub, Temple of the Tooth), Ella (hiking, Nine Arch Bridge), or Nuwara Eliya (tea estates, cool climate). Adventure or relaxation?";
      } else if (lowerMessage.includes('safari') || lowerMessage.includes('wildlife') || lowerMessage.includes('yala') || lowerMessage.includes('elephant')) {
        aiResponse = "Wildlife safari! 🐘 Yala National Park is famous for leopards and elephants. We have hotels right at the park entrance. Best visited February-July. Interested in a 2-day safari package?";
      } else if (lowerMessage.includes('spa') || lowerMessage.includes('relax') || lowerMessage.includes('wellness')) {
        aiResponse = "Relaxation time! 😌 Our spa hotels in Bentota, Kandy, and Nuwara Eliya offer Ayurvedic treatments, yoga, and wellness packages. Looking for beachside or mountain serenity?";
      } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        aiResponse = "Great value options available! We have comfortable mid-range hotels ($50-100/night) across all major destinations. Which location interests you - beach, city, or mountains?";
      } else if (lowerMessage.includes('luxury') || lowerMessage.includes('5 star') || lowerMessage.includes('resort')) {
        aiResponse = "Luxury it is! ✨ Top picks: Shangri-La Colombo (city), Anantara Peace Haven (beach), Jetwing Vil Uyana (safari). Beach, city, or nature?";
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        aiResponse = "Hello! 👋 I'm Hotello AI, your Sri Lankan travel expert. I can recommend hotels for beaches 🏖️, mountains ⛰️, safaris 🐘, cities 🏙️, or any vibe you're after! What brings you to Sri Lanka?";
      } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        aiResponse = "You're so welcome! 😊 Feel free to ask about specific locations, hotel recommendations, or travel tips anytime!";
      } else {
        aiResponse = "I'd love to help you find the perfect Sri Lankan hotel! 🌴 Are you looking for: Beach 🏖️ | Mountains ⛰️ | City 🏙️ | Safari 🐘 | Spa 😌 ? Or tell me your travel style!";
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
