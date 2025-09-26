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

//create new hotel
export const postHotel=async(req,res)=>{
    try{
        const {userId}=getAuth(req);
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"Unauthorized",
            });
        }
        //get data from requst body
        const {name,description,location,pricePerNight,amenities,images}=req.body;

        //create stripe product
        console.log("Creating Stripe Product");
        const stripeProduct=await stripe.products.create({
            name: name,
            description:description || 'hotel accommodation',
            images:images.map(img=>img.url),
            default_price_data:{
                currency:'lkr',
                unit_amount:pricePerNight*100,
                recurring:{interval:'day'},
            },
        });
        console.log("Stripe Product Created:", stripeProduct.id);

        //create hotel in db
        const newHotel=new Hotels({
            name:name,
            ownerId:userId,
            description:description,
            location:location,
            pricePerNight:pricePerNight,
            amenities:amenities,
            images:images,
            stripePriceId:stripeProduct.default_price,
            createdAt:Date.now(),
        });

        //save to db
        const savedHotel=await newHotel.save();
        console.log("Hotel Saved to DB:", savedHotel._id);
        res.status(201).json({
            success:true,
            data:savedHotel,
        });

    }
    catch(error){
        console.error("Error in postHotel:", error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}