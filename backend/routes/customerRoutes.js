import express from 'express';
import {
  createTask,
  estimatePrice,
  getMyTasks,
  getTask,
  cancelTask,
  rateHelper,
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and only for customers
router.use(protect);
router.use(authorize('customer'));

router.post('/tasks', createTask);
router.post('/estimate-price', estimatePrice);
router.get('/tasks', getMyTasks);
router.get('/tasks/:id', getTask);
router.put('/tasks/:id/cancel', cancelTask);
router.put('/tasks/:id/rate', rateHelper);

export default router;

