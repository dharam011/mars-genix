# MarsGenix Quick Reference Card

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Access the app
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## 📁 Project Structure

```
marsgenix/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite UI
├── README.md         # Main documentation
├── SETUP_GUIDE.md    # Installation guide
└── ARCHITECTURE.md   # System design
```

## 🔑 Default Ports

- **Frontend:** 5173 (Vite)
- **Backend:** 5000 (Express)
- **MongoDB:** 27017 (Local)

## 👥 User Roles

| Role     | Capabilities                                    |
|----------|-------------------------------------------------|
| Customer | Create tasks, book helpers, rate services       |
| Helper   | Accept tasks, update status, track earnings    |
| Admin    | Manage users, approve helpers, view analytics   |

## 📊 Task Lifecycle

```
Pending → Accepted → In Progress → Completed → Rated
         ↓
      Rejected
         ↓
      Cancelled
```

## 🔐 Authentication

**Register:**
```http
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "customer"
}
```

**Login:**
```http
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

## 🛣️ Key API Routes

### Customer
- `POST /api/customer/tasks` - Create task
- `GET /api/customer/tasks` - Get my tasks
- `POST /api/customer/estimate-price` - Get price
- `PUT /api/customer/tasks/:id/rate` - Rate helper

### Helper
- `PUT /api/helper/toggle-status` - Go online/offline
- `GET /api/helper/available-tasks` - View tasks
- `PUT /api/helper/tasks/:id/accept` - Accept task
- `PUT /api/helper/tasks/:id/status` - Update status
- `GET /api/helper/earnings` - View earnings

### Admin
- `GET /api/admin/users` - All users
- `GET /api/admin/helpers/pending` - Pending helpers
- `PUT /api/admin/helpers/:id/approve` - Approve helper
- `GET /api/admin/analytics` - Dashboard stats

## 💰 Service Categories

1. **pickup_drop** - Pickup & Drop services
2. **delivery** - Delivery services
3. **home_service** - Home services
4. **repair** - Repair services
5. **cleaning** - Cleaning services
6. **moving** - Moving services
7. **other** - Other services

## 🎨 UI Components

**Buttons:**
- `btn btn-primary` - Primary action
- `btn btn-secondary` - Secondary action
- `btn btn-danger` - Delete/Cancel

**Badges:**
- `badge badge-success` - Completed
- `badge badge-warning` - Pending
- `badge badge-info` - In Progress
- `badge badge-danger` - Cancelled

**Cards:**
- `card` - Standard card container

## 🔧 Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/marsgenix
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Common Issues

**MongoDB Connection Error:**
```bash
# Start MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend Dependency Error:**
```bash
cd frontend
npm install --legacy-peer-deps
```

## 📝 Testing Workflow

1. **Register 3 users** (customer, helper, admin)
2. **As Admin:** Approve helper
3. **As Helper:** Go online
4. **As Customer:** Create task
5. **As Helper:** Accept & complete task
6. **As Customer:** Rate helper
7. **As Admin:** View analytics

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password Hashing (bcryptjs)
- ✅ Role-Based Access Control
- ✅ Protected Routes
- ✅ Input Validation
- ✅ Error Handling

## 📦 Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs

**Frontend:**
- React + Vite
- TailwindCSS
- React Router
- Axios

## 📚 Documentation Files

1. **README.md** - Overview & features
2. **SETUP_GUIDE.md** - Installation steps
3. **ARCHITECTURE.md** - System design
4. **API_TESTING.md** - API examples
5. **DEPLOYMENT_CHECKLIST.md** - Deploy guide
6. **PROJECT_SUMMARY.md** - Complete summary
7. **QUICK_REFERENCE.md** - This file

## 🎯 Next Steps

- [ ] Set up MongoDB
- [ ] Install dependencies
- [ ] Create .env files
- [ ] Start servers
- [ ] Create test accounts
- [ ] Test complete workflow
- [ ] Deploy to production

## 📞 Support

For issues or questions:
1. Check SETUP_GUIDE.md
2. Review API_TESTING.md
3. Check console logs
4. Verify environment variables
5. Contact development team

---

**MarsGenix** - Built with ❤️ using MERN Stack  
**Developer:** Anmol Yadav | **Date:** December 2024

