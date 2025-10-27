const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const { clerkAuth } = require('../middleware/clerkAuth');

router.post('/', clerkAuth, getRecommendations);

module.exports = router;
