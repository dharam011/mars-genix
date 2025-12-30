// Quick script to create an admin user
const axios = require('axios');

const createAdmin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Admin User',
      email: 'admin@marsgenix.com',
      phone: '1111111111',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Email: admin@marsgenix.com');
    console.log('Password: admin123');
    console.log('\n🌐 Login at: http://localhost:5174/login');
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  Admin user already exists!');
      console.log('\n📧 Login Credentials:');
      console.log('Email: admin@marsgenix.com');
      console.log('Password: admin123');
      console.log('\n🌐 Login at: http://localhost:5174/login');
    } else {
      console.error('❌ Error:', error.response?.data?.message || error.message);
    }
  }
};

createAdmin();

