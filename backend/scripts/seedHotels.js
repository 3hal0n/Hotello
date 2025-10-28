require('dotenv').config();
const mongoose = require('mongoose');
const Hotels = require('../models/Hotels');

const MONGO_URI = process.env.MONGO_URI;

const sriLankanHotels = Array.from({ length: 20 }, (_, i) => ({
  ownerId: new mongoose.Types.ObjectId(),
  name: [
    'Cinnamon Grand Colombo', 'Jetwing Lighthouse', 'Galle Face Hotel', 'Heritance Kandalama', 'Anantara Peace Haven Tangalle',
    'Cinnamon Lodge Habarana', 'Grand Hotel Nuwara Eliya', 'Uga Bay Pasikuda', 'The Fortress Resort & Spa', 'Shangri-La Colombo',
    'Taj Bentota Resort & Spa', 'Amaya Lake Dambulla', 'Mount Lavinia Hotel', 'Avani Kalutara Resort', 'The Blue Water Wadduwa',
    'Jetwing Blue Negombo', 'Earl’s Regency Kandy', 'Araliya Green Hills Nuwara Eliya', 'Hikka Tranz by Cinnamon', 'Amari Galle'
  ][i],
  description: `Luxury hotel in ${[
    'Colombo', 'Galle', 'Colombo', 'Dambulla', 'Tangalle', 'Habarana', 'Nuwara Eliya', 'Pasikuda', 'Galle', 'Colombo',
    'Bentota', 'Dambulla', 'Mount Lavinia', 'Kalutara', 'Wadduwa', 'Negombo', 'Kandy', 'Nuwara Eliya', 'Hikkaduwa', 'Galle'
  ][i]} with world-class amenities and beautiful views.`,
  location: [
    'Colombo', 'Galle', 'Colombo', 'Dambulla', 'Tangalle', 'Habarana', 'Nuwara Eliya', 'Pasikuda', 'Galle', 'Colombo',
    'Bentota', 'Dambulla', 'Mount Lavinia', 'Kalutara', 'Wadduwa', 'Negombo', 'Kandy', 'Nuwara Eliya', 'Hikkaduwa', 'Galle'
  ][i],
  geo: { lat: [6.9271, 6.0423, 6.9271, 7.8721, 6.0242, 8.0392, 6.9497, 7.9386, 6.0423, 6.9271, 6.4183, 7.8721, 6.8301, 6.5833, 6.4456, 7.2095, 7.2906, 6.9497, 6.1390, 6.0423][i], lng: [79.8612, 80.217, 79.8612, 80.6511, 80.7918, 80.7656, 80.7891, 81.5616, 80.217, 79.8612, 79.9956, 80.6511, 79.8636, 79.9607, 79.9472, 79.8413, 80.6387, 80.7891, 80.1067, 80.217][i] },
  pricePerNight: 15000 + i * 1000,
  roomTypes: [
    { type: 'Deluxe', price: 15000 + i * 1000, available: 10 },
    { type: 'Suite', price: 18000 + i * 1000, available: 5 },
    { type: 'Executive', price: 20000 + i * 1000, available: 3 }
  ],
  amenities: ['Pool', 'Spa', 'Gym', 'WiFi', 'Restaurant', 'Bar', 'Beach Access', 'Room Service'],
  policies: 'Check-in: 2pm, Check-out: 12pm',
  images: Array.from({ length: 10 }, (_, j) => ({
    url: `https://cf.bstatic.com/xdata/images/hotel/max1024x768/${i + 1}${j + 1}0000.jpg`,
    public_id: `hotel_${i}_img_${j}`
  })),
  rating: 4.5 + (i % 5) * 0.1
}));

async function seedHotels() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing hotels (optional - comment out if you want to keep existing data)
    await Hotels.deleteMany({});
    console.log('Cleared existing hotels');

    // Insert new hotels
    const result = await Hotels.insertMany(sriLankanHotels);
    console.log(`Successfully inserted ${result.length} Sri Lankan hotels`);

    // Display inserted hotels
    result.forEach((hotel, index) => {
      console.log(`${index + 1}. ${hotel.name} - ${hotel.location} - $${hotel.pricePerNight}/night`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding hotels:', error);
    process.exit(1);
  }
}

seedHotels();
