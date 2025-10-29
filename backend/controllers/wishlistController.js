const Wishlist = require('../models/Wishlist');

// Get wishlist for current user
async function getWishlist(req, res) {
  try {
    const userId = req.auth?.userId;
    const wishlist = await Wishlist.findOne({ userId }).populate('hotels');
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

// Update wishlist for current user
async function updateWishlist(req, res) {
  try {
    const userId = req.auth?.userId;
    const { hotels } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { hotels, updatedAt: Date.now() },
      { upsert: true, new: true }
    ).populate('hotels');
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

module.exports = { getWishlist, updateWishlist };
