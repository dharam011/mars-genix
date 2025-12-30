import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import HelperProfile from '../models/HelperProfile.js';
import User from '../models/User.js';

// @desc    Get helper profile
// @route   GET /api/helper/profile
// @access  Private (Helper)
export const getHelperProfile = asyncHandler(async (req, res) => {
  const helperProfile = await HelperProfile.findOne({
    user: req.user._id,
  }).populate('user', 'name email phone');

  if (!helperProfile) {
    res.status(404);
    throw new Error('Helper profile not found');
  }

  res.json({
    success: true,
    data: helperProfile,
  });
});

// @desc    Update helper profile
// @route   PUT /api/helper/profile
// @access  Private (Helper)
export const updateHelperProfile = asyncHandler(async (req, res) => {
  const helperProfile = await HelperProfile.findOne({ user: req.user._id });

  if (!helperProfile) {
    res.status(404);
    throw new Error('Helper profile not found');
  }

  const {
    categories,
    experience,
    availability,
    vehicleType,
    documents,
  } = req.body;

  if (categories) helperProfile.categories = categories;
  if (experience !== undefined) helperProfile.experience = experience;
  if (availability) helperProfile.availability = availability;
  if (vehicleType) helperProfile.vehicleType = vehicleType;
  if (documents) helperProfile.documents = { ...helperProfile.documents, ...documents };

  await helperProfile.save();

  res.json({
    success: true,
    data: helperProfile,
  });
});

// @desc    Toggle online/offline status
// @route   PUT /api/helper/toggle-status
// @access  Private (Helper)
export const toggleOnlineStatus = asyncHandler(async (req, res) => {
  const helperProfile = await HelperProfile.findOne({ user: req.user._id });

  if (!helperProfile) {
    res.status(404);
    throw new Error('Helper profile not found');
  }

  if (!helperProfile.isApproved) {
    res.status(403);
    throw new Error('Your profile is not approved yet');
  }

  helperProfile.isOnline = !helperProfile.isOnline;
  await helperProfile.save();

  res.json({
    success: true,
    data: {
      isOnline: helperProfile.isOnline,
    },
  });
});

// @desc    Get available tasks for helper
// @route   GET /api/helper/available-tasks
// @access  Private (Helper)
export const getAvailableTasks = asyncHandler(async (req, res) => {
  const helperProfile = await HelperProfile.findOne({ user: req.user._id });

  if (!helperProfile || !helperProfile.isApproved) {
    res.status(403);
    throw new Error('Helper profile not approved');
  }

  // Find tasks that match helper's categories and are pending
  const tasks = await Task.find({
    status: 'pending',
    category: { $in: helperProfile.categories },
  })
    .populate('customer', 'name phone address')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Get helper's assigned tasks
// @route   GET /api/helper/my-tasks
// @access  Private (Helper)
export const getMyTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = { helper: req.user._id };
  if (status) {
    filter.status = status;
  }

  const tasks = await Task.find(filter)
    .populate('customer', 'name phone address')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Accept a task
// @route   PUT /api/helper/tasks/:id/accept
// @access  Private (Helper)
export const acceptTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.status !== 'pending') {
    res.status(400);
    throw new Error('Task is not available');
  }

  const helperProfile = await HelperProfile.findOne({ user: req.user._id });

  if (!helperProfile || !helperProfile.isApproved) {
    res.status(403);
    throw new Error('Helper profile not approved');
  }

  if (!helperProfile.isOnline) {
    res.status(400);
    throw new Error('You must be online to accept tasks');
  }

  task.helper = req.user._id;
  task.status = 'accepted';
  await task.save();

  res.json({
    success: true,
    data: task,
  });
});

// @desc    Reject a task
// @route   PUT /api/helper/tasks/:id/reject
// @access  Private (Helper)
export const rejectTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.status !== 'pending') {
    res.status(400);
    throw new Error('Can only reject pending tasks');
  }

  task.status = 'rejected';
  await task.save();

  res.json({
    success: true,
    data: task,
  });
});

// @desc    Update task status
// @route   PUT /api/helper/tasks/:id/status
// @access  Private (Helper)
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.helper.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const allowedStatuses = ['in_progress', 'completed'];
  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  task.status = status;

  if (status === 'completed') {
    task.finalPrice = task.estimatedPrice;

    // Update helper's completed tasks and earnings
    const helperProfile = await HelperProfile.findOne({ user: req.user._id });
    if (helperProfile) {
      helperProfile.completedTasks += 1;
      helperProfile.earnings.total += task.finalPrice;
      helperProfile.earnings.pending += task.finalPrice;
      await helperProfile.save();
    }
  }

  if (note) {
    task.statusHistory[task.statusHistory.length - 1].note = note;
  }

  await task.save();

  res.json({
    success: true,
    data: task,
  });
});

// @desc    Get helper earnings
// @route   GET /api/helper/earnings
// @access  Private (Helper)
export const getEarnings = asyncHandler(async (req, res) => {
  const helperProfile = await HelperProfile.findOne({ user: req.user._id });

  if (!helperProfile) {
    res.status(404);
    throw new Error('Helper profile not found');
  }

  // Get completed tasks for detailed breakdown
  const completedTasks = await Task.find({
    helper: req.user._id,
    status: 'completed',
  }).select('finalPrice createdAt category');

  res.json({
    success: true,
    data: {
      earnings: helperProfile.earnings,
      completedTasks: helperProfile.completedTasks,
      rating: helperProfile.rating,
      totalRatings: helperProfile.totalRatings,
      recentTasks: completedTasks.slice(0, 10),
    },
  });
});

