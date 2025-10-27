const mongoose=require('mongoose');

const userSchema = mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'hotelOwner'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
module.exports = mongoose.model("Users", userSchema);