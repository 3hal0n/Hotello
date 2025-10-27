const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true,
  },
  items: [
    {
      hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotels', required: true },
      roomType: { type: String },
      checkIn: { type: Date },
      checkOut: { type: Date },
      guests: { type: Number, default: 1 },
      price: { type: Number },
      image: { type: String },
    }
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);
