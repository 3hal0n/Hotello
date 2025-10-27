const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotello';

// Middleware
app.use(cors());
app.use(express.json());

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