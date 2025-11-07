const Hotels = require('../models/Hotels');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI-powered hotel recommendations based on emotion/keywords
async function getRecommendations(req, res) {
  try {
    const userId = req.auth?.userId;
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query required' });
    }
    
    // Get all hotels
    const hotels = await Hotels.find({}).lean();
    
    if (!hotels || hotels.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // If no OpenAI key, do basic keyword matching
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI not configured, using keyword matching');
      const queryLower = query.toLowerCase();
      const matchedHotels = hotels.filter(h => 
        h.name.toLowerCase().includes(queryLower) ||
        h.location.toLowerCase().includes(queryLower) ||
        h.description?.toLowerCase().includes(queryLower) ||
        h.amenities?.some(a => a.toLowerCase().includes(queryLower))
      );
      return res.json({ success: true, data: matchedHotels.slice(0, 6) });
    }

    // Use OpenAI to rank hotels based on query/emotion
    const hotelSummaries = hotels.map(h => ({
      name: h.name,
      location: h.location,
      description: h.description?.substring(0, 100),
      amenities: h.amenities?.slice(0, 5).join(', ')
    }));

    const prompt = `Given these hotels in Sri Lanka:
${hotelSummaries.map((h, i) => `${i+1}. ${h.name} in ${h.location} - ${h.description}`).join('\n')}

Based on the search query: "${query}"
Return a JSON array of hotel names that best match this query (max 6 hotels). Consider emotions, activities, and preferences in the query.
Return ONLY the JSON array, nothing else. Example: ["Hotel A", "Hotel B"]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are a hotel recommendation AI. Analyze user emotions and preferences to suggest hotels. Return only a JSON array of hotel names.' 
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    let recommendedNames = [];
    try {
      const responseText = completion.choices[0].message.content.trim();
      recommendedNames = JSON.parse(responseText);
      if (!Array.isArray(recommendedNames)) {
        recommendedNames = [];
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to keyword matching
      const queryLower = query.toLowerCase();
      const matchedHotels = hotels.filter(h => 
        h.name.toLowerCase().includes(queryLower) ||
        h.location.toLowerCase().includes(queryLower) ||
        h.description?.toLowerCase().includes(queryLower)
      );
      return res.json({ success: true, data: matchedHotels.slice(0, 6) });
    }

    // Filter hotels by recommended names
    const recommendedHotels = hotels.filter(h => recommendedNames.includes(h.name));
    
    console.log('AI recommendations for query:', query, 'Found:', recommendedHotels.length);
    res.json({ success: true, data: recommendedHotels });
  } catch (error) {
    console.error('Recommendation error:', error);
    // Fallback to returning all hotels
    try {
      const hotels = await Hotels.find({}).limit(6).lean();
      res.json({ success: true, data: hotels });
    } catch (dbError) {
      res.status(500).json({ success: false, message: 'Recommendation error', error: error.message });
    }
  }
}

module.exports = { getRecommendations };
