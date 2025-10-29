# Booking Implementation and Stripe Integration

This guide explains in depth how Stripe is integrated in this project, step-by-step, with API examples and dashboard instructions. It targets developers familiar with REST APIs and React.

- Backend: `aidf-5-back-end` (Node/Express/Mongoose/Clerk)
- Frontend: `aidf-5-front-end` (React, RTK Query, Clerk, Stripe Embedded Checkout)

---

## Understanding Stripe Payment Architecture

### High-Level Payment Flow

Stripe payment systems typically follow this pattern:

1. **Product Catalog**: Define what you're selling (products/prices)
    1. **Payable Entity Creation**: Create a record representing what the user is purchasing
2. **Payment Intent**: Create a payment session when user wants to pay
3. **Payment Collection**: Use Stripe's UI components to collect payment
4. **Payment Processing**: Stripe handles the actual payment processing
5. **State Transition**: Update the payable entity's payment status on successful completion

### Core Payment Concept: Payable Entities

**What is a Payable Entity?**
A payable entity is a database record that represents something a user is purchasing. It serves as the bridge between your business logic and the payment system.

**Key Characteristics:**

- **Linked to User**: Every payable entity belongs to a specific user
- **Linked to Product/Service**: Represents what the user is buying
- **Payment State**: Tracks the payment status (PENDING, PAID, FAILED, etc.)
- **Unique Identifier**: Used to reconcile payments with business records

**Examples of Payable Entities:**

- **Booking**: Hotel room reservation (our case)
- **Order**: E-commerce purchase
- **Subscription**: Recurring service
- **Invoice**: Service billing

### Payment State Management Flow

The payment integration follows this state-driven approach:

```
1. CREATE PAYABLE ENTITY
   User initiates purchase → Create payable entity with PENDING status

2. INITIATE PAYMENT
   User clicks "Pay" → Create Stripe payment session with entity metadata

3. PAYMENT PROCESSING
   User completes payment → Stripe processes the transaction

4. STATE TRANSITION
   Payment succeeds → Update payable entity to PAID status
   Payment fails → Update payable entity to FAILED status

```

**Why This Pattern?**

- **Reliability**: Payment processing is asynchronous - users might close their browser
- **Audit Trail**: Every transaction is tracked in your database
- **Business Logic**: You can enforce business rules based on payment status
- **Reconciliation**: Easy to match Stripe payments with your records

### Our Implementation: Booking as Payable Entity

In our hotel booking system:

**Booking Entity Structure:**

```tsx
{
  _id: "booking_123",
  userId: "user_456",           // Links to user
  hotelId: "hotel_789",         // Links to product/service
  checkIn: "2024-01-15",
  checkOut: "2024-01-17",
  roomNumber: "101",
  paymentStatus: "PENDING",     // Payment state
  paymentMethod: "CARD",
}

```

**Payment Flow:**

1. **Create Booking**: User selects dates → Create booking with `paymentStatus: "PENDING"`
2. **Initiate Payment**: User clicks "Pay" → Create Stripe Checkout Session with `bookingId` in metadata
3. **Process Payment**: Stripe handles payment collection and processing
4. **Update Status**: Webhook receives `checkout.session.completed` → Update booking to `paymentStatus: "PAID"`

**State Transitions:**

- `PENDING` → `PAID`: Payment successful
- `PENDING` → `FAILED`: Payment failed or expired
- `PAID` → `REFUNDED`: Refund processed (future enhancement)

### Payment Status Lifecycle

```
PENDING (Initial State)
    ↓
    ├─ Payment Success → PAID
    ├─ Payment Failed → FAILED
    └─ Payment Expired → EXPIRED

```

**Business Rules Based on Status:**

- `PENDING`: Booking exists but not confirmed, can be cancelled
- `PAID`: Booking confirmed, room reserved, user can check in
- `FAILED`: Booking invalid, user must retry payment
- `EXPIRED`: Booking expired, user must create new booking

### Metadata Linking Strategy

**Why Metadata?**
Stripe webhooks don't know about your business entities. Metadata creates the link:

