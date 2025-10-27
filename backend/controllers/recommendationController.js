const Hotels = require('../models/Hotels');
const { Configuration, OpenAIApi } = require('openai');
const { getAuth } = require('@clerk/clerk-sdk-node');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// AI-powered hotel recommendations based on emotion/keywords
async function getRecommendations(req, res) {
  try {
    const { userId } = getAuth(req);
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query required' });
    }
    // Get all hotels
    const hotels = await Hotels.find({}).lean();
    // Use OpenAI to rank hotels based on query/emotion
    const prompt = `Given the following hotels: ${hotels.map(h => h.name + ' in ' + h.location).join(', ')}. Recommend the best matches for: "${query}". Return hotel names as a JSON array.`;
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a hotel recommendation engine.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 150,
    });
    let recommendedNames = [];
    try {
      recommendedNames = JSON.parse(completion.data.choices[0].message.content);
    } catch {
      recommendedNames = [];
    }
    // Filter hotels by recommended names
    const recommendedHotels = hotels.filter(h => recommendedNames.includes(h.name));
    res.json({ success: true, data: recommendedHotels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Recommendation error' });
  }
}

module.exports = { getRecommendations };
