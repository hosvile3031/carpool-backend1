const axios = require('axios');

// Replace with your actual live URL
const LIVE_URL = 'https://carpool-backend1-1.onrender.com'; // Updated with actual URL

async function testLiveAPI() {
  console.log('🧪 Testing Live API Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${LIVE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  try {
    // Test 2: API root
    console.log('\n2. Testing API root...');
    const apiResponse = await axios.get(`${LIVE_URL}/api`);
    console.log('✅ API root:', apiResponse.data);
  } catch (error) {
    console.log('❌ API root failed:', error.message);
  }

  try {
    // Test 3: Registration (this will likely fail due to missing MongoDB)
    console.log('\n3. Testing registration...');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      password: 'password123',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    };
    
    const registerResponse = await axios.post(`${LIVE_URL}/api/auth/register`, testUser);
    console.log('✅ Registration:', registerResponse.data);
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data || error.message);
    
    // Check if it's a database connection error
    if (error.response?.status === 500) {
      console.log('🔍 This likely indicates a database connection issue');
    }
  }

  console.log('\n📋 Diagnosis complete!');
}

// Usage: node test-live-api.js
if (require.main === module) {
  // Update the LIVE_URL before running
  if (LIVE_URL === 'https://your-app-domain.com') {
    console.log('❌ Please update LIVE_URL with your actual deployment URL');
    console.log('Example: const LIVE_URL = "https://your-app.onrender.com";');
    process.exit(1);
  }
  
  testLiveAPI();
}

module.exports = { testLiveAPI };
