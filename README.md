# MarsGenix - Hyperlocal Human-Help Platform

A comprehensive MERN stack platform connecting customers with local helpers for various services like pickup/drop, delivery, home services, repairs, cleaning, and more.

## 🚀 Features

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
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd marsgenix
```

2. **Install root dependencies**
```bash
npm install
```

3. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. **Setup Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env if needed (default API URL is http://localhost:5000/api)
```

### Running the Application

**Option 1: Run everything together (from root)**
```bash
npm run dev
```

**Option 2: Run separately**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in another terminal):
```bash
cd frontend
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
MONGO_URI=mongodb://localhost:27017/marsgenix
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔐 API Endpoints

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

## 👥 User Roles

### Customer
- Can create and manage tasks
- Can book helpers
- Can rate helpers after task completion
- Can view order history

### Helper
- Must be approved by admin before accepting tasks
- Can toggle online/offline status
- Can accept/reject available tasks
- Can update task status
- Can view earnings and ratings

### Admin
- Can manage all users
- Can approve/reject helper applications
- Can view all tasks
- Can access analytics dashboard
- Full platform oversight

## 🔄 Task Lifecycle

1. **Pending** - Customer creates task
2. **Accepted** - Helper accepts the task
3. **In Progress** - Helper starts working on task
4. **Completed** - Helper completes task
5. **Rated** - Customer rates the helper (optional)

Alternative flows:
- **Cancelled** - Customer cancels task
- **Rejected** - Helper rejects task

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

### Backend Deployment (Example: Heroku/Railway)
1. Set environment variables
2. Ensure MongoDB connection string is set
3. Deploy using platform-specific commands

### Frontend Deployment (Example: Vercel/Netlify)
1. Build the project: `npm run build`
2. Set VITE_API_URL to production backend URL
3. Deploy the `dist` folder

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

This is an internship project. For any questions or issues, please contact the development team.

## 👨‍💻 Developer

**Intern: Anmol Yadav**

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ for MarsGenix**

