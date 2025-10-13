// Minimal stripe stub for tests and development when real stripe config is not present
// In production, replace this with the real stripe instance: const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const stripe = {
  products: {
    create: async (data) => {
      return {
        id: 'prod_test_123',
        default_price: 'price_test_123',
        ...data,
      };
    }
  }
};

module.exports = { stripe };
