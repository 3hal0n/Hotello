const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/chatController');
const clerkAuth = require('../middleware/clerkAuth');

// Optional auth - works with or without authentication
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
}, chatWithAI);

module.exports = router;
