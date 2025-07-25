const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3001';

async function testLogin() {
  try {
    console.log('🧪 Testing Login with existing user...\n');

    // First, create a unique test user
    const timestamp = Date.now();
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `testuser${timestamp}@example.com`,
      phone: `+123456789${timestamp.toString().slice(-1)}`,
      password: 'password123',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    };

    console.log('1. Registering test user...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    console.log('✅ Registration successful:', registerResponse.data.message);

    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });

    console.log('✅ Login successful!');
    console.log('Response:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.token,
      userEmail: loginResponse.data.user?.email
    });

    console.log('\n🎉 Authentication is working perfectly!');

  } catch (error) {
    console.log('❌ Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
