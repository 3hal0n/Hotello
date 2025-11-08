# Hotello - Quick Start Guide

## 🚀 Deployment Status (Updated Nov 8, 2025)

- Frontend: https://hotello-ebon.vercel.app (Vercel)
- Backend:  https://hotello-oq0q.onrender.com (Render)


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or cloud instance
- Clerk account for authentication

---

## 📦 Installation

### 1. Clone & Install Dependencies

```powershell
# Navigate to project
cd f:\Hotello

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔧 Configuration

### Backend Setup

1. Create `.env` file in `backend/` directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/hotello

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe Payment (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key

# Server
PORT=3001
```

2. Seed the database with sample hotels:

```powershell
cd backend
node scripts/seedHotels.js
```

### Frontend Setup

1. Create `.env` file in `frontend/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3001
```

---

## ▶️ Running the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```
Backend will run on: http://localhost:3001

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

### Option 2: Development Mode

Backend with nodemon (auto-restart):
```powershell
cd backend
npm run dev
```

---

## 🌐 Access the Application

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:3001/api

---

## 📱 Available Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section with AI search & hotel grid |
| `/hotels` | Hotels Listing | Advanced filters, sorting, search |
| `/hotels/:id` | Hotel Details | Individual hotel information |
| `/booking/:id` | Booking | Booking form and payment |
| `/about` | About Us | Company information & team |
| `/contact` | Contact | Contact form & information |
| `/profile` | User Profile | Bookings, favorites, settings |

---

## 🧪 Testing

### Backend Tests
```powershell
cd backend
npm test
```

### Frontend Tests (to be implemented)
```powershell
cd frontend
npm test
```

---

## 🔑 Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key**
4. Add to `.env` files (both frontend and backend)
5. Configure allowed redirect URLs:
   - Development: `http://localhost:5173`
   - Production: Your production URL

---

## 🎨 UI Components

### Custom Components Created:
- ✅ `Button` - CVA-based button with variants
- ✅ `Input` - Styled input component
- ✅ `Hero` - Carousel with AI search
- ✅ `HotelCard` - Card with glare effect
- ✅ `Navbar` - Responsive navigation
- ✅ `Footer` - Site footer

### Utility Functions:
- ✅ `cn()` - ClassName merger (clsx + tailwind-merge)

---

## 📋 API Endpoints

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create hotel (admin)
- `PUT /api/hotels/:id` - Update hotel (admin)
- `DELETE /api/hotels/:id` - Delete hotel (admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Protected Routes
- `GET /api/protected` - Test Clerk authentication

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"
**Solution**: Ensure MongoDB is running
```powershell
# Start MongoDB service
net start MongoDB
```

### Issue 2: "Clerk authentication not working"
**Solution**: 
1. Check `.env` files have correct keys
2. Verify Clerk application is active
3. Clear browser cache and cookies

### Issue 3: "Port already in use"
**Solution**: Change port in backend `.env`:
```env
PORT=3002
```

### Issue 4: "Module not found"
**Solution**: Reinstall dependencies
```powershell
rm -rf node_modules
npm install
```

---

## 🎯 Features Implemented

### ✅ Completed
- Modern Hero section with carousel
- AI-powered dual search (Destination/Emotion)
- Advanced hotel filtering & sorting
- Responsive design (mobile/tablet/desktop)
- User authentication with Clerk
- User profile with bookings & favorites
- About and Contact pages
- Glassmorphism UI effects
- Smooth animations & transitions
- Loading and empty states

### 🔄 In Progress
- Payment integration with Stripe
- Email notifications
- Hotel reviews system

### 📝 To Do
- Admin dashboard
- Advanced analytics
- Multi-language support
- Dark mode
- PWA functionality

---

## � CI / Deployment

This repository includes CI workflows that validate the frontend and backend on push and pull-request. Deployment is expected to be handled by managed platforms (Vercel / Netlify for the frontend and Render / Railway for the backend).

Workflows added (GitHub Actions):

- `.github/workflows/backend-ci.yml` — runs in the `backend/` folder and performs install, lint, test, and build steps. The previously included Docker publish job has been removed (not required). Use Render or Railway (or your preferred host) for production deployments.

- `.github/workflows/frontend-ci.yml` — runs in the `frontend/` folder and performs install, lint, test, and build steps. No automatic Pages deployment is configured because frontend deploys are typically handled by Vercel or Netlify.

Notes & recommended setup:

- Vercel / Netlify: Connect your GitHub repository to Vercel or Netlify. These providers will build and deploy the `frontend` folder automatically on push to the branches you configure.
- Render / Railway: Connect the `backend` folder (or root) to Render/Railway; configure the service to run `npm start` (or your start script) and set the required environment variables in their dashboard.
- Secrets: No GitHub Actions secrets are required for the standard builds. If you integrate any external registries (Docker Hub, container registry, etc.) you would set corresponding secrets in the GitHub repository settings — but this repo's workflows do not depend on them now.

How to trigger CI locally:
### Status Badges

You can add these status badges to the top of this README to show build status for each workflow. Replace `3hal0n/Hotello` with your repo path if different.

Frontend workflow badge:

`![Frontend CI](https://github.com/3hal0n/Hotello/actions/workflows/frontend-ci.yml/badge.svg)`

Backend workflow badge:

`![Backend CI](https://github.com/3hal0n/Hotello/actions/workflows/backend-ci.yml/badge.svg)`

Security scan badge:

`![Security Scan](https://github.com/3hal0n/Hotello/actions/workflows/security-scan.yml/badge.svg)`

Format check badge:

`![Format Check](https://github.com/3hal0n/Hotello/actions/workflows/format-check.yml/badge.svg)`

Deploy trigger badge:

`![Deploy Trigger](https://github.com/3hal0n/Hotello/actions/workflows/deploy-trigger.yml/badge.svg)`

### Repository secrets (optional)

- `RENDER_DEPLOY_WEBHOOK` — POST target to trigger backend deploys on Render or Railway (if you want CI to automatically notify your hosting provider). Keep this empty if you prefer provider integrations.


1. Push a branch or open a pull request — GitHub Actions will run the workflows.
2. For manual runs, go to the Actions tab, pick a workflow, and use "Run workflow" (workflow_dispatch is enabled).

If you want me to wire up deployments via the Actions (e.g., automatic deploy to Render via API or push to GitHub Container Registry), I can add those steps — otherwise, using the provider integrations is simpler and recommended.

## �📚 Documentation

- **Frontend Complete Guide**: `docs/FRONTEND_COMPLETE.md`
- **Hero Section**: `docs/NEW_HERO_SECTION.md`
- **Advanced UI Components**: `docs/ADVANCED_UI_COMPONENTS.md`
- **Postman Tests**: `backend/tests/README_Postman.md`

---

## 🛠️ Development Tools

### Recommended VS Code Extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- MongoDB for VS Code

### Browser DevTools:
- React Developer Tools
- Redux DevTools (if using Redux)

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build the app:
```powershell
cd frontend
npm run build
```

2. Deploy `dist/` folder

### Backend (Heroku/Railway/Render)
1. Ensure `.env` variables are set
2. Deploy with:
```powershell
git push heroku main
```

### Environment Variables to Set:
- All variables from `.env` files
- Update `VITE_API_URL` to production backend URL

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📞 Support

For issues or questions:
- Email: support@hotello.lk
- GitHub Issues: [Create an issue](https://github.com/yourusername/hotello/issues)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Enjoy Building with Hotello!

Happy coding! 🚀✨
