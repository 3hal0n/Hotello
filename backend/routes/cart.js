const express = require('express');
const router = express.Router();
const { getCart, updateCart } = require('../controllers/cartController');
const { clerkAuth } = require('../middleware/clerkAuth');

router.get('/', clerkAuth, getCart);
router.put('/', clerkAuth, updateCart);

module.exports = router;
