const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const clerkAuth = require('../middleware/clerkAuth');
const Hotels = require('../models/Hotels');

// POST for AI recommendations
router.post('/', clerkAuth, getRecommendations);

// GET for general recommendations (top rated hotels)
router.get('/', async (req, res) => {
  try {
    // Return top rated hotels as recommendations
    const hotels = await Hotels.find()
      .sort({ rating: -1, pricePerNight: 1 })
      .limit(8);
    
    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
});

module.exports = router;
