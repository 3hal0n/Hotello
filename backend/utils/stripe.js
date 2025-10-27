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

async function refundPayment(paymentIntentId) {
  return stripe.refunds.create({ payment_intent: paymentIntentId });
}

module.exports = { stripe, createPaymentIntent, refundPayment };
