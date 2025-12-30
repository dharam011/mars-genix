# MarsGenix - Hyperlocal Human-Help Platform

A comprehensive full-stack MERN application connecting customers with local helpers for various services like pickup/drop, delivery, home services, repairs, cleaning, and more.

**Developer**: Dharam
**Tech Stack**: MongoDB, Express.js, React, Node.js
**Status**: ✅ Fully Functional

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [User Roles & Login](#-user-roles--login)
- [Testing the Application](#-testing-the-application)
- [Deployment](#-deployment)
- [Database Schema](#-database-schema)
- [Developer](#-developer)

---

## 🚀 Features

### 🎯 Core Functionality
- **Multi-role System**: Customer, Helper, and Admin roles with distinct dashboards
- **Real-time Task Management**: Create, assign, track, and complete tasks
- **Dynamic Pricing**: Automatic price calculation based on category and distance
- **Helper Verification**: Admin approval workflow for helper onboarding
- **Rating System**: Two-way rating system for quality assurance
- **Earnings Tracking**: Comprehensive earnings dashboard for helpers

### Customer Features
- **Task Management**: Create, track, and manage service requests
- **Price Estimation**: Get instant price estimates based on category and distance
- **Helper Booking**: Book verified helpers for your tasks
- **Order History**: View all past and current tasks
- **Status Tracking**: Real-time task status updates
- **Rating System**: Rate helpers after task completion

### Helper Features
- **Profile Management**: Complete helper profile with categories and documents
- **Online/Offline Toggle**: Control availability status
- **Task Discovery**: Browse available tasks matching your categories
- **Accept/Reject Tasks**: Choose tasks that fit your schedule
- **Status Updates**: Update task progress (in-progress, completed)
- **Earnings Tracking**: View total earnings, pending payments, and completed tasks
- **Rating System**: Build reputation through customer ratings

### Admin Features
- **User Management**: View and manage all users (customers, helpers, admins)
- **Helper Approval**: Approve or reject helper applications
- **Task Oversight**: Monitor all tasks across the platform
- **Analytics Dashboard**: View platform statistics and insights
- **Pricing Controls**: Manage pricing structure
- **Revenue Tracking**: Monitor total platform revenue

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📁 Project Structure

```
marsgenix/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── helperController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── HelperProfile.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── helperRoutes.js
│   │   ├── adminRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── priceCalculator.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── customer/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── helper/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── admin/
│   │   │       └── Dashboard.jsx
│   │   ├── utils/
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas** account (free tier) - [Sign up](https://cloud.mongodb.com)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

### ⚡ Quick Start (5 Minutes Setup)

1. **Clone the repository**
```bash
git clone <repository-url>
cd marsgenix
```

2. **Install all dependencies**
```bash
npm install
```

3. **Setup MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Create a free account
   - Create a new cluster (free tier)
   - Get your connection string
   - Update `backend/.env` with your connection string

4. **Configure Environment Variables**

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=marsgenix_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=30d
```

5. **Start the Application**
```bash
npm run dev
```

This will start:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:5173 (or 5174 if 5173 is in use)

6. **Create Admin Account**

Run the admin creation script:
```bash
node create-admin.js
```

This creates an admin account with:
- **Email**: admin@marsgenix.com
- **Password**: admin123

7. **Access the Application**
   - Frontend: http://localhost:5173 (or 5174)
   - Backend API: http://localhost:5000
   - Login with admin credentials to get started!

### 🔧 Alternative: Manual Installation

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

**Frontend (in another terminal):**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas Connection (Recommended)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/marsgenix?retryWrites=true&w=majority&appName=Cluster0

# OR Local MongoDB
# MONGO_URI=mongodb://localhost:27017/marsgenix

JWT_SECRET=marsgenix_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=30d
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: The frontend `.env` is optional. The default API URL is already configured in `src/utils/axios.js`

## �️ Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net
```
**Solution**:
- Check your MongoDB Atlas connection string in `backend/.env`
- Ensure your IP address is whitelisted in MongoDB Atlas (Network Access)
- Verify your MongoDB username and password are correct

**2. Port Already in Use**
```
Port 5173 is in use, trying another one...
```
**Solution**: This is normal. Vite will automatically use the next available port (5174, 5175, etc.)

**3. Frontend Can't Connect to Backend**
```
Network Error / CORS Error
```
**Solution**:
- Ensure backend is running on http://localhost:5000
- Check `frontend/src/utils/axios.js` has correct API URL
- Verify CORS is enabled in `backend/server.js`

**4. Dependencies Installation Error**
```
npm ERR! peer dependency conflict
```
**Solution**:
```bash
cd frontend
npm install --legacy-peer-deps
```

**5. Admin Can't Login**
**Solution**:
- Run `node create-admin.js` to create admin account
- Or manually update user role to "admin" in MongoDB Atlas

### Need Help?

If you encounter any issues:
1. Check the terminal for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas is accessible
4. Check that all dependencies are installed

## �🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Customer Routes
- `POST /api/customer/tasks` - Create new task
- `POST /api/customer/estimate-price` - Get price estimation
- `GET /api/customer/tasks` - Get all customer tasks
- `GET /api/customer/tasks/:id` - Get single task
- `PUT /api/customer/tasks/:id/cancel` - Cancel task
- `PUT /api/customer/tasks/:id/rate` - Rate helper

### Helper Routes
- `GET /api/helper/profile` - Get helper profile
- `PUT /api/helper/profile` - Update helper profile
- `PUT /api/helper/toggle-status` - Toggle online/offline
- `GET /api/helper/available-tasks` - Get available tasks
- `GET /api/helper/my-tasks` - Get assigned tasks
- `PUT /api/helper/tasks/:id/accept` - Accept task
- `PUT /api/helper/tasks/:id/reject` - Reject task
- `PUT /api/helper/tasks/:id/status` - Update task status
- `GET /api/helper/earnings` - Get earnings data

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/helpers/pending` - Get pending helpers
- `PUT /api/admin/helpers/:id/approve` - Approve/reject helper
- `GET /api/admin/tasks` - Get all tasks
- `PUT /api/admin/tasks/:id` - Update task
- `GET /api/admin/analytics` - Get analytics data

## 👥 User Roles & Login

### Admin
**Default Credentials** (created via `create-admin.js`):
- **Email**: admin@marsgenix.com
- **Password**: admin123
- **Login URL**: http://localhost:5173/login

**Capabilities**:
- Manage all users (customers, helpers, admins)
- Approve/reject helper applications
- View all tasks across the platform
- Access analytics dashboard
- Full platform oversight
- Update user status (activate/deactivate)

**Creating Additional Admins**:
1. Register a new user via the UI
2. Login to MongoDB Atlas
3. Browse Collections → marsgenix → users
4. Find the user and change `role` field to `"admin"`

### Customer
**Registration**: http://localhost:5173/register (select "Customer" role)

**Capabilities**:
- Create and manage tasks
- Book helpers for services
- Rate helpers after task completion
- View order history and status
- Cancel pending tasks
- Get price estimates

### Helper
**Registration**: http://localhost:5173/register (select "Helper" role)

**Important**: Helpers must be approved by admin before they can accept tasks

**Capabilities**:
- Complete profile with categories and documents
- Toggle online/offline status
- View available tasks matching their categories
- Accept/reject tasks
- Update task status (in-progress, completed)
- View earnings and ratings
- Track completed tasks

## 🔄 Task Lifecycle

1. **Pending** - Customer creates task
2. **Assigned** - System assigns task to available helpers
3. **Accepted** - Helper accepts the task
4. **In Progress** - Helper starts working on task
5. **Completed** - Helper completes task
6. **Rated** - Customer rates the helper (optional)

Alternative flows:
- **Cancelled** - Customer cancels task (only when pending)
- **Rejected** - Helper rejects task (goes back to pending)

## 🧪 Testing the Application

### Complete Test Workflow

1. **Start the Application**
```bash
npm run dev
```

2. **Create Admin Account**
```bash
node create-admin.js
```

3. **Login as Admin**
   - Go to http://localhost:5173/login
   - Email: admin@marsgenix.com
   - Password: admin123

4. **Register a Helper**
   - Go to http://localhost:5173/register
   - Fill in details and select "Helper" role
   - Complete helper profile with categories

5. **Approve Helper (as Admin)**
   - Login as admin
   - Go to "Pending Helpers" tab
   - Click "Approve" on the helper

6. **Register a Customer**
   - Go to http://localhost:5173/register
   - Fill in details and select "Customer" role

7. **Create a Task (as Customer)**
   - Login as customer
   - Click "Create New Task"
   - Fill in task details
   - Submit task

8. **Accept Task (as Helper)**
   - Login as helper
   - Toggle status to "Online"
   - View available tasks
   - Accept a task

9. **Complete Task (as Helper)**
   - Update status to "In Progress"
   - Update status to "Completed"

10. **Rate Helper (as Customer)**
    - Login as customer
    - View completed task
    - Rate the helper

### Test Accounts

After running `create-admin.js`, you can create these test accounts:

**Admin**:
- Email: admin@marsgenix.com
- Password: admin123

**Customer** (create manually):
- Email: customer@test.com
- Password: customer123

**Helper** (create manually):
- Email: helper@test.com
- Password: helper123

## 💰 Pricing System

The platform uses a dynamic pricing calculator based on:
- **Base Price**: Category-specific base price
- **Distance Charge**: Per-kilometer rate for location-based services
- **Additional Charges**: Surge pricing for urgent tasks, heavy loads, etc.

Categories:
- Pickup & Drop
- Delivery
- Home Service
- Repair
- Cleaning
- Moving
- Other

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes
- Input validation
- Error handling middleware

## 📱 Responsive Design

The frontend is fully responsive and works seamlessly on:
- Desktop
- Tablet
- Mobile devices

## 🎨 UI/UX Features

- Clean and modern interface
- Intuitive navigation
- Real-time notifications
- Status badges and indicators
- Loading states
- Error handling
- Form validation

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare for deployment**
   - Ensure `backend/package.json` has start script: `"start": "node server.js"`
   - Set environment variables in hosting platform

2. **Environment Variables to Set**
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRE=30d
   ```

3. **Deploy**
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Deploy

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy**
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy

### Quick Deploy Commands

**Vercel (Frontend)**:
```bash
cd frontend
vercel --prod
```

**Railway (Backend)**:
```bash
cd backend
railway up
```

## 📊 Database Schema

### User Model
- name, email, phone, password
- role (customer/helper/admin)
- isVerified, isActive
- address (for customers)
- helperProfile reference

### HelperProfile Model
- user reference
- categories, experience, rating
- isOnline, isApproved
- documents (ID proof, address proof, photo)
- earnings (total, pending, withdrawn)
- completedTasks, totalRatings

### Task Model
- customer, helper references
- category, title, description
- pickupLocation, dropLocation
- scheduledTime, estimatedPrice, finalPrice
- status, paymentStatus
- customerRating, helperRating
- statusHistory, cancellationReason

## 🤝 Contributing

This is a personal project. Contributions, issues, and feature requests are welcome!

## 👨‍💻 Developer

**Dharam**

Full-stack developer passionate about building scalable web applications using the MERN stack.

## 📄 License

This project is a personal portfolio project.

## 🎯 Project Highlights

### Technical Implementation
- ✅ **Full-stack MERN Development**: Complete end-to-end application
- ✅ **RESTful API Design**: 30+ well-structured API endpoints
- ✅ **Role-based Access Control**: Three distinct user roles with protected routes
- ✅ **Real-time Task Management**: Complete task lifecycle management
- ✅ **Responsive Design**: Mobile-first approach with TailwindCSS
- ✅ **Database Design**: Optimized MongoDB schema with relationships
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **State Management**: React Context API for global state
- ✅ **Modern Tooling**: Vite for fast development and builds
- ✅ **Production Ready**: Clean code structure and error handling

### Key Features Implemented
- 🔐 Complete authentication system with role-based access
- 📱 Three separate dashboards (Customer, Helper, Admin)
- 💰 Dynamic pricing calculator based on category and distance
- ✅ Helper verification and approval workflow
- ⭐ Two-way rating system
- 📊 Analytics dashboard for admins
- 💳 Earnings tracking for helpers
- 🔔 Real-time status updates
- 📍 Location-based task assignment
- 🎨 Clean and intuitive UI/UX

## � Project Statistics

- **Total Files**: 50+ files
- **Lines of Code**: 5000+ lines
- **API Endpoints**: 30+ endpoints
- **Database Models**: 3 models (User, HelperProfile, Task)
- **React Components**: 15+ components
- **Development Time**: Complete core system
- **Tech Stack**: MERN (MongoDB, Express, React, Node.js)

## 🌟 Features Showcase

### For Customers
- ✅ Easy task creation with category selection
- ✅ Instant price estimation
- ✅ Real-time task tracking
- ✅ Helper rating system
- ✅ Order history management

### For Helpers
- ✅ Profile management with document upload
- ✅ Online/offline status toggle
- ✅ Task acceptance/rejection
- ✅ Earnings dashboard
- ✅ Rating and review system

### For Admins
- ✅ Complete user management
- ✅ Helper approval workflow
- ✅ Platform analytics
- ✅ Task oversight
- ✅ Revenue tracking

## �📧 Contact

For any questions or collaboration opportunities, feel free to reach out!

**Developer**: Dharam
**Project**: MarsGenix - Hyperlocal Human-Help Platform
**Type**: Full-stack MERN Application

---

**Built with ❤️ by Dharam**

*This project demonstrates proficiency in full-stack web development, database design, API development, authentication systems, and modern React development practices.*

