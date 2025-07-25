const axios = require('axios');
require('dotenv').config();

// Test both local and production
const SERVERS = [
  { name: 'Local', url: 'http://localhost:3001' },
  { name: 'Render', url: 'https://carpool-backend1-3.onrender.com' }
];

async function testServer(server) {
  console.log(`\n🧪 Testing ${server.name} server: ${server.url}`);
  
  try {
    // Health check
    const health = await axios.get(`${server.url}/health`, { timeout: 5000 });
    console.log(`✅ ${server.name} health check passed`);
    
    // Try registration
    const testUser = {
      firstName: 'Debug',
      lastName: 'Test',
      email: `debug${Date.now()}@test.com`,
      phone: '1234567890',
      password: 'password123',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    };
    
    const registerResponse = await axios.post(`${server.url}/api/auth/register`, testUser, { timeout: 10000 });
    console.log(`✅ ${server.name} registration successful`);
    
    // Try login
    const loginResponse = await axios.post(`${server.url}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, { timeout: 10000 });
    
    console.log(`✅ ${server.name} login successful`);
    console.log(`🎉 ${server.name} server is working perfectly!`);
    
  } catch (error) {
    console.log(`❌ ${server.name} server error:`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`   Server is not running on ${server.url}`);
    } else if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.message || 'Unknown error'}`);
      console.log(`   Full response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log('🔍 Starting server error diagnosis...');
  
  for (const server of SERVERS) {
    await testServer(server);
  }
  
  console.log('\n📋 Summary:');
  console.log('- If local server works: The issue is with Render deployment');
  console.log('- If local server fails: The issue is with the code/database');
  console.log('- Check your Render logs for specific error messages');
}

runTests();
