# ⚡ Quick Deployment Steps

## 🚀 **5-Minute Deployment Checklist**

### **Step 1: Push to GitHub** (2 minutes)
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/marsgenix.git
git push -u origin main
```

---

### **Step 2: Deploy Frontend** (2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"** → Import your GitHub repo
3. **Settings:**
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variable:**
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
   (Add this after backend deployment, then redeploy)
5. Click **Deploy**
6. **Save your frontend URL**

---

### **Step 3: Deploy Backend** (2 minutes)

1. Click **"New Project"** again → Same GitHub repo
2. **Settings:**
   - Root Directory: `backend`
   - Framework: Other
3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://dharam801799_db_user:5w41MRex1Mr4Inli@cluster0.vi7czi4.mongodb.net/marsgenix?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=marsgenix_super_secret_jwt_key_2024_change_in_production
   JWT_EXPIRE=30d
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
4. Click **Deploy**
5. **Save your backend URL**

---

### **Step 4: Update Frontend** (1 minute)

1. Go to Frontend project → Settings → Environment Variables
2. Update `VITE_API_URL` with your backend URL
3. Go to Deployments → Redeploy

---

### **Step 5: Test** (1 minute)

✅ Open frontend URL  
✅ Register new account  
✅ Login  
✅ Create a task  

---

## 🎯 **Your URLs**

- **Frontend:** `https://__________.vercel.app`
- **Backend:** `https://__________.vercel.app`
- **Health Check:** `https://your-backend.vercel.app/health`

---

## 🔥 **That's It!**

Your app is now **LIVE** and accessible worldwide! 🌍

Any future code changes → Just `git push` → Auto-deploys! 🚀

