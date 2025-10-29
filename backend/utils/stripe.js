// Stripe utility: use real Stripe in production, stub in development
let stripe;
if (process.env.NODE_ENV === 'production') {
  const Stripe = require('stripe');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  stripe = {
    products: {
      create: async (data) => ({
        id: 'prod_test_123',
        default_price: 'price_test_123',
        ...data,
      })
    },
    paymentIntents: {
      create: async (data) => ({ id: 'pi_test_123', status: 'succeeded', ...data })
    },
    refunds: {
      create: async (data) => ({ id: 're_test_123', status: 'succeeded', ...data })
    }
  };
}

async function createPaymentIntent(amount, currency = 'lkr') {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
  });
}

// Create a Stripe Checkout session (hosted payment page)
async function createCheckoutSession({amount, currency = 'lkr', successUrl, cancelUrl, metadata = {}, productName = 'Booking'}) {
  if (process.env.NODE_ENV === 'production') {
    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: productName },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });
  }

  // Development stub: return a fake URL that redirects back to frontend success page
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
  const sessionId = 'cs_test_123';
  return {
    id: sessionId,
    url: `${frontend}/payment-success?session_id=${sessionId}&bookingId=${metadata.bookingId}`,
  };
}

async function refundPayment(paymentIntentId) {
  return stripe.refunds.create({ payment_intent: paymentIntentId });
}

module.exports = { stripe, createPaymentIntent, refundPayment };
