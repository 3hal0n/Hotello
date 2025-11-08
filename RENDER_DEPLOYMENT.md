# Deploying Hotello Backend to Render

This guide walks you through deploying the Hotello backend (Node.js/Express API) to Render.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- Your code pushed to a GitHub/GitLab/Bitbucket repository
- MongoDB database (MongoDB Atlas recommended for production)
- Required environment variables ready (see below)

## Step 1: Prepare Your Backend

1. **Ensure your backend has a start script** in `backend/package.json`:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Set the PORT dynamically** in `backend/server.js`:
   ```javascript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

3. **Push your code** to GitHub (or your preferred Git provider):
   ```bash
   git add .
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```

## Step 2: Create a New Web Service on Render

1. **Sign in to Render** at https://render.com
2. Click **"New +"** → **"Web Service"**
3. **Connect your repository**:
   - If first time: Click "Connect account" and authorize Render to access your GitHub/GitLab
   - Select your `Hotello` repository
4. **Configure the service**:
   - **Name**: `hotello-backend` (or any name you prefer)
   - **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `backend` (important: this tells Render where your backend code is)
   - **Runtime**: `Node`
   - **Build Command**: `npm install` (Render auto-detects this)
   - **Start Command**: `npm start` (uses the `start` script from package.json)
   - **Plan**: Select `Free` (for testing) or `Starter` (for production)

## Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

### Required Variables

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/hotello?retryWrites=true&w=majority` | Your MongoDB connection string (from MongoDB Atlas) |
| `NODE_ENV` | `production` | Sets the environment to production mode |
| `CLERK_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Your Clerk secret key (from Clerk Dashboard) |
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key (optional, for AI features) |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Your Stripe secret key (for payments) |

### Optional Variables

| Key | Value | Notes |
|-----|-------|-------|
| `CORS_ORIGIN` | `https://your-frontend-url.vercel.app` | Your frontend URL (for CORS, if needed) |
| `PORT` | `5000` | Port (Render sets this automatically, but you can override) |

**Important**: Keep `MONGODB_URI`, `CLERK_SECRET_KEY`, `OPENAI_API_KEY`, and `STRIPE_SECRET_KEY` secret!

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Run `npm install` in the `backend` directory
   - Start your server with `npm start`
3. Monitor the **Logs** tab for deployment progress
4. Once deployed, Render provides a URL like: `https://hotello-backend.onrender.com`

## Step 5: Test Your Deployment

1. **Health check**: Visit `https://hotello-backend.onrender.com/` in your browser
   - You should see your API root response (or configure a `/health` endpoint)
2. **Test an endpoint**: Try `https://hotello-backend.onrender.com/api/hotels`
   - Should return a JSON response with hotels
3. **Check logs**: If something fails, check the **Logs** tab on Render

## Step 6: Update Frontend to Use Production API

Update your frontend's API base URL:

1. In `frontend/.env` or `frontend/.env.production`:
   ```env
   VITE_API_BASE=https://hotello-backend.onrender.com
   ```

2. Or in your frontend code (if using a config file):
   ```javascript
   const API_BASE = import.meta.env.VITE_API_BASE || 'https://hotello-backend.onrender.com';
   ```

3. Redeploy your frontend (Vercel/Netlify/etc.)

## Step 7: Set Up MongoDB Atlas (if not done)

If you don't have a MongoDB database yet:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 tier)
3. Create a database user with a strong password
4. Whitelist IP addresses:
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (`0.0.0.0/0`) for Render access
5. Get your connection string from **Database** → **Connect** → **Connect your application**
6. Add it to Render as `MONGODB_URI`

## Troubleshooting

### Build Fails
- **Check logs**: Look for npm install errors in Render logs
- **Missing dependencies**: Ensure all packages are in `package.json`
- **Node version**: Render uses Node 18+ by default. Specify a version in `package.json`:
  ```json
  "engines": {
    "node": "18.x"
  }
  ```

### Server Crashes on Start
- **Check logs**: Look for runtime errors
- **Environment variables**: Ensure all required env vars are set
- **MongoDB connection**: Verify `MONGODB_URI` is correct and cluster is running

### CORS Errors
- **Update CORS settings** in `backend/server.js`:
  ```javascript
  const cors = require('cors');
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }));
  ```
- Set `CORS_ORIGIN` env var in Render to your frontend URL

### Cold Starts (Free Plan)
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- **Solution**: Upgrade to Starter plan ($7/month) for always-on service

## Auto-Deploy on Push

Render automatically redeploys when you push to your connected branch:

1. Push changes: `git push origin main`
2. Render detects the push and starts a new build
3. Monitor progress in the Render dashboard

## Custom Domain (Optional)

To use your own domain:

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.hotello.com`)
3. Update your domain's DNS records with Render's provided values
4. Wait for SSL certificate provisioning (~5 minutes)

## Summary

Your backend is now live at `https://hotello-backend.onrender.com`! 

**Next steps**:
- Update your frontend's `VITE_API_BASE` environment variable
- Test all API endpoints
- Monitor logs for errors
- Set up health checks and monitoring (optional)

## Additional Resources

- [Render Node.js Docs](https://render.com/docs/deploy-node-express-app)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [MongoDB Atlas Setup](https://docs.mongodb.com/atlas/getting-started/)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [Stripe Dashboard](https://dashboard.stripe.com)

---

**Need help?** Check the Render logs first, then refer to [Render Support](https://render.com/docs/support).
