# Quick Start Guide - New Features

## 🚀 For Users

### AI Emotion Search
1. Go to the homepage
2. Click "AI Emotion Search" button in the hero section
3. Either:
   - Type how you want to feel (e.g., "relaxed", "adventurous")
   - Click one of the emotion quick buttons (😌 Relaxing, 🎉 Exciting, etc.)
4. Hotels matching your mood will appear

### Traditional Search & Filters
1. Scroll to the "Search & Filter" section below the hero
2. Use the search bar to find hotels by name or location
3. Apply filters:
   - **Price Range**: Select your budget
   - **Rating**: Filter by minimum star rating
   - **Sort**: Choose how to order results
4. See active filters as tags
5. Click "Clear all" to reset

### Pagination
- Hotels are displayed 9 per page for faster loading
- Use Previous/Next buttons or click page numbers
- Page automatically scrolls to top when you navigate

### Image Gallery (Hotel Details)
1. Click on any hotel card
2. **Main Gallery**:
   - Large image shows selected photo
   - Click smaller thumbnails to change main image
   - Hover over images to see zoom effect
3. **Lightbox**:
   - Click "View All Photos" or any image
   - Use ← → arrow keys to navigate
   - Press ESC to close
   - Click thumbnails at bottom to jump to specific image

---

## 💻 For Developers

### New Components

#### 1. ImageGallery
```jsx
import ImageGallery from '../components/ImageGallery';

<ImageGallery 
  images={hotel.images} 
  hotelName={hotel.name} 
/>
```

**Features**:
- Grid layout with main + thumbnails
- Fullscreen lightbox mode
- Keyboard navigation (Arrow keys, ESC)
- Responsive design

---

#### 2. FeaturesSection
```jsx
import FeaturesSection from '../components/FeaturesSection';

<FeaturesSection />
```

**Features**:
- Highlights platform features (Secure Payments, AI Chatbot, Emotion Search)
- Gradient animations on hover
- Fully responsive

---

#### 3. Pagination
```jsx
import Pagination from '../components/Pagination';

<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

**Props**:
- `currentPage`: Current active page (number)
- `totalPages`: Total number of pages (number)
- `onPageChange`: Callback when page changes (function)

---

### Updated Components

#### Hero.jsx
**New Prop**: `onEmotionSearch`
```jsx
<Hero onEmotionSearch={handleEmotionSearch} />

