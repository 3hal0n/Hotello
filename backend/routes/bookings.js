const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const clerkAuth = require('../middleware/clerkAuth');

// Create booking (protected, validate roomType and guests)
const { body, param, validationResult } = require('express-validator');

function runValidation(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

router.post('/', clerkAuth, [
	body('hotelId').isMongoId(),
	body('roomType').isString().notEmpty(),
	body('guests').isInt({ min: 1 }),
	body('checkIn').isISO8601(),
	body('checkOut').isISO8601(),
], runValidation, bookingController.createBooking);

// Get bookings for current user
router.get('/', clerkAuth, bookingController.getUserBookings);

// Get booking by id
router.get('/:id', clerkAuth, [param('id').isMongoId()], runValidation, bookingController.getBookingById);

module.exports = router;
