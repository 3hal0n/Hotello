const Hotels = require('../models/Hotels');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// AI-powered hotel recommendations based on emotion/keywords using Gemini
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

    // If no Gemini key, do basic keyword matching
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.log('Gemini AI not configured, using keyword matching');
      const queryLower = query.toLowerCase();
      const matchedHotels = hotels.filter(h => 
        h.name.toLowerCase().includes(queryLower) ||
        h.location.toLowerCase().includes(queryLower) ||
        h.description?.toLowerCase().includes(queryLower) ||
        h.amenities?.some(a => a.toLowerCase().includes(queryLower))
      );
      return res.json({ success: true, data: matchedHotels.slice(0, 6), aiUsed: false });
    }

    // Use Gemini AI to rank hotels based on query/emotion
    const hotelSummaries = hotels.map(h => ({
      name: h.name,
      location: h.location,
      description: h.description?.substring(0, 100),
      amenities: h.amenities?.slice(0, 5).join(', ')
    }));

    const prompt = `You are an expert hotel recommendation AI for Sri Lanka. Analyze the user's query and match it with the best hotels.

Available hotels:
${hotelSummaries.map((h, i) => `${i+1}. ${h.name} in ${h.location} - ${h.description}\nAmenities: ${h.amenities}`).join('\n\n')}

User query: "${query}"

Analyze the emotional tone, preferences, and requirements in the query. Consider:
- Mood and atmosphere (relaxing, exciting, romantic, family-friendly, business)
- Location preferences and activities
- Amenities that match the query
- Price and luxury level implied by the query

Return a JSON array of hotel names that best match (max 6 hotels, ordered by relevance).
Return ONLY the JSON array, nothing else. Example format: ["Hotel Name 1", "Hotel Name 2"]`;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text().trim();
      
      console.log('✅ Gemini AI recommendations response:', responseText.substring(0, 100));
      
      // Extract JSON array from response (handle markdown code blocks)
      let jsonText = responseText;
      if (responseText.includes('```json')) {
        jsonText = responseText.match(/```json\s*([\s\S]*?)```/)?.[1] || responseText;
      } else if (responseText.includes('```')) {
        jsonText = responseText.match(/```\s*([\s\S]*?)```/)?.[1] || responseText;
      }
      
      const recommendedNames = JSON.parse(jsonText.trim());
      
      if (!Array.isArray(recommendedNames)) {
        throw new Error('Response is not an array');
      }
      
      // Filter hotels by recommended names
      const recommendedHotels = hotels.filter(h => recommendedNames.includes(h.name));
      
      console.log('✅ Gemini AI recommendations for query:', query, 'Found:', recommendedHotels.length, 'hotels');
      return res.json({ success: true, data: recommendedHotels, aiUsed: true });
      
    } catch (geminiError) {
      console.error('⚠️ Gemini AI error:', geminiError.message);
      // Fallback to keyword matching
      const queryLower = query.toLowerCase();
      const matchedHotels = hotels.filter(h => 
        h.name.toLowerCase().includes(queryLower) ||
        h.location.toLowerCase().includes(queryLower) ||
        h.description?.toLowerCase().includes(queryLower) ||
        h.amenities?.some(a => a.toLowerCase().includes(queryLower))
      );
      return res.json({ success: true, data: matchedHotels.slice(0, 6), aiUsed: false });
    }
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
