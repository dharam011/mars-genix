import express from 'express';
import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get task by ID (accessible by customer, helper, or admin)
// @route   GET /api/tasks/:id
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('helper', 'name email phone');

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check authorization
    const isCustomer = task.customer._id.toString() === req.user._id.toString();
    const isHelper = task.helper && task.helper._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isHelper && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this task');
    }

    res.json({
      success: true,
      data: task,
    });
  })
);

export default router;

