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
};

//get single hotel
export const getHotelById=async(req,res)=>{
    try{
        const hotelId=req.params.id;
        console.log("Get Hotel By ID Called:", hotelId);

        const hotel=await Hotels.findById(hotelId);
        if(!hotel){
            return res.status(404).json({
                success:false,
                message:"Hotel not found",

            })
        }
    }
    catch(error){
        console.error("Error in getHotelById:", error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
};