```tsx
// When creating Checkout Session (from payment.ts)
const session = await stripe.checkout.sessions.create({
  ui_mode: "embedded",
  line_items: [lineItem],
  mode: "payment",
  return_url: `${FRONTEND_URL}/booking/complete?session_id={CHECKOUT_SESSION_ID}`,
  metadata: {
    bookingId: booking._id.toString(),  // Links Stripe session to our booking
  },
});

// In webhook handler (from payment.ts)
const booking = await Booking.findById(checkoutSession.metadata?.bookingId);
if (checkoutSession.payment_status !== "unpaid") {
  await Booking.findByIdAndUpdate(booking._id, { paymentStatus: "PAID" });
}

```

### Error Handling & Edge Cases

**Duplicate Payments:**

- User clicks "Pay" multiple times → Create multiple sessions for same booking
- Solution: Check if booking already has `PAID` status before creating session

**Webhook Failures:**

- Stripe webhook fails → Booking stays `PENDING` but payment succeeded
- Solution: Implement status polling as backup, retry webhook processing

**Race Conditions:**

- User completes payment while webhook is processing
- Solution: Use database transactions, idempotent webhook handlers

**Payment Expiration:**

- User abandons payment → Session expires
- Solution: Implement cleanup job to mark expired bookings as `EXPIRED`

**Payment Architecture Patterns**

(omitted for brevity in this file)

---

## Stripe Dashboard: step-by-step

1. Get keys
    - Dashboard → Developers → API keys
    - Copy Publishable key (frontend) and Secret key (backend).
2. Create a webhook endpoint
    - Dashboard → Developers → Webhooks → Add endpoint
    - Endpoint URL: `${BACKEND_URL}/api/stripe/webhook` (your deployed backend URL + `/api/stripe/webhook`)
    - Select events:
        - `checkout.session.completed`
        - `checkout.session.async_payment_succeeded`
    - Save and copy the "Signing secret" and set `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## Data model changes

- `Hotel`:
    - `stripePriceId: string` (default Price ID for the hotel’s Product). Mandatory for checkout in our implementation.
- `Booking`:
    - `paymentStatus: "PENDING" | "PAID"` (created as `PENDING`, becomes `PAID` after payment)

---

## Backend implementation details

### 1) Creating a hotel: Product + default Price

- File: `aidf-5-back-end/src/application/hotel.ts` (function `createHotel`)
- After validating input and generating an embedding, we call:

```tsx
const product = await stripe.products.create({
  name: result.data.name,
  description: result.data.description,
  default_price_data: {
    unit_amount: Math.round(result.data.price * 100),
    currency: "usd",
  },
});

```

- We extract `default_price` from the product and store it as `stripePriceId` on the `Hotel` record.

Admin re-setup endpoint:

- `POST /api/hotels/:_id/stripe/price` → Recreates a product with `default_price_data` for a hotel and updates `stripePriceId`.

### 2) Seeding hotels and creating Stripe products sequentially

- File: `aidf-5-back-end/src/seed.ts`
- After inserting hotels, we loop over each hotel:
    - Create Stripe product with `default_price_data`
    - Store `stripePriceId` on the hotel
    - Wait ~300ms between requests to avoid 429 rate limits.

### 3) Creating a booking (user attribution)

- File: `aidf-5-back-end/src/application/booking.ts` → `createBooking`
- Extract user using Clerk:

```tsx
const { userId } = getAuth(req);
if (!userId) {
  throw new UnauthorizedError("Unauthorized");
}

```

- Create the booking with `PENDING` payment status.

### 4) Starting a Checkout Session (Embedded)

- File: `aidf-5-back-end/src/application/payment.ts` → `createCheckoutSession`
- For a booking with check-in/out dates, we compute number of nights and create:

```tsx
if (!hotel.stripePriceId) {
  return res.status(400).json({ message: "Stripe price ID is missing for this hotel" });
}
const session = await stripe.checkout.sessions.create({
  ui_mode: "embedded",
  line_items: [{ price: hotel.stripePriceId, quantity: numberOfNights }],
  mode: "payment",
  return_url: `${FRONTEND_URL}/booking/complete?session_id={CHECKOUT_SESSION_ID}`,
  metadata: { bookingId: booking._id.toString() },
});

```

- We intentionally do not use `price_data` here; a price ID and quantity are sufficient.

### 5) Retrieving session status (and idempotent mark as PAID)

- File: `aidf-5-back-end/src/application/payment.ts` → `retrieveSessionStatus`
- `GET /api/payments/session-status?session_id=...`
- Returns `{ booking, hotel, status, customer_email, paymentStatus }` and updates booking to `PAID` if the session is paid.

### 6) Webhook verification and fulfillment

- Files:
    - `aidf-5-back-end/src/index.ts` (register raw-body route BEFORE JSON parser)
    - `aidf-5-back-end/src/application/payment.ts` (`handleWebhook`, `fulfillCheckout`)
- Route registration:

```tsx
app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

