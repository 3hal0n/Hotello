const mongoose = require('mongoose');
const Hotels = require('../models/Hotels');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotello';

const sriLankanHotels = [
  {
    ownerId: 'seed_user_001',
    name: 'Galle Face Hotel',
    description: 'A historic luxury hotel on the Colombo seafront with colonial charm, elegant rooms, and breathtaking ocean views. Experience world-class hospitality in the heart of Sri Lanka\'s capital.',
    location: 'Colombo, Western Province',
    pricePerNight: 180,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Ocean View', 'Room Service'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        public_id: 'galle_face_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        public_id: 'galle_face_2'
      }
    ],
    rating: 4.8
  },
  {
    ownerId: 'seed_user_002',
    name: 'Cinnamon Lodge Habarana',
    description: 'Nestled in the cultural triangle, this eco-friendly resort offers a perfect base for exploring ancient ruins. Surrounded by lush forests with modern amenities and traditional Sri Lankan hospitality.',
    location: 'Habarana, North Central Province',
    pricePerNight: 120,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Wildlife Tours', 'Spa', 'Air Conditioning', 'Parking'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        public_id: 'cinnamon_lodge_1'
      }
    ],
    rating: 4.6
  },
  {
    ownerId: 'seed_user_003',
    name: 'Jetwing Lighthouse',
    description: 'An architectural masterpiece by Geoffrey Bawa, perched on rocky outcrops overlooking the Indian Ocean. Luxury rooms with private balconies, infinity pool, and exceptional dining experiences.',
    location: 'Galle, Southern Province',
    pricePerNight: 200,
    amenities: ['WiFi', 'Infinity Pool', 'Spa', 'Restaurant', 'Bar', 'Ocean View', 'Room Service', 'Gym'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
        public_id: 'jetwing_lighthouse_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        public_id: 'jetwing_lighthouse_2'
      }
    ],
    rating: 4.9
  },
  {
    ownerId: 'seed_user_004',
    name: 'Grand Hotel Nuwara Eliya',
    description: 'A charming colonial-era hotel in the misty hills of Nuwara Eliya. Known as "Little England," enjoy cool climate, tea plantations, golf, and old-world elegance in this mountain retreat.',
    location: 'Nuwara Eliya, Central Province',
    pricePerNight: 95,
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Golf Course', 'Fireplace', 'Garden', 'Parking'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        public_id: 'grand_hotel_ne_1'
      }
    ],
    rating: 4.5
  },
  {
    ownerId: 'seed_user_005',
    name: 'Anantara Peace Haven Tangalle',
    description: 'Beachfront luxury resort with stunning crescent bay views. Private pool villas, world-class spa, water sports, and gourmet dining. Perfect for a romantic getaway or family vacation.',
    location: 'Tangalle, Southern Province',
    pricePerNight: 250,
    amenities: ['WiFi', 'Private Pool', 'Spa', 'Restaurant', 'Bar', 'Beach Access', 'Water Sports', 'Kids Club', 'Gym'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
        public_id: 'anantara_tangalle_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',
        public_id: 'anantara_tangalle_2'
      }
    ],
    rating: 4.9
  },
  {
    ownerId: 'seed_user_006',
    name: 'Heritance Kandalama',
    description: 'Geoffrey Bawa\'s masterpiece hotel carved into a rock face overlooking Kandalama reservoir. Eco-friendly design, infinity pool merging with lake views, and incredible wildlife spotting.',
    location: 'Dambulla, Central Province',
    pricePerNight: 165,
    amenities: ['WiFi', 'Infinity Pool', 'Spa', 'Restaurant', 'Wildlife Tours', 'Gym', 'Lake View', 'Eco-Friendly'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559599238-8e5742df6673?w=800',
        public_id: 'heritance_kandalama_1'
      }
    ],
    rating: 4.7
  },
  {
    ownerId: 'seed_user_007',
    name: 'Cinnamon Wild Yala',
    description: 'Safari-style resort on the edge of Yala National Park. Watch elephants and leopards from your room! Authentic wildlife experience with luxury tented accommodation and guided safaris.',
    location: 'Yala, Uva Province',
    pricePerNight: 140,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Safari Tours', 'Wildlife View', 'Bar', 'Outdoor Activities'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800',
        public_id: 'cinnamon_wild_1'
      }
    ],
    rating: 4.6
  },
  {
    ownerId: 'seed_user_008',
    name: 'Uga Bay Pasikuda',
    description: 'Boutique beach resort on one of Asia\'s finest beaches. Crystal-clear shallow waters perfect for swimming, modern luxury rooms, exceptional service, and tranquil atmosphere.',
    location: 'Pasikuda, Eastern Province',
    pricePerNight: 175,
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Water Sports', 'Room Service'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
        public_id: 'uga_bay_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        public_id: 'uga_bay_2'
      }
    ],
    rating: 4.8
  },
  {
    ownerId: 'seed_user_009',
    name: 'The Fortress Resort & Spa',
    description: 'Contemporary luxury resort resembling a Dutch fort, perched on a rocky headland. Award-winning spa, multiple dining options, and spectacular sunset views over the Indian Ocean.',
    location: 'Galle, Southern Province',
    pricePerNight: 220,
    amenities: ['WiFi', 'Pool', 'Spa', 'Multiple Restaurants', 'Bar', 'Gym', 'Ocean View', 'Tennis Court'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800',
        public_id: 'fortress_1'
      }
    ],
    rating: 4.9
  },
  {
    ownerId: 'seed_user_010',
    name: 'Shangri-La Colombo',
    description: 'Modern 5-star luxury in the heart of Colombo\'s business district. Rooftop bar with panoramic city views, multiple award-winning restaurants, spa, and impeccable service.',
    location: 'Colombo, Western Province',
    pricePerNight: 190,
    amenities: ['WiFi', 'Rooftop Pool', 'Spa', 'Multiple Restaurants', 'Bar', 'Gym', 'City View', 'Business Center'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
        public_id: 'shangri_la_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        public_id: 'shangri_la_2'
      }
    ],
    rating: 4.8
  }
];

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
