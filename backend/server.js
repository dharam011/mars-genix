import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import helperRoutes from './routes/helperRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MarsGenix API is running...' });
});

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/helper', helperRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

