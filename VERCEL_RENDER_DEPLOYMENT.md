# MarsGenix - Vercel + Render Deployment Guide

## 📋 Deployment Architecture

```
Frontend: React + Vite → Vercel
   ↓ (API Calls)
Backend: Node.js + Express → Render.com
   ↓ (ODM)
Database: MongoDB Atlas (Cloud)
```

---

## 🔧 PART 1: MongoDB Atlas Setup (Required for Both)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up Free"
3. Create account with email/password
4. Verify email

### Step 2: Create a Cluster
1. Click "Create a Deployment"
2. Select "M0 (Free)" tier
3. Choose your cloud provider (AWS recommended)
4. Select region (choose closest to your users)
5. Click "Create Deployment"
6. Wait 2-3 minutes for cluster creation

### Step 3: Create Database User
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. **Username**: `marsgenix_user`
4. **Password**: Generate strong password (save it!)
5. **Built-in Role**: `Atlas admin`
6. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Databases" → Your cluster
2. Click "Connect"
3. Select "Drivers"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<username>` with `marsgenix_user`

**Example**:
```
mongodb+srv://marsgenix_user:PASSWORD@cluster0.xxxxx.mongodb.net/marsgenix?retryWrites=true&w=majority
```

---

## 🚀 PART 2: Backend Deployment on Render.com

### Step 1: Prepare Backend for Production

#### Update `backend/server.js` for production:
```javascript
// Add health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

#### Create `backend/.env.production`:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://marsgenix_user:PASSWORD@cluster0.xxxxx.mongodb.net/marsgenix?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=30d
```

**⚠️ IMPORTANT**: 
- Do NOT commit `.env` files to GitHub
- Update `backend/.gitignore` to include `.env*`

### Step 2: Prepare backend/package.json
Ensure `package.json` has correct scripts:
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

### Step 3: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Verify email

### Step 4: Deploy Backend to Render
1. Push backend code to GitHub with `.env.production` added to `.gitignore`
2. On Render dashboard, click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Fill in details:
   - **Name**: `marsgenix-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. Click "Advanced"
7. Under "Environment Variables", add:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: (paste your MongoDB connection string)
   - `JWT_SECRET`: (your secret key)
   - `JWT_EXPIRE`: `30d`

8. Click "Create Web Service"
9. Wait 5-10 minutes for deployment
10. Once deployed, copy your backend URL (e.g., `https://marsgenix-api.onrender.com`)

⚠️ **Note**: Free tier on Render spins down after 15 minutes of inactivity. For production, upgrade to Starter tier ($7/month).

---

## 🎨 PART 3: Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Production

#### Create `frontend/.env.production`:
```env
VITE_API_URL=https://marsgenix-api.onrender.com/api
```

#### Update `frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### Step 2: Test Build Locally
```bash
cd frontend
npm run build
npm run preview
```
Ensure no errors and app loads correctly.

### Step 3: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your GitHub repos

### Step 4: Deploy Frontend to Vercel
1. On Vercel dashboard, click "Add New..." → "Project"
2. Import your GitHub repository
3. Select the root of your project (the `mars genix` folder)
4. Configure project:
   - **Project Name**: `marsgenix`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (if Vercel doesn't detect it)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Click "Environment Variables"
6. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://marsgenix-api.onrender.com/api`

7. Click "Deploy"
8. Wait 2-3 minutes for deployment
9. Once deployed, get your Vercel URL (e.g., `https://marsgenix.vercel.app`)

---

## 🔗 PART 4: Connect Frontend to Backend

### Update Backend CORS Settings

In `backend/server.js`, update CORS configuration:
```javascript
app.use(cors({
  origin: [
    'https://marsgenix.vercel.app', // Your Vercel URL
    'http://localhost:5173',         // Local development
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Re-deploy backend on Render after this change.

---

## ✅ Testing Deployment

### Test Backend
```bash
curl https://marsgenix-api.onrender.com/health
```
Should return: `{"status":"ok","timestamp":"2025-12-30T..."}`

### Test Frontend
1. Open https://marsgenix.vercel.app
2. Try to register/login
3. Check browser console for any errors
4. Check network tab to verify API calls to Render backend

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Update backend CORS to include Vercel URL |
| 502 Bad Gateway from Render | Wait 2-3 min or check environment variables |
| MongoDB connection fails | Verify connection string and whitelist IP |
| API calls timeout | Free Render tier may be slow, upgrade if needed |
| Frontend shows 404 | Ensure `VITE_API_URL` is set correctly |

---

## 📊 Cost Breakdown

| Service | Tier | Price | Notes |
|---------|------|-------|-------|
| Vercel Frontend | Free | $0 | Unlimited deployments |
| Render Backend | Free | $0 | Spins down after 15 min (dev only) |
| Render Backend | Starter | $7/month | Always running (production) |
| MongoDB Atlas | Free M0 | $0 | 512MB storage, good for testing |
| MongoDB Atlas | Premium | $57+/month | For production with more storage |

**Total minimum cost**: $0 (free tier), **Recommended**: $7/month (Render Starter)

---

## 🔐 Security Checklist

- [ ] `.env` files added to `.gitignore`
- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] MongoDB user has limited permissions (not admin for production)
- [ ] CORS only allows your domain(s)
- [ ] No sensitive keys in GitHub
- [ ] Use HTTPS everywhere (Vercel + Render provide this)
- [ ] Regularly update dependencies for security patches

---

## 📱 Environment Variables Summary

**Backend (.env)**:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
```

**Frontend (.env)**:
```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Troubleshooting**: Check application logs in Vercel/Render dashboards

---

## 📝 Quick Reference Commands

```bash
# Local testing
cd backend && npm run dev
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Test production build locally
cd frontend && npm run preview

# Check for environment variable issues
echo $MONGO_URI
echo $JWT_SECRET
```

