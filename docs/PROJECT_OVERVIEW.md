**Project Overview**

This repository implements "Hotello" — a hotel discovery and booking web application with a React frontend and an Express + MongoDB backend. It integrates authentication (Clerk), payments (Stripe), and optional AI features (OpenAI / Google Generative API) for recommendations and chat.

- **Frontend:** React (Vite), Tailwind-style utilities (project includes Tailwind & Soft UI CSS), Clerk for authentication, React Router for routes, and many presentational components in `frontend/src`.
- **Backend:** Node.js + Express, Mongoose for MongoDB models, Clerk SDK for verifying auth tokens, Stripe integration for checkout and webhooks, and controllers in `backend/controllers`.
- **DB Models:** `Hotels`, `Bookings`, `Users`, `Cart`, `Wishlist`, `Payments`, plus an `Admin` model.

Key folders:
- `backend/` — server, API routes, controllers, middleware, Mongoose models, seed scripts and utils.
- `frontend/` — React app under `src/`, public assets in `public/assets/img`, components and pages.
- `docs/` — (this folder) documentation for your viva.

Run / dev commands:
- Backend (in `backend`): `npm run dev` (uses `nodemon server.js`).
- Frontend (in `frontend`): `npm run dev` (uses `vite`).

Environment variables of interest (in backend `.env`):
- `MONGO_URI`, `PORT`, `JWT_SECRET`, `FRONTEND_URL`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `STRIPE_*`, `VITE_CLERK_PUBLISHABLE_KEY` (frontend)

Short summary of functionality:
- Browse hotels, filter, and paginate results.
- View hotel details and images.
- Create bookings, add items to a cart, maintain a wishlist.
- Checkout via Stripe (creates a payment session and listens to webhooks).
- Admin endpoints for statistics and management (JWT-based admin auth).
- AI features: chat assistant and recommendations (optional, requires API keys).