// In parent component:
const handleEmotionSearch = (emotionQuery) => {
  setSearchQuery(emotionQuery);
};
```

**Features**:
- Toggle between destination and emotion search
- 6 emotion quick buttons
- Glassmorphism design

---

#### Home.jsx
**New State Variables**:
```jsx
const [allHotels, setAllHotels] = useState([]); // Original data
const [hotels, setHotels] = useState([]); // Filtered data
const [currentPage, setCurrentPage] = useState(1);
const [searchQuery, setSearchQuery] = useState('');
const [priceRange, setPriceRange] = useState('');
const [rating, setRating] = useState('');
const [sortBy, setSortBy] = useState('featured');
```

**Filter Logic**:
- Non-destructive filtering (preserves original array)
- Multiple filters applied in sequence
- Auto-reset to page 1 when filters change

**Pagination**:
```jsx
const hotelsPerPage = 9;
const indexOfLastHotel = currentPage * hotelsPerPage;
const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
```

---

#### HotelDetails.jsx
**Replaced**: `CircularGallery` → `ImageGallery`

**New Icons**:
```jsx
import { MapPin, Star, Calendar, Users, Shield, Award } from 'lucide-react';
```

**Layout Changes**:
- 3-column grid (2 cols info, 1 col booking)
- Sticky booking card (`sticky top-24`)
- Enhanced visual hierarchy
- Trust badges and quick stats

---

### Styling Patterns

#### Gradient Buttons
```jsx
className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
```

#### Glassmorphism
```jsx
className="backdrop-blur-glass bg-primary-foreground/10 border border-primary-foreground/20"
```

#### Hover Animations
```jsx
className="transition-all duration-300 hover:scale-110 hover:shadow-xl"
```

#### Card Shadows
```jsx
className="shadow-lg hover:shadow-2xl transition-shadow"
```

---

### Performance Tips

1. **Pagination**: Only 9 hotels rendered at once
2. **Lazy Loading**: Images load on-demand in lightbox
3. **No WebGL**: Removed heavy CircularGallery dependency
4. **Debounced Search**: Consider adding debounce to search input

---

### Accessibility

- ✅ Keyboard navigation in lightbox
- ✅ ARIA labels on interactive elements
- ✅ Focus states on all buttons
- ✅ Semantic HTML (nav, section, main, footer)
- ✅ Alt text on all images

---

### Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

### Known Limitations

1. **AI Emotion Search**: Currently client-side only (searches description field)
   - **Future**: Implement backend AI/ML model for true emotion matching

2. **Image Gallery**: Local images must be manually added to `/public/assets/img/`
   - See `IMAGE_SETUP_GUIDE.md` for instructions

3. **Pagination**: State resets on page refresh
   - **Future**: Add URL query params for bookmarkable pages

---

### Customization

#### Change Hotels Per Page
```jsx
// In Home.jsx
const hotelsPerPage = 9; // Change to 6, 12, etc.
```

#### Change Emotion Buttons
```jsx
// In Hero.jsx
const emotions = [
  { emoji: "😌", label: "Relaxing", query: "peaceful relaxing spa wellness" },
  // Add more emotions here
];
```

#### Customize Gallery Layout
```jsx
// In ImageGallery.jsx
// Line 53: Change grid structure
className="grid grid-cols-4 grid-rows-2 gap-2 h-[600px]"
```

---

### Testing Checklist

- [ ] Emotion search returns relevant results
- [ ] Filters work independently and together
- [ ] Pagination navigation works (prev/next/numbers)
- [ ] Image gallery opens in lightbox
- [ ] Keyboard shortcuts work (arrows, ESC)
- [ ] Mobile responsive on all pages
- [ ] Dark footer has good contrast
- [ ] All links in footer work
- [ ] Features section animations smooth

---

### Deployment Notes

1. **Build Command**: `npm run build`
2. **Static Assets**: Ensure `/public/assets/img/` is included in build
3. **Environment Variables**: `VITE_API_BASE` must be set
4. **Image Optimization**: Consider using CDN for hotel images
5. **Bundle Size**: Removed heavy WebGL dependency, bundle should be smaller

---

### Troubleshooting

**Problem**: Images not showing in gallery  
**Solution**: Check that images exist in `/frontend/public/assets/img/{hotel-folder}/img1.jpg`

**Problem**: Pagination not working  
**Solution**: Ensure `hotels` array has length > 9

**Problem**: Emotion search returns no results  
**Solution**: Check that hotel descriptions contain emotion keywords

**Problem**: Lightbox won't close  
**Solution**: Check browser console for errors, ensure ESC key handler is registered

---

### Future Enhancements

1. **Backend AI Integration**
   - Send emotion query to AI model
   - Return semantic matches based on reviews, amenities, location

2. **Image Optimization**
   - Lazy load images
   - Responsive images (srcset)
   - WebP format with fallbacks

3. **Advanced Filters**
   - Date range availability
   - Number of guests
   - Specific amenities (pool, gym, etc.)
   - Distance from location

4. **URL State Management**
   - Save filters in URL query params
   - Bookmarkable searches
   - Browser back/forward navigation

5. **Analytics**
   - Track which emotions are most popular
   - A/B test different emotion button layouts
   - Monitor conversion rates

---

**Last Updated:** October 30, 2025  
**Version:** 2.0.0  
**Author:** Senior Frontend Developer
