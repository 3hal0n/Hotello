**Data Flow**

This document maps how data moves through Hotello for the common user flows: browsing hotels, booking, cart/wishlist, and payments.

1) Browse hotels (read-only flow)
- Frontend: `Hotels.jsx` calls `useApi().fetchHotels()` which does `fetch(<API_BASE>/api/hotels)`.
- Backend: `routes/hotels.js` → `hotelController.getHotels()` → `Hotels.find()` → returns JSON `{ success: true, count, data }`.
- Frontend: receives JSON, sets `hotels` state and renders `HotelCard` components inside a grid container.

2) View hotel details
- Frontend: `HotelDetails.jsx` calls `useApi().fetchHotelById(id)` → `GET /api/hotels/:id`.
- Backend: `hotelController.getHotelById` loads hotel and returns it.

3) Create booking (protected)
- Frontend: user clicks Book → frontend collects `hotelId`, `roomType`, `checkIn`, `checkOut`, `guests` and calls `createBooking` (POST `/api/bookings`) with Clerk token in `Authorization` header set by `useApi`.
- Middleware: `clerkAuth` verifies token using Clerk SDK; it attaches `req.auth.userId`.
- Controller: `bookingController.createBooking` validates dates, checks room availability, computes `nights * price * guests` ⇒ saves Booking with `paymentStatus: 'pending'` and `status: 'booked'`.
- Response: booking object (with `_id` and `totalAmount`) returned to frontend.

4) Checkout (Stripe)
- Frontend: calls `POST /api/payments/session` with bookingId (or booking details) → backend `paymentController.createPaymentSession`.
- Backend: creates Stripe Checkout session (via `utils/stripe`) with `successUrl` and `cancelUrl` pointing to frontend. It creates a `Payments` entry with `status: 'pending'`.
- Stripe: user completes payment on Stripe-hosted page.
- Webhook: Stripe calls `/api/payments/webhook` → server sets `Bookings.paymentStatus = 'paid'` and `Payments.status = 'completed'`.

5) Cart and Wishlist (protected)
- Cart: GET/PUT and add (`/api/cart`, `/api/cart/add`) read and write `Cart` document keyed by `userId` (Clerk id string).
- Wishlist: GET/PUT `/api/wishlist` operates similarly on `Wishlist` model.

6) Admin flows
- Admin login: `POST /api/admin/login` returns JWT with `role: 'admin'`.
- Protected admin endpoints use `adminAuth` middleware that checks the JWT.

Notes about shape of responses (important to remember in viva):
- Most endpoints return an object: `{ success: true|false, data: <payload>, message?: <error|info>, count?: <n> }`.
- Some endpoints (e.g., recommendations `GET`) return arrays directly in fallback cases — frontend is defensive and checks `data.success` and `Array.isArray(data.data)`.

Image handling and CORS:
- Images from third-party hosts are proxied via `/api/proxy-image?url=...` to avoid CORS and to whitelist allowed hosts.

AI flows:
- `POST /api/recommendations` can call OpenAI to rank hotels and return a JSON array of names. If no OpenAI key, fallback is keyword matching.
- `POST /api/chat` will try Gemini (Google) first, then OpenAI, then a smart fallback.
