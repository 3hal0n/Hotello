**Viva Checklist & Demonstration Notes**

Use this checklist to prepare talking points and live demos for your viva.

Project summary (short elevator pitch):
- "Hotello is a full-stack hotel booking app using React (Vite) and an Express + MongoDB backend. It supports Clerk authentication, Stripe payments, and optional AI features for chat and recommendations."

Key things to explain (bullet answers / demo pointers):
- **Architecture:** Frontend (React, Clerk) ↔ Backend (Express + Mongoose) ↔ Stripe & AI services.
- **Authentication:** Clerk tokens are verified in `backend/middleware/clerkAuth.js`. Explain token verification + local `Users` sync.
- **Booking lifecycle:** Create booking -> payment session -> stripe checkout -> webhook updates booking to `paid`.
- **Why image proxy?** Avoids CORS and protects from open proxying by whitelisting hosts.
- **Error handling:** Central express error handler in `server.js` returns 500 and logs; controllers catch and return structured responses. Frontend falls back to mock data.

Live demo checklist (commands & steps):
1. Start backend: ``cd backend; npm i (if needed); npm run dev``
2. Start frontend: ``cd frontend; npm i (if needed); npm run dev``
3. Open `http://localhost:5173` and show:
   - Console logs produced by `Hotels.jsx` when fetching hotels.
   - Network tab showing `GET /api/hotels` response and JSON structure.
   - Click a hotel to show `GET /api/hotels/:id` and `HotelCard` rendering.
   - Show grid responsiveness by resizing window (grid classes switch columns).

Demo booking & payment (if Stripe keys configured):
- Create booking (requires signin via Clerk) → POST `/api/bookings`.
- Start checkout → POST `/api/payments/session` → follow Stripe page.
- Simulate webhook with Stripe CLI: `stripe listen --forward-to localhost:5000/api/payments/webhook`.

Common viva questions and short answers:
- Q: "How do you paginate and filter hotels?"
  - A: Frontend paginates client-side after fetching all hotels (9 per page), filters are applied in `applyFilters` inside `Hotels.jsx`.
- Q: "How is authentication handled?"
  - A: Clerk handles user sessions. Frontend obtains tokens via Clerk's `getToken()` and `useApi` attaches the `Bearer` token. Backend validates tokens using `clerkClient.verifyToken` in `clerkAuth` middleware.
- Q: "How do you secure admin routes?"
  - A: Separate admin login returns a JWT (`adminController.login`), `adminAuth` middleware validates and checks role.
- Q: "How do you handle payments and ensure bookings are marked paid?"
  - A: A Stripe checkout session is created (metadata includes `bookingId`); Stripe webhook updates booking and payments documents.
- Q: "How are edge cases handled (no network / API down)?"
  - A: Frontend falls back to `mockHotels` and shows friendly error messages; controllers return `success: false` with messages; server has global 500 handler.

Files to open during viva for quick reference:
- `backend/server.js`, `backend/middleware/clerkAuth.js`, `backend/controllers/bookingController.js`, `backend/controllers/paymentController.js`.
- `frontend/src/hooks/useApi.js`, `frontend/src/pages/Hotels.jsx`, `frontend/src/components/HotelCard.jsx`.

Pro tip: Have your `.env` values printed (not secrets) in server logs for demonstration of `FRONTEND_URL` and `MONGO_URI` resolution. Use console logs that are already present in controllers to point out flows.
