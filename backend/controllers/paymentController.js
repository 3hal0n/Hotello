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

  // Debug logging to help verify which frontend URL is used in production (Inspect Render logs)
  console.log('Creating checkout session with FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('Constructed successUrl:', successUrl);
  console.log('Constructed cancelUrl:', cancelUrl);

    const session = await createCheckoutSession({
      amount: booking.totalAmount,
      currency: 'usd',
      successUrl,
      cancelUrl,
      metadata: { bookingId: booking._id.toString() },
      productName: `Hotel Booking - ${booking.hotelId}`,
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
    const event = req.body;

    // Log incoming event for debugging (inspect Render/production logs)
    console.log('Stripe webhook received:', event?.type);

    // In development, accept JSON events without signature verification
    // In production, you should verify the webhook signature using stripe.webhooks.constructEvent
    // For now, we'll accept the events as-is for testing
    const type = event.type;

    if (type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      console.log('Webhook session metadata:', session?.metadata);

      if (bookingId) {
        await Bookings.findByIdAndUpdate(bookingId, { paymentStatus: 'paid' });
        await Payments.findOneAndUpdate({ bookingId }, { status: 'completed' });
        console.log(`Payment completed for booking ${bookingId}`);
      } else {
        console.warn('Webhook received but no bookingId metadata present on session');
      }
    } else {
      console.log('Webhook ignored, type:', type);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Webhook handler error');
  }
}

module.exports = { createPaymentSession, paymentWebhook };
