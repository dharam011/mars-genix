import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
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
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide task description'],
    },
    pickupLocation: {
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    dropLocation: {
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    estimatedPrice: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'assigned',
        'accepted',
        'in_progress',
        'completed',
        'cancelled',
        'rejected',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    customerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
    },
    helperRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
    },
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add status to history before saving
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;

