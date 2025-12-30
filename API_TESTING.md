# MarsGenix API Testing Guide

## Quick Start Testing with Postman/Thunder Client

### Base URL
```
http://localhost:5000/api
```

## 1. Authentication APIs

### Register Customer
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "customer"
}
```

### Register Helper
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Jane Helper",
  "email": "jane@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "helper"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## 2. Customer APIs

### Create Task
```http
POST /customer/tasks
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "category": "pickup_drop",
  "title": "Pick up package from store",
  "description": "Need someone to pick up a package from the local store",
  "scheduledTime": "2024-01-15T10:00:00Z",
  "pickupLocation": {
    "address": "123 Main St",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "dropLocation": {
    "address": "456 Park Ave",
    "coordinates": {
      "latitude": 28.6200,
      "longitude": 77.2100
    }
  }
}
```

### Get Price Estimate
```http
POST /customer/estimate-price
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "category": "pickup_drop",
  "pickupLocation": {
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "dropLocation": {
    "coordinates": {
      "latitude": 28.6200,
      "longitude": 77.2100
    }
  }
}
```

### Get My Tasks
```http
GET /customer/tasks
Authorization: Bearer CUSTOMER_TOKEN

# Filter by status
GET /customer/tasks?status=pending
```

### Cancel Task
```http
PUT /customer/tasks/TASK_ID/cancel
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

### Rate Helper
```http
PUT /customer/tasks/TASK_ID/rate
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "rating": 5,
  "review": "Excellent service!"
}
```

## 3. Helper APIs

### Get Helper Profile
```http
GET /helper/profile
Authorization: Bearer HELPER_TOKEN
```

### Update Helper Profile
```http
PUT /helper/profile
Authorization: Bearer HELPER_TOKEN
Content-Type: application/json

{
  "categories": ["pickup_drop", "delivery"],
  "experience": 2,
  "availability": "full_time",
  "vehicleType": "bike"
}
```

### Toggle Online/Offline
```http
PUT /helper/toggle-status
Authorization: Bearer HELPER_TOKEN
```

### Get Available Tasks
```http
GET /helper/available-tasks
Authorization: Bearer HELPER_TOKEN
```

### Get My Tasks
```http
GET /helper/my-tasks
Authorization: Bearer HELPER_TOKEN

# Filter by status
GET /helper/my-tasks?status=accepted
```

### Accept Task
```http
PUT /helper/tasks/TASK_ID/accept
Authorization: Bearer HELPER_TOKEN
```

### Update Task Status
```http
PUT /helper/tasks/TASK_ID/status
Authorization: Bearer HELPER_TOKEN
Content-Type: application/json

{
  "status": "in_progress"
}

# Or to complete
{
  "status": "completed",
  "note": "Task completed successfully"
}
```

### Get Earnings
```http
GET /helper/earnings
Authorization: Bearer HELPER_TOKEN
```

## 4. Admin APIs

### Get All Users
```http
GET /admin/users
Authorization: Bearer ADMIN_TOKEN

# Filter by role
GET /admin/users?role=helper

# Filter by active status
GET /admin/users?isActive=true
```

### Get Pending Helpers
```http
GET /admin/helpers/pending
Authorization: Bearer ADMIN_TOKEN
```

### Approve Helper
```http
PUT /admin/helpers/HELPER_PROFILE_ID/approve
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "isApproved": true
}
```

### Get All Tasks
```http
GET /admin/tasks
Authorization: Bearer ADMIN_TOKEN

# Filter by status
GET /admin/tasks?status=completed

# Filter by category
GET /admin/tasks?category=pickup_drop
```

### Get Analytics
```http
GET /admin/analytics
Authorization: Bearer ADMIN_TOKEN
```

### Update User Status
```http
PUT /admin/users/USER_ID/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "isActive": false,
  "isVerified": true
}
```

## Testing Workflow

### Complete Flow Test

1. **Register 3 users:**
   - 1 Customer
   - 1 Helper
   - 1 Admin (manually set role in DB)

2. **As Admin:**
   - Login
   - Approve the helper

3. **As Helper:**
   - Login
   - Update profile with categories
   - Toggle online

4. **As Customer:**
   - Login
   - Get price estimate
   - Create a task

5. **As Helper:**
   - View available tasks
   - Accept the task
   - Update status to "in_progress"
   - Update status to "completed"

6. **As Customer:**
   - View completed task
   - Rate the helper

7. **As Admin:**
   - View analytics
   - Check all tasks
   - View user statistics

## Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Tips

1. Save tokens after login for reuse
2. Use environment variables in Postman for base URL and tokens
3. Check response data structure
4. Verify error messages are clear
5. Test edge cases (invalid IDs, missing fields, etc.)

---

Happy Testing! 🚀

