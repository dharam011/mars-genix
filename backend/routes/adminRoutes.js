import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUserStatus,
  deleteUser,
  getPendingHelpers,
  approveHelper,
  getAllTasks,
  getAnalytics,
  updateTask,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and only for admins
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Helper management
router.get('/helpers/pending', getPendingHelpers);
router.put('/helpers/:id/approve', approveHelper);

// Task management
router.get('/tasks', getAllTasks);
router.put('/tasks/:id', updateTask);

// Analytics
router.get('/analytics', getAnalytics);

export default router;

