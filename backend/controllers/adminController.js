import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import HelperProfile from '../models/HelperProfile.js';
import Task from '../models/Task.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, isActive } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const users = await User.find(filter)
    .select('-password')
    .populate('helperProfile')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('helperProfile');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive, isVerified } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (isActive !== undefined) user.isActive = isActive;
  if (isVerified !== undefined) user.isVerified = isVerified;

  await user.save();

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete helper profile if exists
  if (user.helperProfile) {
    await HelperProfile.findByIdAndDelete(user.helperProfile);
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Get all helpers pending approval
// @route   GET /api/admin/helpers/pending
// @access  Private (Admin)
export const getPendingHelpers = asyncHandler(async (req, res) => {
  const helpers = await HelperProfile.find({ isApproved: false })
    .populate('user', 'name email phone createdAt')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: helpers.length,
    data: helpers,
  });
});

// @desc    Approve/Reject helper
// @route   PUT /api/admin/helpers/:id/approve
// @access  Private (Admin)
export const approveHelper = asyncHandler(async (req, res) => {
  const { isApproved } = req.body;
  const helperProfile = await HelperProfile.findById(req.params.id);

  if (!helperProfile) {
    res.status(404);
    throw new Error('Helper profile not found');
  }

  helperProfile.isApproved = isApproved;
  await helperProfile.save();

  // Update user verification status
  await User.findByIdAndUpdate(helperProfile.user, { isVerified: isApproved });

  res.json({
    success: true,
    data: helperProfile,
  });
});

// @desc    Get all tasks
// @route   GET /api/admin/tasks
// @access  Private (Admin)
export const getAllTasks = asyncHandler(async (req, res) => {
  const { status, category } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const tasks = await Task.find(filter)
    .populate('customer', 'name email phone')
    .populate('helper', 'name email phone')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Get analytics/dashboard data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = asyncHandler(async (req, res) => {
  // Get counts
  const totalUsers = await User.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalHelpers = await User.countDocuments({ role: 'helper' });
  const activeHelpers = await HelperProfile.countDocuments({ isOnline: true });
  const pendingApprovals = await HelperProfile.countDocuments({ isApproved: false });

  // Task statistics
  const totalTasks = await Task.countDocuments();
  const pendingTasks = await Task.countDocuments({ status: 'pending' });
  const completedTasks = await Task.countDocuments({ status: 'completed' });
  const cancelledTasks = await Task.countDocuments({ status: 'cancelled' });

  // Revenue calculation
  const completedTasksData = await Task.find({ status: 'completed' });
  const totalRevenue = completedTasksData.reduce(
    (sum, task) => sum + (task.finalPrice || task.estimatedPrice),
    0
  );

  // Category-wise task distribution
  const tasksByCategory = await Task.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  // Recent tasks
  const recentTasks = await Task.find()
    .populate('customer', 'name')
    .populate('helper', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        customers: totalCustomers,
        helpers: totalHelpers,
        activeHelpers,
        pendingApprovals,
      },
      tasks: {
        total: totalTasks,
        pending: pendingTasks,
        completed: completedTasks,
        cancelled: cancelledTasks,
        byCategory: tasksByCategory,
      },
      revenue: {
        total: totalRevenue,
        average: totalTasks > 0 ? totalRevenue / completedTasks : 0,
      },
      recentTasks,
    },
  });
});

// @desc    Update task (admin override)
// @route   PUT /api/admin/tasks/:id
// @access  Private (Admin)
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { status, helper, finalPrice } = req.body;

  if (status) task.status = status;
  if (helper) task.helper = helper;
  if (finalPrice) task.finalPrice = finalPrice;

  await task.save();

  res.json({
    success: true,
    data: task,
  });
});

