const mongoose=require('mongoose');

const hotelSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    geo: {
        type: { lat: Number, lng: Number },
    },
    pricePerNight: {
        type: Number,
        required: true,
    },
    roomTypes: [
        {
            type: { type: String },
            price: Number,
            available: Number,
        }
    ],
    amenities: {
        type: [String],
        required: true,
    },
    policies: {
        type: String,
    },
    images: [
        {
            url: String,
            public_id: String,
        }
    ],
    rating: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Hotels", hotelSchema);