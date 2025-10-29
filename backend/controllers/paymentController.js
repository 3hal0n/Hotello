const { createCheckoutSession } = require('../utils/stripe');
const Bookings = require('../models/Bookings');
const Payments = require('../models/Payments');

// Create Stripe Checkout session for a booking (creates booking if needed)
async function createPaymentSession(req, res) {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Accept either bookingId (existing) or booking details to create a booking
    const { bookingId, hotelId, checkIn, checkOut, roomType, guests, totalAmount } = req.body;

    let booking;
    if (bookingId) {
      booking = await Bookings.findOne({ _id: bookingId, userId });
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      if (booking.paymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Booking already paid' });
    } else {
      // create provisional booking (payment pending)
      booking = await Bookings.create({
        userId,
        hotelId,
        roomType,
        guests,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        totalAmount: totalAmount || 0,
        paymentStatus: 'pending',
        status: 'booked',
      });
    }

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const successUrl = `${frontend}/payment-success?bookingId=${booking._id}`;
    const cancelUrl = `${frontend}/hotels/${booking.hotelId}`;

    const session = await createCheckoutSession({
      amount: booking.totalAmount,
      currency: 'lkr',
      successUrl,
      cancelUrl,
      metadata: { bookingId: booking._id.toString() },
      productName: `Booking - ${booking.hotelId}`,
    });

    // Optionally record a Payments entry with status pending
    await Payments.create({ bookingId: booking._id, paymentMethod: 'stripe', amount: booking.totalAmount, status: 'pending' });

    res.json({ success: true, url: session.url || session.id });
  } catch (error) {
    console.error('Error in createPaymentSession:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

// Webhook to receive Stripe events (checkout.session.completed)
async function paymentWebhook(req, res) {
  try {
    // In production verify signature. In development we accept JSON body.
    const event = req.body;

    // Support both Stripe event structure and our dev stub
    const type = event.type || event?.data?.type || (event && event.eventType);
    const obj = event.data?.object || event;

    if (type === 'checkout.session.completed' || type === 'checkout.session.succeeded') {
      const bookingId = obj.metadata?.bookingId;
      if (bookingId) {
        await Bookings.findByIdAndUpdate(bookingId, { paymentStatus: 'paid' });
        await Payments.findOneAndUpdate({ bookingId }, { status: 'completed' });
      }
    }

    // dev-stub also supports an explicit payload
    if (event && event.metadata && event.metadata.bookingId && (event.type === 'dev.checkout.completed')) {
      await Bookings.findByIdAndUpdate(event.metadata.bookingId, { paymentStatus: 'paid' });
      await Payments.findOneAndUpdate({ bookingId: event.metadata.bookingId }, { status: 'completed' });
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Webhook handler error');
  }
}

module.exports = { createPaymentSession, paymentWebhook };
