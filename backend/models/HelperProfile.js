import mongoose from 'mongoose';

const helperProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: [
      {
        type: String,
        enum: [
          'pickup_drop',
          'delivery',
          'home_service',
          'repair',
          'cleaning',
          'moving',
          'other',
        ],
      },
    ],
    experience: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    documents: {
      idProof: {
        type: String,
      },
      addressProof: {
        type: String,
      },
      photo: {
        type: String,
      },
    },
    earnings: {
      total: {
        type: Number,
        default: 0,
      },
      pending: {
        type: Number,
        default: 0,
      },
      withdrawn: {
        type: Number,
        default: 0,
      },
    },
    availability: {
      type: String,
      enum: ['full_time', 'part_time', 'weekends'],
      default: 'full_time',
    },
    vehicleType: {
      type: String,
      enum: ['bike', 'car', 'van', 'none'],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

const HelperProfile = mongoose.model('HelperProfile', helperProfileSchema);

export default HelperProfile;

