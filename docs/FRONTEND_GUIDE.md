**Frontend Guide**

This document explains the structure and key concepts in the React frontend (`frontend/src`). It highlights layout patterns (grids/columns) and how data is requested and consumed.

Structure (important files):
- `src/main.jsx` — App entry; mounts `<ClerkProvider>` and `App`.
- `src/App.jsx` — Router with main routes (`/`, `/hotels`, `/hotels/:id`, `/cart`, `/wishlist`, `/chat`, etc.).
- `src/hooks/useApi.js` — Centralized API helper that wraps `fetch` calls and attaches Clerk auth tokens when needed.
- `src/pages/` — Page components (Home, Hotels, HotelDetails, Booking, Cart, Wishlist, Chat).
- `src/components/` — Reusable UI components (e.g., `HotelCard.jsx`, `Navbar.jsx`, `Footer.jsx`, galleries, animations).

Layout / Grid usage (Tailwind utilities):
The app uses utility classes resembling Tailwind (and Soft UI CSS). Common grid patterns appear across pages. Example from `src/pages/Hotels.jsx`:

```
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {currentHotels.map(hotel => (
    <HotelCard key={hotel._id} hotel={hotel} />
  ))}
</div>
```

What this means:
- `grid`: sets display to CSS Grid.
- `grid-cols-1`: single column at smallest breakpoint.
- `md:grid-cols-2`: at `md` (medium) breakpoint, 2 columns.
- `lg:grid-cols-3`: at `lg` breakpoint, 3 columns.
- `gap-8`: sets row+column gap (spacing) between grid children.

This responsive pattern is repeated: different pages use `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, `grid-cols-1 md:grid-cols-3` etc., to control the number of cards per row depending on screen size.

CSS & Visual patterns:
- Card hover/parallax: `HotelCard.jsx` uses inline `transform` and mouse events for a tilt/glare effect.
- Images: stored in `public/assets/img/<hotel-folder>/` and loaded by `HotelCard` with multiple extension fallbacks.
- Utility CSS: soft-ui-tailwind and local CSS files provide additional utilities.

Data fetching & flow on frontend:
- `useApi.js` exports functions like `fetchHotels`, `fetchHotelById`, `createBooking`, `fetchCart`, `addToCart`, etc.
- Auth headers: `useApi` uses `useAuth().getToken()` from Clerk to set `Authorization: Bearer <token>` for protected routes.

Example (auth headers + fetch in `useApi.js`):
```
async function authHeaders() {
  const token = await getToken();
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

const fetchHotels = useCallback(async () => {
  const res = await fetch(`${base}/api/hotels`);
  return res.json();
}, [base]);
```

Error handling and fallbacks:
- Pages detect `response.ok` and `data.success` fields and fall back to `mockHotels` when backend fails (see `Hotels.jsx`).
- Many components log debug messages to the console — helpful when demonstrating during the viva.

How to inspect a flow during viva:
- Open browser devtools Network tab.
- Load `/hotels` and inspect GET `/api/hotels` response.
- Click on a hotel to open `/hotels/:id` and inspect `fetchHotelById` call.

Quick demo steps:
1. Start backend: `cd backend; npm run dev`.
2. Start frontend: `cd frontend; npm run dev`.
3. Visit `http://localhost:5173`, open devtools -> Network.
4. Search/filter hotels, then open a hotel and click Book to see booking API calls.
