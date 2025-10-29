const Bookings = require('../models/Bookings');
const Hotels = require('../models/Hotels');

// Create booking with roomType, guests, paymentStatus, and improved availability check
async function createBooking(req, res) {
  try {
    // Get userId from auth middleware
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { hotelId, checkIn, checkOut, roomType, guests } = req.body;
    if (!hotelId || !checkIn || !checkOut || !roomType || !guests) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const hotel = await Hotels.findById(hotelId).lean();
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

    // Find room type details
    const roomDetails = hotel.roomTypes?.find(rt => rt.type === roomType);
    if (!roomDetails || roomDetails.available < guests) {
      return res.status(409).json({ success: false, message: 'Requested room type not available for number of guests' });
    }

    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (ci >= co) return res.status(400).json({ success: false, message: 'Invalid dates' });

    // Check for overlapping bookings for the same hotel and room type
    const overlapping = await Bookings.findOne({
      hotelId,
      roomType,
      $or: [
        { checkIn: { $lte: co }, checkOut: { $gte: ci } },
      ]
    });
    if (overlapping) return res.status(409).json({ success: false, message: 'Dates not available for this room type' });

    const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
    const pricePerNight = roomDetails.price || hotel.pricePerNight || 0;
    const totalAmount = nights * pricePerNight * guests;

    const booking = await Bookings.create({
      userId,
      hotelId,
      roomType,
      guests,
      checkIn: ci,
      checkOut: co,
      totalAmount,
      paymentStatus: 'pending',
      status: 'booked',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error('Error in createBooking:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

// Get booking details with hotel and user info
async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = await Bookings.findById(id)
      .populate('hotelId')
      .populate('userId')
      .lean();
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error('Error in getBookingById:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

module.exports = { createBooking, getBookingById };
