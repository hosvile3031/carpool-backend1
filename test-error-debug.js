const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3001';

async function debugServerError() {
  console.log('🔍 Debugging Server Errors...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  try {
    // Test 2: Test with minimal valid data
    console.log('\n2. Testing minimal registration...');
    const minimalUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `minimal${Date.now()}@test.com`,
      phone: '1234567890',
      password: 'password123',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    };

    const response = await axios.post(`${BASE_URL}/api/auth/register`, minimalUser);
    console.log('✅ Registration successful!');
    
    // Test login immediately
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: minimalUser.email,
      password: minimalUser.password
    });
    console.log('✅ Login successful!');
    
  } catch (error) {
    console.log('❌ Server error detected:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('Full Error:', error.message);
    
    // Check if it's a database connection issue
    if (error.response?.data?.message?.includes('database') || 
        error.response?.data?.message?.includes('connection') ||
        error.response?.status === 500) {
      console.log('\n🔍 This appears to be a database connection issue.');
      console.log('Checking MongoDB connection...');
      
      // Test MongoDB connection directly
      try {
        const mongoose = require('mongoose');
        await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('✅ Direct MongoDB connection successful');
        await mongoose.disconnect();
      } catch (dbError) {
        console.log('❌ Direct MongoDB connection failed:', dbError.message);
      }
    }
  }
}

// Test with a running server
console.log('Waiting for server to be ready...');
setTimeout(debugServerError, 3000);
