const express = require('express');
const router = express.Router();
const { getWishlist, updateWishlist } = require('../controllers/wishlistController');
const { clerkAuth } = require('../middleware/clerkAuth');

router.get('/', clerkAuth, getWishlist);
router.put('/', clerkAuth, updateWishlist);

module.exports = router;
