**Search Parameters, AI Emotion Search, React Hooks, and AI Chat/Recommendations**

This document explains how search parameters are used when getting search results, how the AI "emotion" search works, where React hooks are used in the project, and how the AI chatbot and recommendation systems work end-to-end (including prompts and fallbacks).

1) URL params and search flow
- `frontend/src/pages/Hotels.jsx` uses `useSearchParams()` from `react-router-dom` to read query parameters on mount. The code reads `search` and `location` from the URL and uses them to initialise filter state:

  - Example initialization:
    - `const [searchParams, setSearchParams] = useSearchParams();`
    - `const [filters, setFilters] = useState({ search: searchParams.get('search') || '', location: searchParams.get('location') || '', ... })`

- Flow when user arrives on `/hotels` with params:
  1. `Hotels.jsx` reads `search` and `location` from the query string via `useSearchParams()`.
  2. The component sets initial `filters` state from those params.
  3. `useEffect` with dependency on `filters` and `hotels` runs `applyFilters()` which filters the list client-side.

- The app currently uses client-side filtering after fetching the full hotels list from the backend (`GET /api/hotels`). That means URL params are used to shape the UI state and filter the in-memory dataset rather than to request a paginated backend search. This is simple and fast for small datasets but doesn't scale to very large datasets.

2) Common query parameters used in the UI
- `search` (text): matches against hotel `name`, `location`, `description`, `amenities`, and `policies`. The code tokenizes the search string into keywords and tests whether any keyword appears in the combined text.
- `location` (text): substring match against `hotel.location`.
- `priceRange` (string): values like `"0-10000"`, `"20000-30000"`, or `"30000+"` parsed into numeric ranges.
- `rating` (string/number): minimum rating threshold.
- `sortBy` (string): `'featured' | 'price-low' | 'price-high' | 'rating'` used on the client to sort the filtered results.

3) AI Emotion Search — how it works in the UI (AI-POWERED)
- Where: Quick emotion search UI appears in `Home.jsx` and `Hotels.jsx` as a group of buttons labelled with emojis and short labels (Relaxing, Exciting, Romantic, Family, Business, Beach).
- What the buttons do: each button triggers an AI-powered recommendation request with a natural language query describing the mood and preferences, for example:
  - Relaxing: `"I want a peaceful and relaxing hotel with spa and wellness facilities in a quiet serene location"`
  - Exciting: `"Looking for vibrant hotels with nightlife, entertainment, and adventure activities"`

- **AI-powered filtering mechanism:**
  1. Clicking an emotion button calls `POST /api/recommendations` with the natural language query.
  2. Backend (Gemini AI) analyzes the emotional tone, location preferences, amenities, and activities implied by the query.
  3. AI returns a ranked list of hotel names that best match the user's mood and requirements.
  4. Frontend displays the AI-recommended hotels immediately.
  5. If AI fails or is not configured, the system falls back to keyword-based text matching.

- **Why AI matters here:** Simple keyword matching can't understand context like "romantic getaway" → hotels with couple amenities, scenic views, and intimate atmosphere. Gemini AI interprets the emotional intent and matches it with appropriate hotel characteristics.

4) When AI is used for recommendations
- **Emotion search buttons:** NOW use AI via `POST /api/recommendations` (protected) which triggers Gemini AI ranking in `backend/controllers/recommendationController.js`.
- **Manual search input:** Still uses client-side text matching for instant results as user types.
- **Backend AI recommendations:** `POST /api/recommendations` (protected) triggers AI-based ranking:
  - If `GEMINI_API_KEY` is missing, the backend falls back to keyword matching (searching hotel name/location/description/amenities).
  - If a Gemini key is present, the server constructs a detailed prompt containing hotel summaries and the user's query, asks Gemini AI to analyze emotional tone and preferences, then return a JSON array of hotel names ranked by relevance. The returned names are used to filter the hotel list.

- Key prompt design (actual implementation):
  - The prompt includes all hotels with: name, location, description, amenities.
  - Instructions ask AI to: "Analyze the emotional tone, preferences, and requirements in the query. Consider mood/atmosphere (relaxing, exciting, romantic, family-friendly, business), location preferences, amenities, and implied price/luxury level."
  - AI returns: JSON array like `["Hotel Name 1", "Hotel Name 2"]` ordered by relevance (max 6).
  - The response is parsed (handles markdown code blocks) and hotels are filtered by the returned names.

5) How the AI Chatbot works (end-to-end)
- Frontend: `frontend/src/components/AIChatbot.jsx` provides a floating chat widget. When user sends a message:
  1. The widget sends a POST request to `POST /api/chat` with `{ message }` in the request body.
  2. The widget does not require being signed in (it forwards the call without attaching a token in the current implementation) — the backend route allows both authenticated and unauthenticated users. The frontend sends no auth header in this component, so AI chat is treated as guest by server unless the frontend were to pass a token.

- Backend flow (`backend/controllers/chatController.js`):
  1. The controller tries to use Google Generative AI (Gemini) if `GEMINI_API_KEY` exists. It creates a prompt that instructs the model to behave as a hotel booking assistant and then returns the AI text.
  2. If Gemini fails or isn't configured, it attempts to use OpenAI (via `openai.chat.completions.create`) with a similar system prompt and the user message.
  3. If both external services are unavailable or error, the server falls back to a smart rule-based responder: keyword detection for beach, mountain, luxury, budget, etc., returning canned helpful messages.

