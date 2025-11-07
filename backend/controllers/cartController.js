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

// Add item to cart
async function addToCart(req, res) {
  try {
    const userId = req.auth?.userId;
    const newItem = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [newItem] });
    } else {
      cart.items.push(newItem);
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

module.exports = { getCart, updateCart, addToCart };
