# Offline Mode - Mock Data Fallback

## Overview
The frontend application now works seamlessly even when the backend is not available. All hotel-related pages automatically fall back to mock data when the API is unreachable.

---

## Implementation

### 1. Mock Data File
**Location:** `frontend/src/data/mockHotels.js`

**Contains:** 10 Sri Lankan luxury hotels with complete data:
- Hotel names and descriptions
- Locations and geo-coordinates
- Pricing and room types
- Amenities and policies
- Image galleries (10 images per hotel)
- Ratings

**Structure:**
```javascript
export const mockHotels = [
  {
    _id: "1",
    name: "Cinnamon Grand Colombo",
    description: "Luxury hotel in Colombo...",
    location: "Colombo",
    geo: { lat: 6.9271, lng: 79.8612 },
    pricePerNight: 15000,
    roomTypes: [
      { type: "Deluxe", price: 15000, available: 10 },
      { type: "Suite", price: 18000, available: 5 },
      { type: "Executive", price: 20000, available: 3 }
    ],
    amenities: [...],
    policies: "Check-in: 2pm, Check-out: 12pm",
    images: [...],
    rating: 4.5
  },
  // ... 9 more hotels
];
```

---

## Updated Files

### Pages with Offline Support:

1. **Home.jsx** ✅
   - Fetches from API
   - Falls back to mockHotels on error
   - No error message shown when using mock data
   - All features work: search, filters, emotion search, pagination

2. **Hotels.jsx** ✅
   - Fetches from API
   - Falls back to mockHotels on error
   - All filters work: location, price, rating, amenities, sort
   - Pagination functional

3. **HotelDetails.jsx** ✅
   - Fetches specific hotel from API
   - Falls back to finding hotel in mockHotels by ID
   - Booking form works
   - Image gallery displays
   - All hotel information available

4. **MapView.jsx** ✅
   - Fetches all hotels from API
   - Falls back to mockHotels on error
   - Interactive map displays
   - Hotel markers clickable
   - Split layout works

5. **Booking.jsx** ✅
   - Fetches specific hotel from API
   - Falls back to finding hotel in mockHotels by ID
   - Price calculation works
   - Room type selection functional
   - Guest count works

---

## How It Works

### Standard Fetch Pattern
```javascript
// Import mock data
import { mockHotels } from '../data/mockHotels';

// Fetch with fallback
fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels`)
  .then((r) => r.json())
  .then((response) => {
    if (response.success && response.data) {
      setHotels(response.data);
    } else if (Array.isArray(response)) {
      setHotels(response);
    }
  })
  .catch((err) => {
    console.error('Backend not available, using mock data:', err);
    // Use mock data when backend is unavailable
    setHotels(mockHotels);
  });
```

### Single Hotel Fetch Pattern
```javascript
fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels/${id}`)
  .then((r) => r.json())
  .then((data) => {
    if (data.success) {
      setHotel(data.data);
    }
  })
  .catch((err) => {
    console.error('Backend not available, using mock data:', err);
    // Find hotel in mock data by ID
    const mockHotel = mockHotels.find(h => h._id === id);
    if (mockHotel) {
      setHotel(mockHotel);
      setError(null);
    }
  });
```

---

## Benefits

### For Development:
- ✅ **Work Without Backend** - Frontend development can continue independently
- ✅ **No CORS Issues** - No need for backend server during UI work
- ✅ **Faster Iteration** - No waiting for API responses
- ✅ **Consistent Test Data** - Predictable data for UI testing

### For Production:
- ✅ **Graceful Degradation** - App doesn't crash if backend is down
- ✅ **Demo Mode** - Can showcase UI without backend
- ✅ **Resilience** - Better user experience during outages
- ✅ **Development Preview** - Deploy frontend to show progress

---

## Features That Work Offline

### Home Page:
- ✅ Hero carousel with mood chips
- ✅ AI emotion search
- ✅ Hotel grid display
- ✅ Search by name/location/description
- ✅ Price range filter
- ✅ Rating filter
- ✅ Sort by price/rating
- ✅ Pagination (9 per page)

### Hotels Page:
- ✅ All 10 hotels displayed
- ✅ Advanced filters (location, price, rating, amenities)
- ✅ Search functionality
- ✅ Sort options
- ✅ Hotel cards with images

