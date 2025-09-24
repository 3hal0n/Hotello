const mongoose=require('mongoose');

const hotelSchema=mongoose.Schema({
    ownerId:{
        type:String,
        required:true,
    },
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,   
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    pricePerNight:{
        type: Number,
        required: true,
    },
    amenities:{
        type: [String], 
        required: true,
    },
    images:[
        {
            url: String,
            public_id: String,
        }
    ],
    rating:{
        type:Number,
        default:0,
    },
    createdAt:{
        type:Date,
        default: Date.now,
    },

});
module.exports=mongoose.model("Hotels",hotelSchema); 