```

- The webhook destination in Stripe Dashboard must point to your deployed backend: `${BACKEND_URL}/api/stripe/webhook`.
- Handler (simplified):

```tsx
const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
  await fulfillCheckout((event.data.object as any).id);
}

```

- `fulfillCheckout` retrieves the session, reads `metadata.bookingId`, and sets the booking’s `paymentStatus` to `PAID`.

Security notes:

- Webhook route must NOT use `express.json()`; it must receive the raw body.
- Always verify the signature (`STRIPE_WEBHOOK_SECRET`).

---

## Frontend implementation details

### 1) API layer

- File: `aidf-5-front-end/src/lib/api.js`
- Exposes RTK Query endpoints:
    - `createBooking` (POST `bookings`)
    - `getBookingById` (GET `bookings/:id`)
    - `createCheckoutSession` (POST `payments/create-checkout-session`)
    - `getCheckoutSessionStatus` (GET `payments/session-status?session_id=...`)
- Uses Clerk token authentication in `prepareHeaders`

### 2) Embedded Checkout component

- File: `aidf-5-front-end/src/components/CheckoutForm.jsx`
- Loads Stripe with `VITE_STRIPE_PUBLISHABLE_KEY` and fetches the `clientSecret` from the backend using the Clerk token.
- Renders `<EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>` and `<EmbeddedCheckout />`.

### 3) Booking flow pages

- `hotel-details.page.jsx`: launches `BookingDialog` and then navigates to `/booking/payment?bookingId=...`.
- `payment.page.jsx`: renders `CheckoutForm`.
- `complete.page.jsx`: reads `session_id` and calls `getCheckoutSessionStatus`, then shows a success view.

---

## Local development steps

1. Configure env files for both backend and frontend (see above).
2. Install dependencies in both apps (already in repo, but run `npm i` if needed).
3. Start backend:

```
cd aidf-5-back-end
npm run dev

```

1. Start frontend:

```
cd aidf-5-front-end
npm run dev

```

1. Seed data (optional):

```
cd aidf-5-back-end
npm run seed

```

1. In the browser:
    - Go to a hotel details page → Book Now → pick dates → submit.
    - Redirected to `/booking/payment` → Embedded Checkout loads.
    - Complete payment with test card (e.g., `4242 4242 4242 4242`, future expiry, any CVC).
    - Redirect to `/booking/complete?session_id=...` → see confirmation.

---

## Production checklist

- Set `FRONTEND_URL` to the deployed frontend.
- Configure a production webhook endpoint to your deployed backend.
- Store secrets in your platform’s secret manager (e.g., Vercel/Netlify/Render/AWS/GCP).
- Use HTTPS in production for webhook and app URLs.
- Rotate keys regularly in Stripe Dashboard.
- Monitor failed webhooks and 4xx from your endpoint.

---

## Troubleshooting

- Embedded Checkout not rendering: ensure `VITE_STRIPE_PUBLISHABLE_KEY` is valid and the `create-checkout-session` call succeeds with a `clientSecret`.
- 401/403 from backend: ensure Clerk token is present (frontend `prepareHeaders` waits for Clerk) and role checks are satisfied for admin routes.
- Webhook 400 “No signatures found” or “Invalid payload”: confirm the route uses raw body, the endpoint URL matches Stripe Dashboard, and `STRIPE_WEBHOOK_SECRET` is correct.
- Seeding 429 rate limits: increase the delay between Stripe product creations (currently ~300ms) or run in batches.
- Missing price: use admin route `POST /api/hotels/:_id/stripe/price` or recreate the hotel; checkout requires `stripePriceId`.

---

## References (current)

- Embedded Checkout: https://docs.stripe.com/checkout/embedded
- Webhooks: https://docs.stripe.com/webhooks
- Checkout Sessions API: https://docs.stripe.com/api/checkout/sessions
- Prices: https://docs.stripe.com/api/prices
- Products: https://docs.stripe.com/api/products
- Testing: https://docs.stripe.com/testing
