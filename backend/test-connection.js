import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connecting to:', process.env.MONGO_URI.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testConnection();

