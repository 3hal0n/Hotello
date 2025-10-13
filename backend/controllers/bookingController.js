const Bookings = require('../models/Bookings');
const Hotels = require('../models/Hotels');
const { getAuth } = require('@clerk/clerk-sdk-node');

// Create booking (PENDING -> 'booked')
async function createBooking(req, res) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { hotelId, checkIn, checkOut } = req.body;
    if (!hotelId || !checkIn || !checkOut) return res.status(400).json({ success: false, message: 'Missing fields' });

    const hotel = await Hotels.findById(hotelId).lean();
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (ci >= co) return res.status(400).json({ success: false, message: 'Invalid dates' });

    // naive availability check: ensure no overlapping bookings for the same hotel
    const overlapping = await Bookings.findOne({
      hotelId,
      $or: [
        { checkIn: { $lte: co }, checkOut: { $gte: ci } },
      ]
    });
    if (overlapping) return res.status(409).json({ success: false, message: 'Dates not available' });

    const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * (hotel.pricePerNight || 0);

    const booking = await Bookings.create({
      userId,
      hotelId,
      checkIn: ci,
      checkOut: co,
      totalAmount,
      status: 'booked',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error('Error in createBooking:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

// Get booking details
async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = await Bookings.findById(id).lean();
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error('Error in getBookingById:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

module.exports = { createBooking, getBookingById };
