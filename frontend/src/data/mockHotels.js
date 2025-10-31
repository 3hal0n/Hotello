// Mock hotel data for development/offline mode
export const mockHotels = [
  {
    _id: "1",
    name: "Cinnamon Grand Colombo",
    description: "Luxury hotel in Colombo with world-class amenities and beautiful views.",
    location: "Colombo",
    geo: { lat: 6.9271, lng: 79.8612 },
    pricePerNight: 15000,
    roomTypes: [
      { type: "Deluxe", price: 15000, available: 10 },
      { type: "Suite", price: 18000, available: 5 },
      { type: "Executive", price: 20000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel0img0/1024/768", public_id: "hotel_0_img_0" },
      { url: "https://picsum.photos/seed/hotel0img1/1024/768", public_id: "hotel_0_img_1" },
      { url: "https://picsum.photos/seed/hotel0img2/1024/768", public_id: "hotel_0_img_2" },
      { url: "https://picsum.photos/seed/hotel0img3/1024/768", public_id: "hotel_0_img_3" },
      { url: "https://picsum.photos/seed/hotel0img4/1024/768", public_id: "hotel_0_img_4" },
      { url: "https://picsum.photos/seed/hotel0img5/1024/768", public_id: "hotel_0_img_5" },
      { url: "https://picsum.photos/seed/hotel0img6/1024/768", public_id: "hotel_0_img_6" },
      { url: "https://picsum.photos/seed/hotel0img7/1024/768", public_id: "hotel_0_img_7" },
      { url: "https://picsum.photos/seed/hotel0img8/1024/768", public_id: "hotel_0_img_8" },
      { url: "https://picsum.photos/seed/hotel0img9/1024/768", public_id: "hotel_0_img_9" }
    ],
    rating: 4.5
  },
  {
    _id: "2",
    name: "Jetwing Lighthouse",
    description: "Luxury hotel in Galle with world-class amenities and beautiful views.",
    location: "Galle",
    geo: { lat: 6.0423, lng: 80.217 },
    pricePerNight: 16000,
    roomTypes: [
      { type: "Deluxe", price: 16000, available: 10 },
      { type: "Suite", price: 19000, available: 5 },
      { type: "Executive", price: 21000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel1img0/1024/768", public_id: "hotel_1_img_0" },
      { url: "https://picsum.photos/seed/hotel1img1/1024/768", public_id: "hotel_1_img_1" },
      { url: "https://picsum.photos/seed/hotel1img2/1024/768", public_id: "hotel_1_img_2" },
      { url: "https://picsum.photos/seed/hotel1img3/1024/768", public_id: "hotel_1_img_3" },
      { url: "https://picsum.photos/seed/hotel1img4/1024/768", public_id: "hotel_1_img_4" },
      { url: "https://picsum.photos/seed/hotel1img5/1024/768", public_id: "hotel_1_img_5" },
      { url: "https://picsum.photos/seed/hotel1img6/1024/768", public_id: "hotel_1_img_6" },
      { url: "https://picsum.photos/seed/hotel1img7/1024/768", public_id: "hotel_1_img_7" },
      { url: "https://picsum.photos/seed/hotel1img8/1024/768", public_id: "hotel_1_img_8" },
      { url: "https://picsum.photos/seed/hotel1img9/1024/768", public_id: "hotel_1_img_9" }
    ],
    rating: 4.6
  },
  {
    _id: "3",
    name: "Galle Face Hotel",
    description: "Luxury hotel in Colombo with world-class amenities and beautiful views.",
    location: "Colombo",
    geo: { lat: 6.9271, lng: 79.8612 },
    pricePerNight: 17000,
    roomTypes: [
      { type: "Deluxe", price: 17000, available: 10 },
      { type: "Suite", price: 20000, available: 5 },
      { type: "Executive", price: 22000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel2img0/1024/768", public_id: "hotel_2_img_0" },
      { url: "https://picsum.photos/seed/hotel2img1/1024/768", public_id: "hotel_2_img_1" },
      { url: "https://picsum.photos/seed/hotel2img2/1024/768", public_id: "hotel_2_img_2" },
      { url: "https://picsum.photos/seed/hotel2img3/1024/768", public_id: "hotel_2_img_3" },
      { url: "https://picsum.photos/seed/hotel2img4/1024/768", public_id: "hotel_2_img_4" },
      { url: "https://picsum.photos/seed/hotel2img5/1024/768", public_id: "hotel_2_img_5" },
      { url: "https://picsum.photos/seed/hotel2img6/1024/768", public_id: "hotel_2_img_6" },
      { url: "https://picsum.photos/seed/hotel2img7/1024/768", public_id: "hotel_2_img_7" },
      { url: "https://picsum.photos/seed/hotel2img8/1024/768", public_id: "hotel_2_img_8" },
      { url: "https://picsum.photos/seed/hotel2img9/1024/768", public_id: "hotel_2_img_9" }
    ],
    rating: 4.7
  },
  {
    _id: "4",
    name: "Heritance Kandalama",
    description: "Luxury hotel in Dambulla with world-class amenities and beautiful views.",
    location: "Dambulla",
    geo: { lat: 7.8721, lng: 80.6511 },
    pricePerNight: 18000,
    roomTypes: [
      { type: "Deluxe", price: 18000, available: 10 },
      { type: "Suite", price: 21000, available: 5 },
      { type: "Executive", price: 23000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel3img0/1024/768", public_id: "hotel_3_img_0" },
      { url: "https://picsum.photos/seed/hotel3img1/1024/768", public_id: "hotel_3_img_1" },
      { url: "https://picsum.photos/seed/hotel3img2/1024/768", public_id: "hotel_3_img_2" },
      { url: "https://picsum.photos/seed/hotel3img3/1024/768", public_id: "hotel_3_img_3" },
      { url: "https://picsum.photos/seed/hotel3img4/1024/768", public_id: "hotel_3_img_4" },
      { url: "https://picsum.photos/seed/hotel3img5/1024/768", public_id: "hotel_3_img_5" },
      { url: "https://picsum.photos/seed/hotel3img6/1024/768", public_id: "hotel_3_img_6" },
      { url: "https://picsum.photos/seed/hotel3img7/1024/768", public_id: "hotel_3_img_7" },
      { url: "https://picsum.photos/seed/hotel3img8/1024/768", public_id: "hotel_3_img_8" },
      { url: "https://picsum.photos/seed/hotel3img9/1024/768", public_id: "hotel_3_img_9" }
    ],
    rating: 4.8
  },
  {
    _id: "5",
    name: "Anantara Peace Haven Tangalle",
    description: "Luxury hotel in Tangalle with world-class amenities and beautiful views.",
    location: "Tangalle",
    geo: { lat: 6.0242, lng: 80.7918 },
    pricePerNight: 19000,
    roomTypes: [
      { type: "Deluxe", price: 19000, available: 10 },
      { type: "Suite", price: 22000, available: 5 },
      { type: "Executive", price: 24000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel4img0/1024/768", public_id: "hotel_4_img_0" },
      { url: "https://picsum.photos/seed/hotel4img1/1024/768", public_id: "hotel_4_img_1" },
      { url: "https://picsum.photos/seed/hotel4img2/1024/768", public_id: "hotel_4_img_2" },
      { url: "https://picsum.photos/seed/hotel4img3/1024/768", public_id: "hotel_4_img_3" },
      { url: "https://picsum.photos/seed/hotel4img4/1024/768", public_id: "hotel_4_img_4" },
      { url: "https://picsum.photos/seed/hotel4img5/1024/768", public_id: "hotel_4_img_5" },
      { url: "https://picsum.photos/seed/hotel4img6/1024/768", public_id: "hotel_4_img_6" },
      { url: "https://picsum.photos/seed/hotel4img7/1024/768", public_id: "hotel_4_img_7" },
      { url: "https://picsum.photos/seed/hotel4img8/1024/768", public_id: "hotel_4_img_8" },
      { url: "https://picsum.photos/seed/hotel4img9/1024/768", public_id: "hotel_4_img_9" }
    ],
    rating: 4.9
  },
  {
    _id: "6",
    name: "Cinnamon Lodge Habarana",
    description: "Luxury hotel in Habarana with world-class amenities and beautiful views.",
    location: "Habarana",
    geo: { lat: 8.0392, lng: 80.7656 },
    pricePerNight: 20000,
    roomTypes: [
      { type: "Deluxe", price: 20000, available: 10 },
      { type: "Suite", price: 23000, available: 5 },
      { type: "Executive", price: 25000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel5img0/1024/768", public_id: "hotel_5_img_0" },
      { url: "https://picsum.photos/seed/hotel5img1/1024/768", public_id: "hotel_5_img_1" },
      { url: "https://picsum.photos/seed/hotel5img2/1024/768", public_id: "hotel_5_img_2" },
      { url: "https://picsum.photos/seed/hotel5img3/1024/768", public_id: "hotel_5_img_3" },
      { url: "https://picsum.photos/seed/hotel5img4/1024/768", public_id: "hotel_5_img_4" },
      { url: "https://picsum.photos/seed/hotel5img5/1024/768", public_id: "hotel_5_img_5" },
      { url: "https://picsum.photos/seed/hotel5img6/1024/768", public_id: "hotel_5_img_6" },
      { url: "https://picsum.photos/seed/hotel5img7/1024/768", public_id: "hotel_5_img_7" },
      { url: "https://picsum.photos/seed/hotel5img8/1024/768", public_id: "hotel_5_img_8" },
      { url: "https://picsum.photos/seed/hotel5img9/1024/768", public_id: "hotel_5_img_9" }
    ],
    rating: 4.5
  },
  {
    _id: "7",
    name: "Grand Hotel Nuwara Eliya",
    description: "Luxury hotel in Nuwara Eliya with world-class amenities and beautiful views.",
    location: "Nuwara Eliya",
    geo: { lat: 6.9497, lng: 80.7891 },
    pricePerNight: 21000,
    roomTypes: [
      { type: "Deluxe", price: 21000, available: 10 },
      { type: "Suite", price: 24000, available: 5 },
      { type: "Executive", price: 26000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel6img0/1024/768", public_id: "hotel_6_img_0" },
      { url: "https://picsum.photos/seed/hotel6img1/1024/768", public_id: "hotel_6_img_1" },
      { url: "https://picsum.photos/seed/hotel6img2/1024/768", public_id: "hotel_6_img_2" },
      { url: "https://picsum.photos/seed/hotel6img3/1024/768", public_id: "hotel_6_img_3" },
      { url: "https://picsum.photos/seed/hotel6img4/1024/768", public_id: "hotel_6_img_4" },
      { url: "https://picsum.photos/seed/hotel6img5/1024/768", public_id: "hotel_6_img_5" },
      { url: "https://picsum.photos/seed/hotel6img6/1024/768", public_id: "hotel_6_img_6" },
      { url: "https://picsum.photos/seed/hotel6img7/1024/768", public_id: "hotel_6_img_7" },
      { url: "https://picsum.photos/seed/hotel6img8/1024/768", public_id: "hotel_6_img_8" },
      { url: "https://picsum.photos/seed/hotel6img9/1024/768", public_id: "hotel_6_img_9" }
    ],
    rating: 4.6
  },
  {
    _id: "8",
    name: "Uga Bay Pasikuda",
    description: "Luxury hotel in Pasikuda with world-class amenities and beautiful views.",
    location: "Pasikuda",
    geo: { lat: 7.9386, lng: 81.5616 },
    pricePerNight: 22000,
    roomTypes: [
      { type: "Deluxe", price: 22000, available: 10 },
      { type: "Suite", price: 25000, available: 5 },
      { type: "Executive", price: 27000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel7img0/1024/768", public_id: "hotel_7_img_0" },
      { url: "https://picsum.photos/seed/hotel7img1/1024/768", public_id: "hotel_7_img_1" },
      { url: "https://picsum.photos/seed/hotel7img2/1024/768", public_id: "hotel_7_img_2" },
      { url: "https://picsum.photos/seed/hotel7img3/1024/768", public_id: "hotel_7_img_3" },
      { url: "https://picsum.photos/seed/hotel7img4/1024/768", public_id: "hotel_7_img_4" },
      { url: "https://picsum.photos/seed/hotel7img5/1024/768", public_id: "hotel_7_img_5" },
      { url: "https://picsum.photos/seed/hotel7img6/1024/768", public_id: "hotel_7_img_6" },
      { url: "https://picsum.photos/seed/hotel7img7/1024/768", public_id: "hotel_7_img_7" },
      { url: "https://picsum.photos/seed/hotel7img8/1024/768", public_id: "hotel_7_img_8" },
      { url: "https://picsum.photos/seed/hotel7img9/1024/768", public_id: "hotel_7_img_9" }
    ],
    rating: 4.7
  },
  {
    _id: "9",
    name: "The Fortress Resort & Spa",
    description: "Luxury hotel in Galle with world-class amenities and beautiful views.",
    location: "Galle",
    geo: { lat: 6.0423, lng: 80.217 },
    pricePerNight: 23000,
    roomTypes: [
      { type: "Deluxe", price: 23000, available: 10 },
      { type: "Suite", price: 26000, available: 5 },
      { type: "Executive", price: 28000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel8img0/1024/768", public_id: "hotel_8_img_0" },
      { url: "https://picsum.photos/seed/hotel8img1/1024/768", public_id: "hotel_8_img_1" },
      { url: "https://picsum.photos/seed/hotel8img2/1024/768", public_id: "hotel_8_img_2" },
      { url: "https://picsum.photos/seed/hotel8img3/1024/768", public_id: "hotel_8_img_3" },
      { url: "https://picsum.photos/seed/hotel8img4/1024/768", public_id: "hotel_8_img_4" },
      { url: "https://picsum.photos/seed/hotel8img5/1024/768", public_id: "hotel_8_img_5" },
      { url: "https://picsum.photos/seed/hotel8img6/1024/768", public_id: "hotel_8_img_6" },
      { url: "https://picsum.photos/seed/hotel8img7/1024/768", public_id: "hotel_8_img_7" },
      { url: "https://picsum.photos/seed/hotel8img8/1024/768", public_id: "hotel_8_img_8" },
      { url: "https://picsum.photos/seed/hotel8img9/1024/768", public_id: "hotel_8_img_9" }
    ],
    rating: 4.8
  },
  {
    _id: "10",
    name: "Shangri-La Colombo",
    description: "Luxury hotel in Colombo with world-class amenities and beautiful views.",
    location: "Colombo",
    geo: { lat: 6.9271, lng: 79.8612 },
    pricePerNight: 24000,
    roomTypes: [
      { type: "Deluxe", price: 24000, available: 10 },
      { type: "Suite", price: 27000, available: 5 },
      { type: "Executive", price: 29000, available: 3 }
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Beach Access", "Room Service"],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [
      { url: "https://picsum.photos/seed/hotel9img0/1024/768", public_id: "hotel_9_img_0" },
      { url: "https://picsum.photos/seed/hotel9img1/1024/768", public_id: "hotel_9_img_1" },
      { url: "https://picsum.photos/seed/hotel9img2/1024/768", public_id: "hotel_9_img_2" },
      { url: "https://picsum.photos/seed/hotel9img3/1024/768", public_id: "hotel_9_img_3" },
      { url: "https://picsum.photos/seed/hotel9img4/1024/768", public_id: "hotel_9_img_4" },
      { url: "https://picsum.photos/seed/hotel9img5/1024/768", public_id: "hotel_9_img_5" },
      { url: "https://picsum.photos/seed/hotel9img6/1024/768", public_id: "hotel_9_img_6" },
      { url: "https://picsum.photos/seed/hotel9img7/1024/768", public_id: "hotel_9_img_7" },
      { url: "https://picsum.photos/seed/hotel9img8/1024/768", public_id: "hotel_9_img_8" },
      { url: "https://picsum.photos/seed/hotel9img9/1024/768", public_id: "hotel_9_img_9" }
    ],
    rating: 4.9
  }
];
