const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  login,
  getDashboardStats,
  getAllHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  getAllBookings,
  getAllUsers
} = require('../controllers/adminController');

// Public routes
router.post('/login', login);

// Protected routes (require admin authentication)
router.get('/dashboard/stats', adminAuth, getDashboardStats);
router.get('/hotels', adminAuth, getAllHotels);
router.post('/hotels', adminAuth, createHotel);
router.put('/hotels/:id', adminAuth, updateHotel);
router.delete('/hotels/:id', adminAuth, deleteHotel);
router.get('/bookings', adminAuth, getAllBookings);
router.get('/users', adminAuth, getAllUsers);

module.exports = router;
