# AI Chatbot Setup - Gemini API

The chatbot now uses **Google Gemini AI** (free tier) as the primary AI service with OpenAI as fallback.

## Get Your Free Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

## Add to Backend

Open `backend/.env` and add:

```
GEMINI_API_KEY=your_api_key_here
```

## Features

- ✅ Free tier with generous limits
- ✅ No credit card required
- ✅ Automatic fallback to OpenAI if Gemini fails
- ✅ Hotel booking assistance
- ✅ Travel tips for Sri Lanka
- ✅ Concise, helpful responses

## Testing

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Click the floating AI chatbot icon on the home page
4. Ask questions like:
   - "What are the best beaches in Sri Lanka?"
   - "Recommend a luxury hotel in Colombo"
   - "What's the weather like in Kandy?"

## Current Status

- OpenAI Key: ⚠️ May have quota limits
- Gemini AI: ✅ Ready (add your free API key)
- Fallback: ✅ Works automatically
