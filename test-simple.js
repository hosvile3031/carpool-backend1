// Simple test to run while server is running
const axios = require('axios');

async function testAuth() {
  console.log('Testing authentication...\n');
  
  const testUser = {
    firstName: 'Simple',
    lastName: 'Test',
    email: `simple${Date.now()}@test.com`,
    phone: '1234567890',
    password: 'password123',
    dateOfBirth: '1990-01-01',
    gender: 'male'
  };

  try {
    console.log('1. Testing registration...');
    const response = await axios.post('http://localhost:3001/api/auth/register', testUser);
    console.log('✅ Registration SUCCESS:', response.data.message);
    
    console.log('2. Testing login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login SUCCESS:', loginResponse.data.message);
    console.log('🎉 Authentication is working perfectly!');
    
  } catch (error) {
    console.log('❌ ERROR DETAILS:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Full Error:', JSON.stringify(error.response?.data, null, 2));
  }
}

testAuth();
