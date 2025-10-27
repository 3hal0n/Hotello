const mongoose=require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        }
    ],
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotels',
    },
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
        }
    ],
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Chats", chatSchema);