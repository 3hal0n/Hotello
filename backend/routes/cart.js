const express = require('express');
const router = express.Router();
const { getCart, updateCart, addToCart } = require('../controllers/cartController');
const clerkAuth = require('../middleware/clerkAuth');

router.get('/', clerkAuth, getCart);
router.put('/', clerkAuth, updateCart);
router.post('/add', clerkAuth, addToCart);

module.exports = router;
