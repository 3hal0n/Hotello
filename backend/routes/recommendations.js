const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const clerkAuth = require('../middleware/clerkAuth');
const Hotels = require('../models/Hotels');

// POST for AI recommendations - Optional auth (works for both guests and signed-in users)
router.post('/', (req, res, next) => {
  // Try to authenticate, but don't fail if no token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    clerkAuth(req, res, next);
  } else {
    // No auth - continue as guest user
    req.auth = { userId: 'guest' };
    next();
  }
}, getRecommendations);

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
