import express from 'express';
import {
  getHelperProfile,
  updateHelperProfile,
  toggleOnlineStatus,
  getAvailableTasks,
  getMyTasks,
  acceptTask,
  rejectTask,
  updateTaskStatus,
  getEarnings,
} from '../controllers/helperController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and only for helpers
router.use(protect);
router.use(authorize('helper'));

router.get('/profile', getHelperProfile);
router.put('/profile', updateHelperProfile);
router.put('/toggle-status', toggleOnlineStatus);
router.get('/available-tasks', getAvailableTasks);
router.get('/my-tasks', getMyTasks);
router.put('/tasks/:id/accept', acceptTask);
router.put('/tasks/:id/reject', rejectTask);
router.put('/tasks/:id/status', updateTaskStatus);
router.get('/earnings', getEarnings);

export default router;

