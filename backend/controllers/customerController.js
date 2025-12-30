import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import User from '../models/User.js';
import HelperProfile from '../models/HelperProfile.js';
import { calculatePrice, calculateDistance } from '../utils/priceCalculator.js';

// @desc    Create a new task
// @route   POST /api/customer/tasks
// @access  Private (Customer)
export const createTask = asyncHandler(async (req, res) => {
  const {
    category,
    title,
    description,
    pickupLocation,
    dropLocation,
    scheduledTime,
  } = req.body;

  // Validation
  if (!category || !title || !description || !scheduledTime) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Calculate distance if both locations provided
  let distance = 0;
  if (
    pickupLocation?.coordinates &&
    dropLocation?.coordinates
  ) {
    distance = calculateDistance(
      pickupLocation.coordinates.latitude,
      pickupLocation.coordinates.longitude,
      dropLocation.coordinates.latitude,
      dropLocation.coordinates.longitude
    );
  }

  // Calculate estimated price
  const priceBreakdown = calculatePrice(category, distance);

  // Create task
  const task = await Task.create({
    customer: req.user._id,
    category,
    title,
    description,
    pickupLocation,
    dropLocation,
    scheduledTime,
    estimatedPrice: priceBreakdown.totalPrice,
  });

  res.status(201).json({
    success: true,
    data: task,
    priceBreakdown,
  });
});

// @desc    Get price estimation
// @route   POST /api/customer/estimate-price
// @access  Private (Customer)
export const estimatePrice = asyncHandler(async (req, res) => {
  const { category, pickupLocation, dropLocation, additionalParams } = req.body;

  if (!category) {
    res.status(400);
    throw new Error('Please provide category');
  }

  let distance = 0;
  if (pickupLocation?.coordinates && dropLocation?.coordinates) {
    distance = calculateDistance(
      pickupLocation.coordinates.latitude,
      pickupLocation.coordinates.longitude,
      dropLocation.coordinates.latitude,
      dropLocation.coordinates.longitude
    );
  }

  const priceBreakdown = calculatePrice(category, distance, additionalParams);

  res.json({
    success: true,
    data: {
      distance: distance.toFixed(2),
      ...priceBreakdown,
    },
  });
});

// @desc    Get all tasks for customer
// @route   GET /api/customer/tasks
// @access  Private (Customer)
export const getMyTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = { customer: req.user._id };
  if (status) {
    filter.status = status;
  }

  const tasks = await Task.find(filter)
    .populate('helper', 'name phone email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/customer/tasks/:id
// @access  Private (Customer)
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('customer', 'name phone email')
    .populate('helper', 'name phone email');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user is authorized
  if (task.customer._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.json({
    success: true,
    data: task,
  });
});

// @desc    Cancel a task
// @route   PUT /api/customer/tasks/:id/cancel
// @access  Private (Customer)
export const cancelTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (['completed', 'cancelled'].includes(task.status)) {
    res.status(400);
    throw new Error('Cannot cancel this task');
  }

  task.status = 'cancelled';
  task.cancellationReason = req.body.reason || 'Cancelled by customer';
  await task.save();

  res.json({
    success: true,
    data: task,
  });
});

// @desc    Rate a helper after task completion
// @route   PUT /api/customer/tasks/:id/rate
// @access  Private (Customer)
export const rateHelper = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (task.status !== 'completed') {
    res.status(400);
    throw new Error('Can only rate completed tasks');
  }

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  task.customerRating = { rating, review };
  await task.save();

  // Update helper's rating
  if (task.helper) {
    const helperProfile = await HelperProfile.findOne({ user: task.helper });
    if (helperProfile) {
      const totalRatings = helperProfile.totalRatings + 1;
      const newRating =
        (helperProfile.rating * helperProfile.totalRatings + rating) /
        totalRatings;
      helperProfile.rating = newRating;
      helperProfile.totalRatings = totalRatings;
      await helperProfile.save();
    }
  }

  res.json({
    success: true,
    data: task,
  });
});

