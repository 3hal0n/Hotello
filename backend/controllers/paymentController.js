const { createPaymentIntent } = require('../utils/stripe');
const Bookings = require('../models/Bookings');

// Create Stripe payment session for a booking
async function createPaymentSession(req, res) {
  try {
    const userId = req.auth?.userId;
    const { bookingId } = req.body;
    const booking = await Bookings.findOne({ _id: bookingId, userId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Booking already paid' });
    }
    const paymentIntent = await createPaymentIntent(booking.totalAmount, 'lkr');
    res.json({ success: true, clientSecret: paymentIntent.id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

module.exports = { createPaymentSession };
