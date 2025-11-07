require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotello';

// Middleware
app.use(cors());
app.use(express.json());

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const protectedRoutes = require('./routes/protected');
app.use('/api', protectedRoutes);
const hotelsRoutes = require('./routes/hotels');
app.use('/api/hotels', hotelsRoutes);
const bookingsRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingsRoutes);
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);
const wishlistRoutes = require('./routes/wishlist');
app.use('/api/wishlist', wishlistRoutes);
const paymentsRoutes = require('./routes/payments');
app.use('/api/payments', paymentsRoutes);
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);
const recommendationsRoutes = require('./routes/recommendations');
app.use('/api/recommendations', recommendationsRoutes);

// Image proxy (to avoid CORS issues when loading third-party images)
const imageProxy = require('./routes/imageProxy');
app.use('/api/proxy-image', imageProxy);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Only connect to MongoDB and start the server when run directly
if (require.main === module) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;