const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/chatController');
const clerkAuth = require('../middleware/clerkAuth');

router.post('/', clerkAuth, chatWithAI);

module.exports = router;
