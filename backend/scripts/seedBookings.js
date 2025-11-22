require('dotenv').config();
const mongoose = require('mongoose');
const Bookings = require('../models/Bookings');
const Hotels = require('../models/Hotels');
const Users = require('../models/Users');

const MONGO_URI = process.env.MONGO_URI;

async function seedBookings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get some hotels and users
    const hotels = await Hotels.find().limit(10);
    const users = await Users.find().limit(5);

    if (hotels.length === 0) {
      console.log('⚠️ No hotels found. Please run seedHotels.js first');
      process.exit(1);
    }

    console.log(`Found ${hotels.length} hotels and ${users.length} users`);

    // Create test clerk IDs if no users exist
    const testUserIds = users.length > 0 
      ? users.map(u => u.clerkId)
      : ['user_test_clerk_id_1', 'user_test_clerk_id_2', 'user_test_clerk_id_3'];

    // Clear existing bookings (optional)
    await Bookings.deleteMany({});
    console.log('Cleared existing bookings');

    // Create sample bookings
    const bookings = [];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const hotel = hotels[i % hotels.length];
      const userId = testUserIds[i % testUserIds.length];
      const checkInDays = Math.floor(Math.random() * 30);
      const stayDays = Math.floor(Math.random() * 5) + 1;
      
      const checkIn = new Date(today);
      checkIn.setDate(today.getDate() - checkInDays);
      
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + stayDays);

      const roomType = hotel.roomTypes[i % hotel.roomTypes.length];
      const totalAmount = roomType.price * stayDays;

      bookings.push({
        userId: userId,
        hotelId: hotel._id,
        roomType: roomType.type,
        guests: Math.floor(Math.random() * 4) + 1,
        checkIn: checkIn,
        checkOut: checkOut,
        totalAmount: totalAmount,
        paymentStatus: i < 10 ? 'paid' : 'pending', // First 10 are paid
        status: 'booked',
        createdAt: checkIn
      });
    }

    // Insert bookings
    const result = await Bookings.insertMany(bookings);
    console.log(`✅ Successfully inserted ${result.length} bookings`);

    // Calculate total revenue
    const paidBookings = result.filter(b => b.paymentStatus === 'paid');
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    console.log(`💰 Total revenue from paid bookings: $${totalRevenue.toLocaleString()}`);

    // Display sample bookings
    result.slice(0, 5).forEach((booking, index) => {
      console.log(`${index + 1}. User: ${booking.userId} - Hotel: ${booking.hotelId} - $${booking.totalAmount} - ${booking.paymentStatus}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding bookings:', error);
    process.exit(1);
  }
}

seedBookings();
