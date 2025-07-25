const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3001';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Register a new user
  try {
    console.log('\n2. Testing user registration...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      phone: `+1234567890`,
      password: 'password123',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
    console.log('✅ Registration successful:', {
      success: registerResponse.data.success,
      message: registerResponse.data.message,
      hasToken: !!registerResponse.data.token,
      userId: registerResponse.data.user?._id
    });

    // Test 3: Login with the registered user
    console.log('\n3. Testing user login...');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };

    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log('✅ Login successful:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.token,
      userId: loginResponse.data.user?._id
    });

  } catch (error) {
    console.log('❌ Auth test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Start server first, then test
console.log('Starting server for testing...');
const { spawn } = require('child_process');

const server = spawn('node', ['server.js'], {
  stdio: 'pipe',
  env: { ...process.env }
});

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('Server is running') || output.includes('Connected to MongoDB')) {
    // Wait a bit for server to fully start
    setTimeout(() => {
      testAuth().finally(() => {
        server.kill();
        process.exit(0);
      });
    }, 2000);
  }
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

// Cleanup
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});