- Robustness and logging:
  - The controller logs service used and errors for diagnostics; it returns a friendly message to the user when an AI provider fails.

6) AI Recommendations (detailed) — NOW POWERED BY GEMINI AI
- Endpoint: `POST /api/recommendations` — controller `getRecommendations`.
- Input: `{ query }` — a free-text natural language query (emotion-driven or descriptive); the user must be authenticated (endpoint uses `clerkAuth`).
- Behavior:
  1. Load all hotels from MongoDB (include name, location, description, amenities for AI analysis).
  2. If no `GEMINI_API_KEY`: fallback to keyword matching locally (substring search in name/location/description/amenities).
  3. If Gemini AI is enabled:
     - Create a detailed prompt listing all hotels with summaries.
     - Ask Gemini to analyze the user's emotional tone, preferences, activities, location, and luxury level.
     - Request a JSON array of hotel names ranked by relevance (max 6).
  4. Parse Gemini's response (handles markdown code blocks like ```json).
  5. If parsing fails or Gemini errors: fallback to keyword matching.
  6. Filter DB hotels by the AI-returned names and send results to frontend with `aiUsed: true/false` flag.

- Why names instead of full objects?
  - The server asks the model to return only names to make parsing simpler and to avoid the model inventing structured data for fields that must exactly match DB documents. Names are then used to map back to real DB objects.

7) Instances of React hooks used in project (high-level)
- `useState` — used widely for local component state (pages and components: `Home.jsx`, `Hotels.jsx`, `Profile.jsx`, `Cart.jsx`, `AIChatbot.jsx`, `HotelCard.jsx`, etc.).
- `useEffect` — used for data fetching, initialisation, effectful updates and filtering logic (`fetch` calls in `Home.jsx`, `Hotels.jsx`, `Profile.jsx`, `PaymentSuccess.jsx`).
- `useRef` — in UI components that implement DOM-manipulation effects such as `HotelCard.jsx` (tilt/glare) and `Hero.jsx` (GSAP animation) so the code can directly read bounding boxes and set CSS transforms.
- `useCallback` — seen in `frontend/src/hooks/useApi.js` where API functions are memoized using `useCallback` so React components can keep stable references when required.
- `useSearchParams` — in `Hotels.jsx` to read initial `search` and `location` URL query params.
- `useAuth` (from `@clerk/clerk-react`) — used in `useApi.js` and pages like `Wishlist.jsx` and `Profile.jsx` to obtain tokens and sign-out functions.

8) Examples & snippets (copy/paste ready)
- Example: reading query params in `Hotels.jsx`:

```
const [searchParams] = useSearchParams();
const [filters, setFilters] = useState({
  search: searchParams.get('search') || '',
  location: searchParams.get('location') || ''
});
```

- Example: emotion button in `Hotels.jsx` that calls AI recommendations:

```javascript
<button onClick={async () => {
  const query = "I want a peaceful and relaxing hotel with spa and wellness facilities in a quiet serene location";
  setFilters({ ...filters, search: query });
  const response = await fetch(`${API_BASE}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await response.json();
  if (data.success) {
    setHotels(data.data);
    console.log('AI returned', data.data.length, 'hotels', data.aiUsed ? '(AI-powered)' : '(fallback)');
  }
}}>Relaxing</button>
```

- Example: Chat widget send (frontend) — simplified:

```
const response = await fetch(`${API_BASE}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
const data = await response.json();
// data.response contains the assistant text when success
```

- Example: Recommendation prompt (backend actual Gemini implementation):

```javascript
const prompt = `You are an expert hotel recommendation AI for Sri Lanka. Analyze the user's query and match it with the best hotels.

Available hotels:
1. Shangri-La Colombo in Colombo - Luxury 5-star hotel with ocean views...
   Amenities: spa, pool, restaurant, wifi, gym

2. Cinnamon Grand Colombo in Colombo - Premium business hotel...
   Amenities: conference rooms, business center, restaurant

User query: "${query}"

Analyze the emotional tone, preferences, and requirements. Consider:
- Mood and atmosphere (relaxing, exciting, romantic, family-friendly, business)
- Location preferences and activities
- Amenities that match the query
- Price and luxury level implied

Return a JSON array of hotel names (max 6, ordered by relevance).
Return ONLY the JSON array. Example: ["Hotel Name 1", "Hotel Name 2"]`;
```

9) Edge cases and notes to discuss in viva
- URL param syncing: The app reads URL params on mount but does not always update the URL when filters change (Hotels uses `setSearchParams` in some flows but many pages mutate local state only). You can mention this as an area for improvement (sync filter <-> URL for shareable links).
- Scalability: current approach fetches all hotels and filters client-side — works for demo and small datasets but backend search + pagination would be recommended for production.
- AI safety and costs: OpenAI / Gemini keys are optional; when present, the backend sends hotel summaries and user queries to those providers. Explain that in production you should add response validation, rate limiting, prompt injection mitigations, and cost controls.
- Auth for chat: the frontend chat widget currently sends requests without Clerk auth headers, so server treats some requests as guest. If you want personalized recommendations, pass the Clerk token from `useAuth().getToken()` in the chat widget headers and update backend to use user context.

If you want, I can:
- Add an example curl collection with example requests + sample responses for `/api/hotels`, `/api/recommendations`, `/api/chat`, and `/api/bookings`.
- Implement URL <-> state sync so filter changes update query params (or vice-versa) to make sharing filter URLs easier.
