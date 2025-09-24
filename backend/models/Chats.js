const mongoose=require('mongoose');

const chatSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    messages:[
        {
            sender:{type:String, 
            required:true,},
            text:{type:String,required:true,},  
            timestamp:{type:Date,default:Date.now,}
        }
    ],
    createdAt:{type:Date,default:Date.now,},
});
module.exports=mongoose.model("Chats",chatSchema);