const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const hotelsController = require('../controllers/hotelController');
const clerkAuth = require('../middleware/clerkAuth');

// helper to run validators
function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// GET /api/hotels
router.get('/', hotelsController.getHotels);

// GET /api/hotels/:id
router.get('/:id', [param('id').isMongoId()], runValidation, hotelsController.getHotelById);

// POST /api/hotels (protected, validate new fields)
router.post('/', clerkAuth, [
  body('name').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('location').isString().notEmpty(),
  body('geo').optional().isObject(),
  body('pricePerNight').isNumeric(),
  body('roomTypes').optional().isArray(),
  body('amenities').isArray(),
  body('policies').optional().isString(),
  body('images').optional().isArray(),
], runValidation, hotelsController.postHotel);

// PUT /api/hotels/:id (protected, validate new fields)
router.put('/:id', clerkAuth, [
  param('id').isMongoId(),
  body('name').optional().isString(),
  body('description').optional().isString(),
  body('location').optional().isString(),
  body('geo').optional().isObject(),
  body('pricePerNight').optional().isNumeric(),
  body('roomTypes').optional().isArray(),
  body('amenities').optional().isArray(),
  body('policies').optional().isString(),
  body('images').optional().isArray(),
], runValidation, hotelsController.updateHotel);

// DELETE /api/hotels/:id (protected)
router.delete('/:id', clerkAuth, [param('id').isMongoId()], runValidation, hotelsController.deleteHotel);

module.exports = router;
