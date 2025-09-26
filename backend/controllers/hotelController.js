import Hotels from "../models/hotelModel.js";
import {getAuth} from "@clerk/clerk-sdk-node";
import {stripe} from "../utils/stripe.js";

//Get all Hotels
export const getHotels=async(req,res)=>{
    try{
        console.log("Get Hotels Called");

        const hotels=await Hotels.find({});
        res.status(200).json({
            success:true,
            count:hotels.length,
            data:hotels,
        });
    }
    catch(error){
        console.error("Error in getHotels:", error);
        res.status(500).json({
            success:false,
            message:"Server Error"});
    }
}