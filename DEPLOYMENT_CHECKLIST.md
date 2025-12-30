# MarsGenix Deployment Checklist

## Pre-Deployment Setup

### 1. MongoDB Setup
- [ ] Install MongoDB locally OR
- [ ] Create MongoDB Atlas account and cluster
- [ ] Create database user with read/write permissions
- [ ] Whitelist IP addresses (0.0.0.0/0 for development)
- [ ] Get connection string
- [ ] Update `backend/.env` with MONGO_URI

### 2. Environment Configuration

**Backend (.env)**
- [ ] Set `NODE_ENV=development`
- [ ] Set `PORT=5000`
- [ ] Set `MONGO_URI` with your MongoDB connection string
- [ ] Set `JWT_SECRET` to a strong random string
- [ ] Set `JWT_EXPIRE=30d`

**Frontend (.env)**
- [ ] Set `VITE_API_URL=http://localhost:5000/api`

### 3. Dependencies Installation
- [ ] Run `npm install` in root directory
- [ ] Run `npm install` in backend directory
- [ ] Run `npm install --legacy-peer-deps` in frontend directory

### 4. Database Initialization
- [ ] Start MongoDB service
- [ ] Verify connection by starting backend
- [ ] Database and collections will be created automatically

## Local Development Testing

### 1. Start Backend
```bash
cd backend
npm run dev
```
- [ ] Backend starts on port 5000
- [ ] MongoDB connection successful
- [ ] No errors in console

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
- [ ] Frontend starts on port 5173
- [ ] No build errors
- [ ] Can access http://localhost:5173

### 3. Create Test Accounts

**Customer Account**
- [ ] Register at http://localhost:5173/register
- [ ] Email: customer@test.com
- [ ] Password: password123
- [ ] Role: Customer

**Helper Account**
- [ ] Register at http://localhost:5173/register
- [ ] Email: helper@test.com
- [ ] Password: password123
- [ ] Role: Helper

**Admin Account**
- [ ] Register a user through UI
- [ ] Open MongoDB Compass or shell
- [ ] Update user role to 'admin':
  ```javascript
  db.users.updateOne(
    { email: "admin@test.com" },
    { $set: { role: "admin", isVerified: true } }
  )
  ```

### 4. Test Complete Workflow

**As Admin:**
- [ ] Login successfully
- [ ] View pending helpers
- [ ] Approve helper account
- [ ] View analytics dashboard
- [ ] Check all users list

**As Helper:**
- [ ] Login successfully
- [ ] Update profile with categories
- [ ] Toggle online status (should work after approval)
- [ ] View available tasks (empty initially)

**As Customer:**
- [ ] Login successfully
- [ ] Get price estimate
- [ ] Create a new task
- [ ] View task in dashboard

**As Helper (again):**
- [ ] See available task
- [ ] Accept the task
- [ ] Update status to "In Progress"
- [ ] Update status to "Completed"

**As Customer (again):**
- [ ] View completed task
- [ ] Rate the helper (1-5 stars)

**As Admin (final check):**
- [ ] View updated analytics
- [ ] Check task in all tasks list
- [ ] Verify helper earnings updated

## Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Prepare for Deployment**
   - [ ] Create `.gitignore` (already exists)
   - [ ] Ensure `.env` is in `.gitignore`
   - [ ] Create production MongoDB database

2. **Deploy to Heroku**
   ```bash
   heroku create marsgenix-api
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your_production_mongodb_uri
   heroku config:set JWT_SECRET=your_production_jwt_secret
   git push heroku main
   ```

3. **Deploy to Railway**
   - [ ] Connect GitHub repository
   - [ ] Set environment variables in Railway dashboard
   - [ ] Deploy automatically

4. **Deploy to Render**
   - [ ] Create new Web Service
   - [ ] Connect GitHub repository
   - [ ] Set build command: `cd backend && npm install`
   - [ ] Set start command: `cd backend && npm start`
   - [ ] Add environment variables

### Frontend Deployment (Vercel/Netlify)

1. **Update Environment**
   - [ ] Update `VITE_API_URL` to production backend URL
   - [ ] Example: `VITE_API_URL=https://marsgenix-api.herokuapp.com/api`

2. **Deploy to Vercel**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

3. **Deploy to Netlify**
   - [ ] Connect GitHub repository
   - [ ] Set build command: `cd frontend && npm run build`
   - [ ] Set publish directory: `frontend/dist`
   - [ ] Add environment variable: `VITE_API_URL`

### Post-Deployment Verification

- [ ] Backend API is accessible
- [ ] Frontend loads without errors
- [ ] Can register new users
- [ ] Can login successfully
- [ ] All API endpoints working
- [ ] Database operations successful
- [ ] CORS configured correctly
- [ ] Environment variables set properly

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Passwords are hashed (bcryptjs)
- [ ] Environment variables not committed to Git
- [ ] CORS configured for production domains only
- [ ] MongoDB connection uses authentication
- [ ] API rate limiting implemented (future)
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info

## Performance Optimization

- [ ] Database indexes created for frequently queried fields
- [ ] Frontend build optimized (Vite handles this)
- [ ] Images optimized (if any)
- [ ] API responses use lean queries
- [ ] Unnecessary console.logs removed

## Monitoring & Maintenance

- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Monitor API performance
- [ ] Set up database backups
- [ ] Monitor server resources
- [ ] Set up uptime monitoring
- [ ] Create admin alerts for critical errors

## Documentation

- [ ] README.md complete
- [ ] SETUP_GUIDE.md available
- [ ] ARCHITECTURE.md documented
- [ ] API_TESTING.md with examples
- [ ] Environment variables documented
- [ ] Deployment process documented

## Final Checks

- [ ] All features working in production
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing done
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Backup and recovery plan in place
- [ ] Team trained on system usage
- [ ] Support documentation ready

---

## Quick Commands Reference

**Start Development:**
```bash
# From root directory
npm run dev
```

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Test Backend API:**
```bash
cd backend
npm test  # (if tests are written)
```

**Database Backup:**
```bash
mongodump --uri="your_mongodb_uri" --out=./backup
```

**Database Restore:**
```bash
mongorestore --uri="your_mongodb_uri" ./backup
```

---

**Status:** Ready for deployment ✅  
**Last Updated:** December 2024  
**Developer:** Anmol Yadav

