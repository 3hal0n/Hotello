const express = require('express');
const router = express.Router();
const clerkAuth = require('../middleware/clerkAuth');

router.get('/protected', clerkAuth, (req, res) => {
  res.json({ message: 'Hello ' + (req.auth?.userId || 'guest') });
});

module.exports = router;