const Hotels = require('../models/Hotels');
const { getAuth } = require('@clerk/clerk-sdk-node');
const { stripe } = require('../utils/stripe');

// Get all Hotels
async function getHotels(req, res) {
    try {
        console.log("Get Hotels Called", req.ip, req.headers['user-agent']);
        const hotels = await Hotels.find({}).lean();
        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels,
        });
    } catch (error) {
        console.error("Error in getHotels:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// get single hotel
async function getHotelById(req, res) {
    try {
        const hotelId = req.params.id;
        console.log("Get Hotel By ID Called:", hotelId);
        const hotel = await Hotels.findById(hotelId).lean();
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }
        // return found hotel
        return res.status(200).json({
            success: true,
            data: hotel,
        });
    } catch (error) {
        console.error("Error in getHotelById:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// create new hotel with roomTypes, geo, policies
async function postHotel(req, res) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        // get data from request body
        const { name, description, location, geo, pricePerNight, roomTypes, amenities, policies, images } = req.body;
        // create stripe product
        console.log("Creating Stripe Product");
        const stripeProduct = await stripe.products.create({
            name: name,
            description: description || 'hotel accommodation',
            images: images?.map(img => img.url) || [],
            default_price_data: {
                currency: 'lkr',
                unit_amount: pricePerNight * 100,
                recurring: { interval: 'day' },
            },
        });
        console.log("Stripe Product Created:", stripeProduct.id);
        // create hotel in db
        const newHotel = new Hotels({
            name,
            ownerId: userId,
            description,
            location,
            geo,
            pricePerNight,
            roomTypes,
            amenities,
            policies,
            images,
            stripePriceId: stripeProduct.default_price,
            createdAt: Date.now(),
        });
        // save to db
        const savedHotel = await newHotel.save();
        console.log("Hotel Saved to DB:", savedHotel._id);
        res.status(201).json({
            success: true,
            data: savedHotel,
        });
    } catch (error) {
        console.error("Error in postHotel:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// update hotel with new fields
async function updateHotel(req, res) {
    try {
        const hotelId = req.params.id;
        const updates = req.body;
        const { userId } = getAuth(req);
        // Only allow owner or admin to update
        const hotel = await Hotels.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        if (hotel.ownerId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        // Update allowed fields
        const allowedFields = ["name", "description", "location", "geo", "pricePerNight", "roomTypes", "amenities", "policies", "images"];
        for (const key of Object.keys(updates)) {
            if (allowedFields.includes(key)) {
                hotel[key] = updates[key];
            }
        }
        await hotel.save();
        return res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        console.error("Error in updateHotel:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Delete Hotel
async function deleteHotel(req, res) {
    try {
        const hotelId = req.params.id;
        // const {userId}=getAuth(req); // Remove or use this variable
        const deleteHotel = await Hotels.findByIdAndDelete(hotelId).lean();
        if (!deleteHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Hotel deleted',
        });
    } catch (error) {
        console.error("Error in deleteHotel:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

module.exports = {
    getHotels,
    getHotelById,
    postHotel,
    updateHotel,
    deleteHotel
};