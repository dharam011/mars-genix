# MarsGenix System Architecture

## Overview
MarsGenix is a full-stack MERN application following a three-tier architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│                    (React + Vite + Tailwind)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Customer   │  │    Helper    │  │    Admin     │     │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Auth Context (JWT Token Management)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                           │
│                  (Node.js + Express.js)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                         │  │
│  │  • CORS  • Body Parser  • Auth  • Error Handler     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │   Customer   │  │    Helper    │     │
│  │    Routes    │  │    Routes    │  │    Routes    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │    Admin     │  │     Task     │                        │
│  │    Routes    │  │    Routes    │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 Controllers Layer                     │  │
│  │  • Business Logic  • Request Validation              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Services Layer                       │  │
│  │  • Price Calculator  • Token Generator               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│                        (MongoDB)                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Users     │  │HelperProfile │  │    Tasks     │     │
│  │  Collection  │  │  Collection  │  │  Collection  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Architecture

#### 1. Pages Layer
- **Authentication Pages**: Login, Register
- **Customer Pages**: Dashboard with task management
- **Helper Pages**: Dashboard with task acceptance and earnings
- **Admin Pages**: Dashboard with user and task management

#### 2. Context Layer
- **AuthContext**: Global authentication state management
  - User data storage
  - Login/Logout functionality
  - Token management
  - Role-based access control

#### 3. Components Layer
- **Layout**: Shared layout with header and navigation
- **Reusable Components**: Cards, Badges, Modals

#### 4. Utils Layer
- **Axios Instance**: Configured HTTP client with interceptors
- **API Helpers**: Centralized API calls

### Backend Architecture

#### 1. Routes Layer
Defines API endpoints and maps them to controllers:
- `/api/auth/*` - Authentication routes
- `/api/customer/*` - Customer-specific routes
- `/api/helper/*` - Helper-specific routes
- `/api/admin/*` - Admin-specific routes
- `/api/tasks/*` - Shared task routes

#### 2. Middleware Layer
- **authMiddleware**: JWT verification and user authentication
- **authorize**: Role-based access control
- **errorMiddleware**: Centralized error handling
- **CORS**: Cross-origin resource sharing

#### 3. Controllers Layer
Business logic for each domain:
- **authController**: User registration, login, profile management
- **customerController**: Task creation, price estimation, ratings
- **helperController**: Task acceptance, status updates, earnings
- **adminController**: User management, analytics, approvals

#### 4. Models Layer
MongoDB schemas using Mongoose:
- **User**: Core user data with role-based fields
- **HelperProfile**: Extended helper information
- **Task**: Task lifecycle and relationships

#### 5. Utils Layer
- **generateToken**: JWT token creation
- **priceCalculator**: Dynamic pricing logic

### Database Schema Design

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: Enum ['customer', 'helper', 'admin'],
  isVerified: Boolean,
  isActive: Boolean,
  helperProfile: ObjectId (ref: HelperProfile),
  address: Object,
  timestamps: true
}
```

#### HelperProfile Model
```javascript
{
  user: ObjectId (ref: User),
  categories: Array,
  experience: Number,
  rating: Number,
  totalRatings: Number,
  completedTasks: Number,
  isOnline: Boolean,
  isApproved: Boolean,
  documents: Object,
  earnings: {
    total: Number,
    pending: Number,
    withdrawn: Number
  },
  availability: String,
  vehicleType: String,
  timestamps: true
}
```

#### Task Model
```javascript
{
  customer: ObjectId (ref: User),
  helper: ObjectId (ref: User),
  category: String,
  title: String,
  description: String,
  pickupLocation: Object,
  dropLocation: Object,
  scheduledTime: Date,
  estimatedPrice: Number,
  finalPrice: Number,
  status: Enum,
  paymentStatus: Enum,
  customerRating: Object,
  helperRating: Object,
  statusHistory: Array,
  cancellationReason: String,
  timestamps: true
}
```

## Data Flow

### Task Creation Flow
1. Customer fills task form in frontend
2. Frontend sends POST request to `/api/customer/tasks`
3. Backend validates request and calculates price
4. Task created in database with status 'pending'
5. Response sent back to frontend
6. Frontend updates UI and shows success message

### Helper Acceptance Flow
1. Helper views available tasks
2. Helper clicks "Accept Task"
3. Frontend sends PUT request to `/api/helper/tasks/:id/accept`
4. Backend verifies helper is approved and online
5. Task status updated to 'accepted', helper assigned
6. Response sent back to frontend
7. Frontend refreshes task lists

### Admin Approval Flow
1. Admin views pending helpers
2. Admin clicks "Approve" or "Reject"
3. Frontend sends PUT request to `/api/admin/helpers/:id/approve`
4. Backend updates helper profile approval status
5. User verification status updated
6. Response sent back to frontend
7. Frontend updates pending list

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Backend validates and generates JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Backend middleware verifies token on each request
6. User data attached to request object

### Authorization Layers
- **Route Level**: Middleware checks if user is authenticated
- **Role Level**: Middleware checks if user has required role
- **Resource Level**: Controllers verify ownership of resources

## Scalability Considerations

### Current Architecture
- Monolithic backend with modular structure
- RESTful API design
- Stateless authentication (JWT)
- Document-based database (MongoDB)

### Future Enhancements
1. **Microservices**: Split into user, task, and payment services
2. **Caching**: Redis for session and frequently accessed data
3. **Message Queue**: RabbitMQ/Kafka for async task processing
4. **Real-time**: Socket.io for live updates
5. **File Storage**: AWS S3 for document uploads
6. **CDN**: CloudFront for static assets
7. **Load Balancing**: Nginx for distributing traffic
8. **Monitoring**: Prometheus + Grafana for metrics

## API Design Principles

1. **RESTful**: Standard HTTP methods (GET, POST, PUT, DELETE)
2. **Consistent Response Format**: 
   ```javascript
   {
     success: boolean,
     data: object/array,
     message: string (optional)
   }
   ```
3. **Error Handling**: Centralized error middleware
4. **Validation**: Input validation at controller level
5. **Pagination**: Support for large datasets (future)
6. **Versioning**: API version in URL (future: /api/v1/*)

## Performance Optimizations

1. **Database Indexing**: Indexes on frequently queried fields
2. **Lean Queries**: Use `.lean()` for read-only operations
3. **Selective Population**: Only populate required fields
4. **Compression**: Gzip compression for responses
5. **Lazy Loading**: Frontend loads data on demand
6. **Code Splitting**: React lazy loading for routes

---

This architecture provides a solid foundation for the MarsGenix platform with room for growth and scalability.