### Hotel Details:
- ✅ Full hotel information
- ✅ Image gallery (10 images)
- ✅ Room types and pricing
- ✅ Amenities list
- ✅ Booking form (dates, pricing)
- ✅ Reviews and ratings

### Map View:
- ✅ Hotel list sidebar
- ✅ Interactive map (Google Maps embed)
- ✅ Clickable hotel markers
- ✅ Selected hotel details
- ✅ Navigation to hotel details

### Booking Page:
- ✅ Hotel information
- ✅ Date selection
- ✅ Room type selection
- ✅ Guest count
- ✅ Price calculation
- ✅ Nights calculation

---

## Features That DON'T Work Offline

These features require backend/database:
- ❌ Creating new bookings (POST to /api/bookings)
- ❌ Fetching user's booking history
- ❌ Saving to wishlist
- ❌ Admin hotel management (create/edit/delete hotels)
- ❌ Payment processing
- ❌ Chat functionality
- ❌ User profile updates

---

## Console Messages

### When Backend Available:
```
API Response: {success: true, data: [...]}
Setting hotels from data.data: 20 hotels
```

### When Backend Unavailable:
```
Backend not available, using mock data: TypeError: Failed to fetch
```

---

## Mock Hotels List

1. **Cinnamon Grand Colombo** - Colombo - $15,000/night ⭐ 4.5
2. **Jetwing Lighthouse** - Galle - $16,000/night ⭐ 4.6
3. **Galle Face Hotel** - Colombo - $17,000/night ⭐ 4.7
4. **Heritance Kandalama** - Dambulla - $18,000/night ⭐ 4.8
5. **Anantara Peace Haven Tangalle** - Tangalle - $19,000/night ⭐ 4.9
6. **Cinnamon Lodge Habarana** - Habarana - $20,000/night ⭐ 4.5
7. **Grand Hotel Nuwara Eliya** - Nuwara Eliya - $21,000/night ⭐ 4.6
8. **Uga Bay Pasikuda** - Pasikuda - $22,000/night ⭐ 4.7
9. **The Fortress Resort & Spa** - Galle - $23,000/night ⭐ 4.8
10. **Shangri-La Colombo** - Colombo - $24,000/night ⭐ 4.9

---

## Testing Offline Mode

### Method 1: Stop Backend Server
```bash
# In backend terminal, stop the server (Ctrl+C)
# Frontend will automatically use mock data
```

### Method 2: Invalid API URL
```javascript
// In .env file
VITE_API_BASE=http://invalid-url
```

### Method 3: Network Simulation
```javascript
// In DevTools > Network tab
// Set to "Offline" mode
```

---

## Extending Mock Data

To add more hotels:
```javascript
// In mockHotels.js
export const mockHotels = [
  ...existingHotels,
  {
    _id: "11", // Increment ID
    name: "New Hotel Name",
    description: "...",
    location: "Location",
    geo: { lat: 0.0, lng: 0.0 },
    pricePerNight: 25000,
    roomTypes: [...],
    amenities: [...],
    policies: "...",
    images: [...],
    rating: 4.5
  }
];
```

---

## Best Practices

1. **Always Import Mock Data First**
   ```javascript
   import { mockHotels } from '../data/mockHotels';
   ```

2. **Use in Catch Block Only**
   - Don't replace successful API responses
   - Only use when fetch fails

3. **Clear Error State**
   ```javascript
   setError(null); // When using mock data successfully
   ```

4. **Console Log Context**
   ```javascript
   console.error('Backend not available, using mock data:', err);
   ```

5. **Maintain Data Structure**
   - Mock data must match API response structure
   - Same field names and types
   - Same nested object patterns

---

## Conclusion

The application now provides a **seamless offline experience** with full UI functionality using mock data. Users can:
- Browse all hotels
- Search and filter
- View hotel details
- See pricing and availability
- Navigate the map
- Use all UI features

This improves:
- **Developer Experience** - No backend dependency
- **User Experience** - No crashes or blank pages
- **Deployment Flexibility** - Frontend can deploy independently
- **Demo Capability** - Show UI without backend setup

---

**Status:** ✅ **All hotel-related pages now support offline mode!**
