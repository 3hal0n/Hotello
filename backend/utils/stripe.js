// Stripe utility: use real Stripe SDK in both development (test mode) and production
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

async function createPaymentIntent(amount, currency = 'lkr') {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
  });
}

// Create a Stripe Checkout session (hosted payment page)
async function createCheckoutSession({amount, currency = 'usd', successUrl, cancelUrl, metadata = {}, productName = 'Booking'}) {
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

async function refundPayment(paymentIntentId) {
  return stripe.refunds.create({ payment_intent: paymentIntentId });
}

module.exports = { stripe, createPaymentIntent, createCheckoutSession, refundPayment };
