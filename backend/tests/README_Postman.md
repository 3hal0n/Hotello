# Hotello API Postman Tests

This directory contains Postman collection for testing the Hotello backend API endpoints.

## Setup Instructions

1. **Import the Collection**:
   - Open Postman
   - Click "Import" button
   - Select "File" tab
   - Choose `postman_collection.json` from this directory

2. **Set Environment Variables**:
   - Create a new environment in Postman (or use existing)
   - Add the following variables:
     - `base_url`: `http://localhost:5000/api` (adjust if your server runs on different port)
     - `auth_token`: Your Clerk JWT token (see below)
     - `hotel_id`: Will be set automatically by tests
     - `booking_id`: Will be set automatically by tests

3. **Get Authentication Token**:
   - Since the API uses Clerk for authentication, you need a valid JWT token
   - Sign in to your Clerk dashboard or use your frontend to get a token
   - The token should be in the format: `Bearer <your_jwt_token>`
   - Set this token in the `auth_token` environment variable

## Running the Tests

1. **Start your backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Run tests in order**:
   - Start with unprotected routes (GET /hotels)
   - Then protected routes (you'll need auth_token set)
   - The collection automatically sets `hotel_id` and `booking_id` from responses

## Test Coverage

### Protected Routes
- GET /protected - Tests authentication middleware

### Hotels API
- GET /hotels - Retrieve all hotels
- GET /hotels/:id - Retrieve specific hotel
- POST /hotels - Create new hotel (requires auth)
- PUT /hotels/:id - Update hotel (requires auth)
- DELETE /hotels/:id - Delete hotel (requires auth)

### Bookings API
- POST /bookings - Create new booking (requires auth)
- GET /bookings/:id - Retrieve specific booking (requires auth)

## Test Assertions

Each request includes tests that verify:
- Correct HTTP status codes
- Response structure and required fields
- Data types and values
- Automatic variable setting for dependent requests

## Notes

- Make sure MongoDB is running and connected
- Some tests depend on previous tests setting collection variables
- Dates in booking creation use future dates to avoid validation errors
- Sample data is provided for POST requests
- Authentication is required for protected endpoints