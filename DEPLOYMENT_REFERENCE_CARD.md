# 🎫 Deployment Reference Card

**Quick reference for deploying MarsGenix**

---

## 📍 Account Links (Open in Browser)

```
MongoDB Atlas:      https://www.mongodb.com/cloud/atlas
Render:             https://render.com
Vercel:             https://vercel.com
GitHub:             https://github.com (if needed)
```

---

## 📋 Step 1: MongoDB Atlas (10 min)

```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with email
3. Create M0 Cluster
4. Create User: marsgenix_user
5. Whitelist IP: 0.0.0.0/0
6. Get Connection String:
   mongodb+srv://marsgenix_user:PASSWORD@cluster0.xxx.mongodb.net/marsgenix?retryWrites=true&w=majority
```

**Save this string!** ➡️ Use in backend/.env

---

## 📋 Step 2: Local Setup (5 min)

### Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://marsgenix_user:PASSWORD@cluster0.xxx.mongodb.net/marsgenix?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
JWT_SECRET=your-32-character-secret-key-here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Test:
```bash
cd backend && npm install && npm run dev
# In new terminal:
cd frontend && npm install && npm run dev
```

✅ Should work at http://localhost:5173

---

## 📋 Step 3: GitHub (5 min)

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

⚠️ Verify .env files NOT in GitHub!

---

## 📋 Step 4: Render Backend (10 min)

```
1. Go to https://render.com
2. Sign up with GitHub
3. New Web Service
4. Select your repo
5. Configure:
   - Name: marsgenix-api
   - Build: npm install
   - Start: npm start
   - Root: backend (if needed)

6. Environment Variables (Add each):
   - NODE_ENV = production
   - MONGO_URI = [your MongoDB string]
   - JWT_SECRET = [your secret]
   - JWT_EXPIRE = 30d
   - FRONTEND_URL = (fill after Vercel)

7. Deploy
8. Wait 5-10 min
9. Copy URL: https://marsgenix-api.onrender.com
```

**Save this URL!** ➡️ Use for Vercel

---

## 📋 Step 5: Vercel Frontend (10 min)

```
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import Project
4. Configure:
   - Framework: Vite
   - Root: frontend
   - Build: npm run build
   - Output: dist

5. Environment Variables:
   - VITE_API_URL = https://marsgenix-api.onrender.com/api

6. Deploy
7. Wait 2-3 min
8. Copy URL: https://marsgenix.vercel.app
```

**Save this URL!** ➡️ Use for Render update

---

## 📋 Step 6: Connect (2 min)

```
1. Go back to Render dashboard
2. Backend settings
3. Update FRONTEND_URL = https://marsgenix.vercel.app
4. Redeploy
5. Done!
```

---

## 🧪 Testing

### Test Backend:
```
https://marsgenix-api.onrender.com/health
Should show: {"status":"ok","timestamp":"..."}
```

### Test Frontend:
```
https://marsgenix.vercel.app
Should load the website
Try to register/login
```

### Check Errors:
```
Open https://marsgenix.vercel.app
Press F12 (Developer Tools)
Look at Console tab
Look at Network tab
All green? You're done! ✅
```

---

## 🆘 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS Error | Update Render FRONTEND_URL, wait 2 min |
| MongoDB Failed | Check MONGO_URI in Render env vars |
| Can't Login | Clear browser cache, check JWT_SECRET |
| 502 Bad Gateway | Free Render spinning up, wait 30s |
| API Not Found | Check VITE_API_URL in Vercel env vars |

---

## 📝 Important URLs

```
Local Dev:
- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- Health:   http://localhost:5000/health

Production:
- Frontend: https://marsgenix.vercel.app
- Backend:  https://marsgenix-api.onrender.com
- Health:   https://marsgenix-api.onrender.com/health
```

---

## 💾 Environment Variables Summary

**Backend (Render Dashboard)**:
```
NODE_ENV=production
PORT=5000
MONGO_URI=<your MongoDB string>
JWT_SECRET=<your secret>
JWT_EXPIRE=30d
FRONTEND_URL=<your Vercel URL>
```

**Frontend (Vercel Dashboard)**:
```
VITE_API_URL=<your Render URL>/api
```

---

## 📞 Useful Commands

```bash
# Generate JWT Secret (Mac/Linux)
openssl rand -base64 32

# Test backend locally
curl http://localhost:5000/health

# Test frontend build
cd frontend && npm run build && npm run preview

# Push to GitHub
git add .
git commit -m "message"
git push origin main
```

---

## ⏱️ Timeline

```
Total Time: ~45 minutes

MongoDB:      10 min
Local Setup:   5 min
GitHub:        5 min
Render:       10 min
Vercel:       10 min
Connect:       2 min
Testing:       3 min
```

---

## ✅ Success Checklist

- [ ] MongoDB cluster created and running
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set
- [ ] Health check returns 200
- [ ] Website loads without errors
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can create a task
- [ ] API calls are working

---

## 🎉 After Deployment

### To Make Changes:
```bash
# Edit code locally
# Test locally
git add .
git commit -m "description"
git push
# Vercel & Render auto-deploy!
```

### To Check Logs:
- Render: Dashboard → Backend Service → Logs
- Vercel: Dashboard → Project → Deployments → Logs

### To Update Env Vars:
- Render: Settings → Environment Variables
- Vercel: Settings → Environment Variables

---

**Start with:** [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)

