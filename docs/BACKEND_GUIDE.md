**Backend Guide**

This file explains the Express backend: entry points, routes, controllers, models and middleware.

Entry file:
- `backend/server.js` — sets up Express, CORS, JSON parsing, registers route modules and error handlers, and connects to MongoDB when run directly.

Middleware of note:
- `backend/middleware/clerkAuth.js` — verifies Clerk session tokens using `@clerk/clerk-sdk-node`, ensures a `Users` DB record exists, and attaches `req.auth` with `userId` and `dbUser`.
- `backend/middleware/adminAuth.js` — checks a JWT (admin login) and ensures role is `admin` or `super-admin`.

Major Routes (and controllers):
- `GET /api/hotels` — `hotelController.getHotels` — returns `{ success, count, data }` with hotel documents.
- `GET /api/hotels/:id` — `hotelController.getHotelById`.
- `POST /api/hotels` — protected (`clerkAuth`) — create hotel.
- `PUT /api/hotels/:id`, `DELETE /api/hotels/:id` — protected updates.

- `POST /api/bookings` — protected (`clerkAuth`) — create a booking. Request body includes `hotelId`, `checkIn`, `checkOut`, `roomType`, `guests`.
- `GET /api/bookings` — get current user bookings.
- `GET /api/bookings/:id` — booking details.

- `GET /api/cart`, `PUT /api/cart`, `POST /api/cart/add` — cart operations (protected).
- `GET /api/wishlist`, `PUT /api/wishlist` — wishlist operations (protected).

- `POST /api/payments/session` — protected — creates a Stripe checkout session. Uses `backend/utils/stripe`.
- `POST /api/payments/webhook` — Stripe webhook handler (no auth). Updates `Bookings.paymentStatus` and `Payments` entries.

- `POST /api/chat` — chat controller that proxies requests to Gemini or OpenAI and provides fallbacks.
- `POST /api/recommendations` — AI recommendations (requires `OPENAI_API_KEY`) and `GET /api/recommendations` for top rated hotels.

- `GET /api/protected` — sample protected route that checks Clerk token.
- `GET /api/proxy-image?url=...` — image proxy to fetch third-party images safely (whitelisted hosts).

Database Models (fields summary):
- `Hotels` (`backend/models/Hotels.js`): ownerId, name, description, location, geo, pricePerNight, roomTypes [{type, price, available}], amenities[], policies, images[], rating, createdAt.
- `Bookings` (`backend/models/Bookings.js`): userId (clerk id string), hotelId (ObjectId), roomType, guests, checkIn, checkOut, totalAmount, paymentStatus, status, cancellationReason, createdAt.
- `Users` (`backend/models/Users.js`): clerkId, name, email, phone, address, role, isVerified, createdAt.
- `Cart` (`backend/models/Cart.js`): userId, items[] with hotelId, roomType, checkIn, checkOut, price, image.
- `Wishlist` (`backend/models/Wishlist.js`): userId, hotels[] (ObjectIds).
- `Payments` (`backend/models/Payments.js`): bookingId, paymentMethod, transactionId, amount, status.

Important controller behaviors and validations:
- Booking creation performs availability checks (overlapping dates, room availability), computes nights and total amount in `bookingController.createBooking`.
- `paymentController.createPaymentSession` will create (or use existing) booking and create a Stripe session; webhook sets booking paymentStatus to `paid`.
- `clerkAuth` will create a user entry in `Users` collection if not already present — this sync behaviour is often important to explain in viva.

Admin:
- Admin auth is separate (username/password) stored in `Admin` model; `adminController.login` returns a JWT with role, used by `adminAuth`.

Local development tips:
- Ensure `MONGO_URI` is set and reachable.
- When testing webhooks locally, use `stripe listen` + `ngrok` or Stripe CLI to forward events, or simulate webhook payloads.
