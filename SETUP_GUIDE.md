# MarsGenix Setup Guide

## Complete Installation and Setup Instructions

### Step 1: System Requirements

Ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### Step 2: MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### Step 3: Project Setup

1. **Navigate to project directory**
   ```bash
   cd "c:\Users\dhara\OneDrive\Desktop\mars genix"
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

4. **Create backend .env file**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```
   
   Edit `backend/.env` with your settings:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/marsgenix
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/marsgenix
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=30d
   ```

5. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Create frontend .env file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Step 4: Running the Application

#### Option 1: Run Everything Together (Recommended)
From the root directory:
```bash
npm run dev
```

This will start both backend and frontend simultaneously.

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api

### Step 6: Create Test Accounts

#### Create Admin Account (Using MongoDB)
Since there's no admin registration in the UI, create one directly in MongoDB:

1. Register a normal user through the UI
2. Open MongoDB Compass or use MongoDB shell
3. Find the user in the `users` collection
4. Update the user's role to 'admin':
   ```javascript
   db.users.updateOne(
     { email: "admin@marsgenix.com" },
     { $set: { role: "admin", isVerified: true } }
   )
   ```

#### Test Accounts to Create
1. **Customer Account**
   - Email: customer@test.com
   - Password: password123
   - Role: Customer

2. **Helper Account**
   - Email: helper@test.com
   - Password: password123
   - Role: Helper

3. **Admin Account**
   - Email: admin@test.com
   - Password: password123
   - Role: Admin (set manually in DB)

### Step 7: Testing the Workflow

1. **As Customer:**
   - Login with customer account
   - Create a new task
   - View task in dashboard

2. **As Admin:**
   - Login with admin account
   - Go to "Pending Helpers" tab
   - Approve the helper account

3. **As Helper:**
   - Login with helper account
   - Toggle online status
   - View available tasks
   - Accept a task
   - Update task status to "In Progress"
   - Complete the task

4. **As Customer (again):**
   - View completed task
   - Rate the helper

### Common Issues and Solutions

#### Issue: MongoDB Connection Error
**Solution:** 
- Check if MongoDB is running
- Verify MONGO_URI in .env file
- For Atlas, check IP whitelist and credentials

#### Issue: Port Already in Use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### Issue: Frontend Can't Connect to Backend
**Solution:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env
- Check CORS settings in backend

#### Issue: JWT Token Errors
**Solution:**
- Clear browser localStorage
- Logout and login again
- Check JWT_SECRET is set in backend/.env

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use Postman or Thunder Client for API testing
3. **Database GUI**: Use MongoDB Compass for database visualization
4. **Debugging**: Check browser console and terminal logs

### Production Deployment Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB database
- [ ] Enable HTTPS
- [ ] Set proper CORS origins
- [ ] Add rate limiting
- [ ] Set up error logging
- [ ] Configure environment variables on hosting platform
- [ ] Build frontend: `npm run build`
- [ ] Test all features in production environment

### Next Steps

1. Customize the platform for your needs
2. Add more features (payment integration, notifications, etc.)
3. Implement proper file upload for helper documents
4. Add email verification
5. Implement real-time updates with Socket.io
6. Add mobile app using React Native

---

For any issues or questions, refer to the main README.md or contact the development team.

