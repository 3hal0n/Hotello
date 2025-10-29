const express = require('express');
const router = express.Router();
const { createPaymentSession, paymentWebhook } = require('../controllers/paymentController');
const clerkAuth = require('../middleware/clerkAuth');

router.post('/session', clerkAuth, createPaymentSession);

// Stripe webhook - do not require auth; use raw body when registering in server if needed
router.post('/webhook', express.json(), paymentWebhook);

module.exports = router;
