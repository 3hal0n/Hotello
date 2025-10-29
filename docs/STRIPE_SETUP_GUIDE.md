# Stripe Payment Setup Guide

This guide walks you through setting up Stripe payments for the Hotello booking system.

## Overview

The booking flow uses **Stripe Checkout** (hosted payment page) to collect payments:
1. User selects hotel, dates, room type, and guests
2. Clicks "Pay Now" → Backend creates a Stripe Checkout Session
3. User is redirected to Stripe's hosted payment page
4. User enters card details and completes payment
5. Stripe redirects back to success page
6. Webhook updates booking status to "paid"

---

## Step 1: Get Stripe API Keys

### Sign up for Stripe (if you don't have an account)
1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign up" and create an account
3. Complete the registration process

### Get your test API keys
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in the top right)
3. Go to **Developers → API keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`) - for frontend
   - **Secret key** (starts with `sk_test_...`) - for backend (click "Reveal test key")

---

## Step 2: Configure Backend Environment Variables

Edit `backend/.env` and add your Stripe secret key:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

**Important:** 
- Use your **test mode** secret key (starts with `sk_test_`)
- Never commit this file to Git (it's already in `.gitignore`)
- Keep this key secret - it has full access to your Stripe account

---

## Step 3: Configure Webhook (Optional for Development)

Webhooks allow Stripe to notify your backend when a payment completes. For local development, you can use Stripe CLI to forward webhooks.

### Option A: Use Stripe CLI (Recommended for local development)

1. **Install Stripe CLI:**
   - Download from [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
   - Or use package manager:
     ```powershell
     # Windows (using Scoop)
     scoop install stripe
     
     # Or download the installer from Stripe docs
     ```

2. **Login to Stripe:**
   ```powershell
   stripe login
   ```
   This will open your browser to authorize the CLI.

3. **Forward webhooks to your local server:**
   ```powershell
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
   
4. **Copy the webhook signing secret:**
   The CLI will display a webhook signing secret (starts with `whsec_`). Add it to `backend/.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   ```

5. **Keep the CLI running:**
   Leave the `stripe listen` command running in a terminal while you test payments.

### Option B: Manual Testing (No webhook)

For quick testing, you can skip webhooks. The payment will complete on Stripe's side, but the booking status won't update automatically to "paid". You can manually update it in MongoDB or test the webhook separately.

---

## Step 4: Test the Payment Flow

1. **Start the backend server:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Start the frontend server:**
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Test a booking:**
   - Sign in with Clerk
   - Browse hotels and select one
   - Click "Book Now"
   - Fill in dates, room type, and guests
   - Click "Pay Now"
   - You'll be redirected to **Stripe Checkout** (the payment UI)

4. **Use Stripe test cards:**
   - **Successful payment:** `4242 4242 4242 4242`
   - **Requires authentication (3D Secure):** `4000 0025 0000 3155`
   - **Card declined:** `4000 0000 0000 9995`
   - **Insufficient funds:** `4000 0000 0000 9995`
   
   - Use any future expiry date (e.g., `12/34`)
   - Use any 3-digit CVC (e.g., `123`)
   - Use any postal code (e.g., `12345`)

5. **Verify the flow:**
   - After entering card details and clicking "Pay", Stripe processes the payment
   - You're redirected back to `/payment-success`
   - If webhook is configured, the booking status updates to "paid"
   - Check your Stripe Dashboard → Payments to see the test payment

---

## Step 5: Production Deployment (When Ready)

### Get production API keys
1. In Stripe Dashboard, toggle from **Test mode** to **Live mode**
2. Go to **Developers → API keys**
3. Copy your **live** secret key (starts with `sk_live_`)
4. Update your production environment with:
   ```env
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
   NODE_ENV=production
   ```

### Configure production webhook
1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your production URL: `https://your-backend.com/api/payments/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`) and add to production env:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET
   ```

### Security checklist
- ✅ Use HTTPS for your production backend
- ✅ Verify webhook signatures (already implemented)
- ✅ Store API keys in secure environment variables
- ✅ Never expose secret keys in frontend code
- ✅ Set `FRONTEND_URL` to your production frontend domain

---

## Troubleshooting

### "Stripe is not defined" or "Invalid API key"
- Check that `STRIPE_SECRET_KEY` is set in `backend/.env`
- Verify you're using a test key (starts with `sk_test_`) for development
- Restart the backend server after updating `.env`

### Payment completes but booking status doesn't update
- Check if Stripe CLI is running (`stripe listen`)
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check backend logs for webhook errors
- Test webhook manually:
  ```powershell
  stripe trigger checkout.session.completed
  ```

### "No such checkout session"
- The session might have expired (sessions last 24 hours)
- Create a new booking and try again
- Check Stripe Dashboard → Payments to see if session was created

### CORS errors when redirecting to Stripe
- This is normal - Stripe Checkout runs on Stripe's domain
- Users will be redirected to `checkout.stripe.com`
- After payment, they'll return to your frontend

### Booking shows "pending" after successful payment
- Check if webhook fired (in Stripe CLI output or Dashboard → Webhooks)
- Manually trigger webhook:
  ```powershell
  $body = @{
    type = 'checkout.session.completed'
    data = @{
      object = @{
        metadata = @{ bookingId = 'YOUR_BOOKING_ID' }
      }
    }
  } | ConvertTo-Json -Depth 5

  Invoke-RestMethod -Uri 'http://localhost:5000/api/payments/webhook' -Method POST -Body $body -ContentType 'application/json'
  ```

---

## Test Cards Reference

| Scenario | Card Number | Description |
|----------|-------------|-------------|
| Success | `4242 4242 4242 4242` | Payment succeeds immediately |
| 3D Secure | `4000 0025 0000 3155` | Requires authentication |
| Declined | `4000 0000 0000 0002` | Generic decline |
| Insufficient funds | `4000 0000 0000 9995` | Card has insufficient funds |
| Expired | `4000 0000 0000 0069` | Expired card |

**For all test cards:**
- Expiry: Any future date
- CVC: Any 3 digits
- Postal code: Any valid code

Full list: [https://stripe.com/docs/testing#cards](https://stripe.com/docs/testing#cards)

---

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)
