const mongoose=require('mongoose');

const paymentSchema=new mongoose.Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking',
        required:true,
    },
    paypalOrderId:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:['pending','completed','failed'],
        default:'pending',
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },

});
module.exports=mongoose.model("Payments",paymentSchema)