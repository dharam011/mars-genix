import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import HelperProfile from '../models/HelperProfile.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Validation
  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email or phone');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || 'customer',
  });

  // If role is helper, create helper profile
  if (user.role === 'helper') {
    const helperProfile = await HelperProfile.create({
      user: user._id,
    });
    user.helperProfile = helperProfile._id;
    await user.save();
  }

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Your account has been deactivated');
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('helperProfile');

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.address) {
      user.address = req.body.address;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        address: updatedUser.address,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

