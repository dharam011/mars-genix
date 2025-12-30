# 🚀 Deployment Quick Start Checklist

## Before You Deploy - DO THIS FIRST ✅

### ✅ Step 1: MongoDB Atlas Setup (10 minutes)
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create M0 (Free) cluster
- [ ] Create database user `marsgenix_user`
- [ ] Save the password somewhere safe
- [ ] Whitelist IP: `0.0.0.0/0` (for development)
- [ ] Copy MongoDB connection string
- [ ] Replace `<password>` and `<username>` in connection string

**Your MongoDB URI will look like:**
```
mongodb+srv://marsgenix_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/marsgenix?retryWrites=true&w=majority
```

---

### ✅ Step 2: Create `.env` Files (5 minutes)

#### Create `backend/.env`:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://marsgenix_user:PASSWORD@cluster0.xxxxx.mongodb.net/marsgenix?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here-must-be-at-least-32-characters-long
JWT_EXPIRE=30d
FRONTEND_URL=https://marsgenix.vercel.app
```

#### Create `frontend/.env.local` (for local testing):
```env
VITE_API_URL=http://localhost:5000/api
```

- [ ] Backend `.env` created with MongoDB URI
- [ ] Frontend `.env.local` created
- [ ] Both files added to `.gitignore` (already done)

---

### ✅ Step 3: Test Locally (15 minutes)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (wait for backend to start)
cd frontend
npm install
npm run dev
```

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Can access MongoDB from backend
- [ ] Can login/register on frontend

**Test:** Go to http://localhost:5173, try to register/login

---

### ✅ Step 4: Push Code to GitHub (5 minutes)
```bash
# Make sure .env files are in .gitignore
git add .
git commit -m "Prepare for deployment - add health check and CORS config"
git push origin main
```

- [ ] Code pushed to GitHub
- [ ] `.env` files NOT in git (check via GitHub)
- [ ] `backend/.gitignore` created
- [ ] All changes committed

---

## Now Deploy! 🎯

### ✅ Step 5: Deploy Backend to Render.com (5-10 minutes)
1. Go to https://render.com
2. Sign up with GitHub
3. Create new Web Service
4. Select your GitHub repo
5. Fill in:
   - Name: `marsgenix-api`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend` (if needed)

6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your JWT secret
   - `JWT_EXPIRE` = `30d`
   - `FRONTEND_URL` = Will add after Vercel deployment

7. Deploy and wait 5-10 minutes
8. Copy the URL (e.g., `https://marsgenix-api.onrender.com`)

- [ ] Render account created
- [ ] Backend deployed
- [ ] Backend URL copied

---

### ✅ Step 6: Deploy Frontend to Vercel (5-10 minutes)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your GitHub repo
4. Configure:
   - Framework: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add Environment Variable:
   - `VITE_API_URL` = `https://marsgenix-api.onrender.com/api` (your Render URL)

6. Deploy and wait 2-3 minutes
7. Copy the URL (e.g., `https://marsgenix.vercel.app`)

- [ ] Vercel account created
- [ ] Frontend deployed
- [ ] Frontend URL copied
- [ ] Environment variable set

---

### ✅ Step 7: Connect Them Together (2 minutes)
1. Go back to Render backend settings
2. Update `FRONTEND_URL` = Your Vercel URL
3. Redeploy backend

- [ ] Backend updated with Vercel URL
- [ ] Backend redeployed

---

## 🧪 Test Your Deployment

1. **Test Backend**: https://marsgenix-api.onrender.com/health
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Frontend**: https://marsgenix.vercel.app
   - Should load without errors
   - Try to register/login
   - Check browser console (F12) - no CORS errors?

3. **Check Network Tab** (F12 → Network)
   - API calls should go to Render backend
   - Status 200 = Success
   - Status 401 = Auth issue (expected on login page)
   - Status 5xx = Backend error

---

## ⚠️ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| CORS error in browser | Wait 2 min for Render redeploy, clear browser cache |
| MongoDB connection error | Check MONGO_URI, verify IP whitelist on Atlas |
| 502 Bad Gateway | Free Render tier spinning down, wait 30s and retry |
| Can't log in | Check JWT_SECRET is same on backend |
| Frontend won't load | Check VITE_API_URL in Vercel environment variables |
| API returns 401 Unauthorized | Token issue, clear localStorage and login again |

---

## 📱 Once Everything Works

Congratulations! 🎉 Your app is now live!

**Live URLs:**
- Frontend: https://marsgenix.vercel.app
- Backend API: https://marsgenix-api.onrender.com
- API Health: https://marsgenix-api.onrender.com/health

**For Future Updates:**
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel & Render auto-deploy!
```

---

## 💰 Optional: Upgrade for Better Performance

- **Render Starter Tier**: $7/month (prevents app from spinning down)
- **MongoDB Atlas M2 Tier**: $9/month (for more storage & performance)
- **Vercel Pro**: $20/month (for more build minutes, optional)

For now, the **free tier** is perfect for testing! ✅

