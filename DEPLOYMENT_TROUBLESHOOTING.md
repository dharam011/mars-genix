# 🔧 Deployment Troubleshooting Guide

Common issues and their solutions when deploying MarsGenix.

---

## 🚨 **Frontend Issues**

### ❌ Issue 1: "Network Error" or "Failed to fetch"

**Symptoms:**
- Login/Register doesn't work
- Console shows CORS errors
- API calls fail

**Solutions:**

1. **Check Backend URL in Frontend**
   - Go to Vercel → Frontend Project → Settings → Environment Variables
   - Verify `VITE_API_URL` is correct: `https://your-backend.vercel.app/api`
   - Must end with `/api`
   - After changing, **redeploy** frontend

2. **Check CORS Configuration**
   - Go to Vercel → Backend Project → Settings → Environment Variables
   - Verify `FRONTEND_URL` matches your actual frontend URL
   - No trailing slash: `https://your-frontend.vercel.app`
   - After changing, **redeploy** backend

---

### ❌ Issue 2: "404 Not Found" on Refresh

**Symptoms:**
- App works when navigating from home
- Refreshing any page shows 404

**Solution:**
This is already handled by Vite, but if it happens:
- Check `vercel.json` exists in frontend folder
- Should have rewrites configuration

---

### ❌ Issue 3: Build Failed

**Symptoms:**
- Deployment fails during build
- Error in Vercel logs

**Solutions:**

1. **Check Build Logs**
   - Go to Vercel → Deployments → Click failed deployment
   - Read error message

2. **Common Fixes:**
   ```bash
   # Locally test build
   cd frontend
   npm run build
   
   # If it fails locally, fix errors first
   # Then commit and push
   ```

3. **Missing Dependencies:**
   - Make sure all packages are in `package.json`
   - Run `npm install` locally first

---

## 🚨 **Backend Issues**

### ❌ Issue 4: "Cannot connect to database"

**Symptoms:**
- Backend health check fails
- Login/Register returns 500 error
- Logs show MongoDB connection error

**Solutions:**

1. **Check MongoDB Atlas Network Access**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Click on your cluster
   - Go to **Network Access**
   - Make sure `0.0.0.0/0` is allowed (allows all IPs)
   - Or add Vercel's IP ranges

2. **Check MONGO_URI**
   - Go to Vercel → Backend Project → Settings → Environment Variables
   - Verify `MONGO_URI` is correct
   - Should start with `mongodb+srv://`
   - Should include database name: `/marsgenix?`

3. **Test Connection String**
   - Copy your MONGO_URI
   - Test locally in `.env` file
   - If it works locally, it should work on Vercel

---

### ❌ Issue 5: "Internal Server Error" (500)

**Symptoms:**
- API returns 500 errors
- Backend logs show errors

**Solutions:**

1. **Check Vercel Logs**
   - Go to Vercel → Backend Project → Deployments
   - Click on deployment → View Function Logs
   - Look for error messages

2. **Common Issues:**
   - Missing environment variables
   - Database connection failed
   - JWT_SECRET not set

3. **Verify All Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   FRONTEND_URL=your_frontend_url
   ```

---

### ❌ Issue 6: "Function Timeout"

**Symptoms:**
- Requests take too long
- Vercel shows timeout error

**Solutions:**

1. **Check Database Connection**
   - Slow queries might cause timeout
   - Verify MongoDB Atlas is in same region

2. **Optimize Code**
   - Add indexes to MongoDB collections
   - Reduce unnecessary database calls

---

## 🚨 **General Issues**

### ❌ Issue 7: Changes Not Reflecting

**Symptoms:**
- Made code changes but not visible on deployed site

**Solutions:**

1. **Check Git Push**
   ```bash
   git status
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Check Vercel Auto-Deploy**
   - Go to Vercel → Project → Deployments
   - Should see new deployment after push
   - If not, click **"Redeploy"**

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or open in incognito mode

---

### ❌ Issue 8: Environment Variables Not Working

**Symptoms:**
- Variables showing as undefined
- Features not working that depend on env vars

**Solutions:**

1. **Frontend Variables Must Start with `VITE_`**
   - ✅ Correct: `VITE_API_URL`
   - ❌ Wrong: `API_URL`

2. **After Adding/Changing Env Variables:**
   - Always **redeploy** the project
   - Vercel doesn't auto-redeploy on env changes

3. **Check Variable Names**
   - No typos
   - Case-sensitive
   - No extra spaces

---

## 🔍 **How to Debug**

### Step 1: Check Health Endpoint
```
https://your-backend.vercel.app/health
```
Should return:
```json
{"status": "ok", "timestamp": "..."}
```

### Step 2: Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for errors

### Step 3: Check Network Tab
- Open DevTools (F12)
- Go to Network tab
- Try login/register
- Check if API calls are going to correct URL

### Step 4: Check Vercel Logs
- Go to Vercel Dashboard
- Click on project
- Go to Deployments
- Click on latest deployment
- View Function Logs

---

## 📞 **Still Having Issues?**

1. **Check Vercel Status:** [status.vercel.com](https://status.vercel.com)
2. **Check MongoDB Atlas Status:** [status.mongodb.com](https://status.mongodb.com)
3. **Review Deployment Guide:** See `DEPLOYMENT_GUIDE.md`

---

## ✅ **Quick Verification Checklist**

Before asking for help, verify:

- [ ] Code pushed to GitHub
- [ ] Both frontend and backend deployed on Vercel
- [ ] All environment variables added correctly
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Backend `FRONTEND_URL` points to frontend
- [ ] MongoDB Atlas allows connections from anywhere
- [ ] Health endpoint returns success
- [ ] Tried hard refresh / incognito mode

---

**Last Updated:** December 2024

