const Cart = require('../models/Cart');

// Get cart for current user
async function getCart(req, res) {
  try {
    const userId = req.auth?.userId;
    const cart = await Cart.findOne({ userId }).populate('items.hotelId');
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

// Update cart for current user
async function updateCart(req, res) {
  try {
    const userId = req.auth?.userId;
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items, updatedAt: Date.now() },
      { upsert: true, new: true }
    ).populate('items.hotelId');
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

module.exports = { getCart, updateCart };
