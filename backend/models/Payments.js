const mongoose=require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bookings',
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['paypal', 'stripe', 'card', 'cash'],
        required: true,
    },
    transactionId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Payments", paymentSchema);