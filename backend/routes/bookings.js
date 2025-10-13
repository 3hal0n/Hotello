const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const clerkAuth = require('../middleware/clerkAuth');

// Create booking (protected)
router.post('/', clerkAuth, bookingController.createBooking);

// Get booking by id
router.get('/:id', clerkAuth, bookingController.getBookingById);

module.exports = router;
