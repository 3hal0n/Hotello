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
      description: h.description || '',
      amenities: h.amenities || [],
      pricePerNight: h.pricePerNight,
      rating: h.rating
    }));

    const prompt = `You are an expert Sri Lankan hotel recommendation AI. Match hotels to this query: "${query}"

Hotels Database (${hotels.length} hotels):
${hotelSummaries.map((h, i) => `${i+1}. ${h.name}
   Location: ${h.location}
   Price: $${h.pricePerNight}/night
   Rating: ${h.rating || 4.5}⭐
   Amenities: ${h.amenities.join(', ')}
   Description: ${h.description.substring(0, 150)}`).join('\n\n')}

MATCHING RULES:
- Relaxing/Spa → Hotels with "Spa", "Wellness", "Pool" in amenities, peaceful locations (Bentota, Kandy, Nuwara Eliya)
- Beach/Coastal → Hotels in Unawatuna, Mirissa, Bentota, Tangalle, Negombo with "Beach Access"
- Romantic/Couples → Boutique hotels with "Beach", "Spa", "Fine Dining", quiet locations
- Family → Hotels with "Pool", "Kids Club", larger properties, family-friendly locations
- Business → Hotels in Colombo with "Conference", "WiFi", "Business Center"
- Exciting/Adventure → Hotels near Yala, Arugam Bay, Ella with "Safari", "Water Sports"
- Luxury → 5-star hotels with price >$200, premium amenities

Return ONLY a JSON array of hotel names (max 6, most relevant first):
["Hotel Name 1", "Hotel Name 2"]`;

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
