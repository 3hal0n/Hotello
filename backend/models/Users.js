const mongoose=require('mongoose');

const usersSchema=mongoose.Schema({
    clerId:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    email:{
        type:email,
        required: true,
    },
    role:{
        type: String,
        enum: ['user', 'admin', 'hotelOwner'],
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
})