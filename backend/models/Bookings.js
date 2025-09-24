const mongoose=require('mongoose');

const bookingSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    hotelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel',
        required:true,
    },
    checkIn:{
        type:Date,
        required:true,
    },
    checkOut:{
        type:Date,
        required:true,
    },
    totalAmount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:['booked','cancelled','completed'],
        default:'booked',
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

module.exports=mongoose.model("Bookings",bookingSchema);