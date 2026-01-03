# 🚀 MarsGenix Deployment Guide

Complete step-by-step guide to deploy MarsGenix frontend and backend to production.

---

## 📋 **Prerequisites**

Before starting, make sure you have:
- ✅ GitHub account
- ✅ Vercel account (free) - [Sign up here](https://vercel.com/signup)
- ✅ MongoDB Atlas database (already configured)
- ✅ Git installed on your computer

---

## 🗂️ **Step 1: Push Code to GitHub**

### 1.1 Initialize Git Repository (if not already done)

```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit - MarsGenix ready for deployment"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New Repository"**
3. Name it: `marsgenix` (or any name you prefer)
4. **DO NOT** initialize with README (we already have code)
5. Click **"Create Repository"**

### 1.3 Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/marsgenix.git
git branch -M main
git push -u origin main
```

---

## 🎨 **Step 2: Deploy Frontend to Vercel**

### 2.1 Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `marsgenix` repository
5. Vercel will detect it's a monorepo

### 2.2 Configure Frontend Deployment

**Framework Preset:** Vite  
**Root Directory:** `frontend`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### 2.3 Add Environment Variables

In Vercel project settings, add:

```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

**Note:** We'll update this URL after deploying the backend in Step 3.

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://marsgenix-frontend.vercel.app`
4. **Save this URL** - you'll need it for backend CORS configuration

---

## ⚙️ **Step 3: Deploy Backend to Vercel**

### 3.1 Create New Vercel Project for Backend

1. Go back to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** again
3. Select the **same** `marsgenix` repository
4. This time configure it for backend

### 3.2 Configure Backend Deployment

**Framework Preset:** Other  
**Root Directory:** `backend`  
**Build Command:** (leave empty)  
**Output Directory:** (leave empty)  
**Install Command:** `npm install`

### 3.3 Add Environment Variables

In Vercel project settings, add these environment variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://dharam801799_db_user:5w41MRex1Mr4Inli@cluster0.vi7czi4.mongodb.net/marsgenix?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=marsgenix_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=30d
FRONTEND_URL=https://marsgenix-frontend.vercel.app
```

**Replace `FRONTEND_URL`** with your actual frontend URL from Step 2.4

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://marsgenix-backend.vercel.app`
4. **Save this URL**

---

## 🔄 **Step 4: Update Frontend with Backend URL**

### 4.1 Update Frontend Environment Variable

1. Go to your **Frontend** project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Update `VITE_API_URL` to your backend URL:
   ```
   VITE_API_URL=https://marsgenix-backend.vercel.app/api
   ```
4. Click **"Save"**

### 4.2 Redeploy Frontend

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment to complete

---

## ✅ **Step 5: Test Your Deployment**

### 5.1 Test Backend Health

Open in browser:
```
https://your-backend-url.vercel.app/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-12-31T..."
}
```

### 5.2 Test Frontend

1. Open your frontend URL: `https://your-frontend-url.vercel.app`
2. Try to **Register** a new account
3. Try to **Login**
4. Check if dashboard loads

---

## 🎯 **Your Deployed URLs**

After completing all steps, you'll have:

- **Frontend:** `https://your-frontend-name.vercel.app`
- **Backend:** `https://your-backend-name.vercel.app`
- **Database:** MongoDB Atlas (already configured)

---

## 🔧 **Common Issues & Solutions**

### Issue 1: CORS Error
**Solution:** Make sure `FRONTEND_URL` in backend matches your actual frontend URL

### Issue 2: API Not Found (404)
**Solution:** Check `VITE_API_URL` in frontend environment variables includes `/api` at the end

### Issue 3: Database Connection Failed
**Solution:** Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0) in Network Access

### Issue 4: Build Failed
**Solution:** Check build logs in Vercel. Usually missing dependencies or syntax errors

---

## 🔄 **Future Updates**

When you make changes to your code:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will **automatically redeploy** both frontend and backend! 🎉

---

## 📱 **Custom Domain (Optional)**

To add a custom domain:

1. Go to Vercel project → **Settings** → **Domains**
2. Add your domain
3. Update DNS records as instructed by Vercel

---

## 🎉 **Congratulations!**

Your MarsGenix application is now live and accessible worldwide!

**Developer:** Dharam | **Date:** December 2024

