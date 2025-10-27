const express = require('express');
const router = express.Router();
const { createPaymentSession } = require('../controllers/paymentController');
const { clerkAuth } = require('../middleware/clerkAuth');

router.post('/session', clerkAuth, createPaymentSession);

module.exports = router;
