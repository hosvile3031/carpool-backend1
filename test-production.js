const axios = require('axios');

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://carpool-backend1-1.onrender.com';

async function testProductionDeployment() {
  console.log('🧪 Testing Production Deployment...\n');
  console.log(`🌐 Testing URL: ${PRODUCTION_URL}\n`);
  
  const tests = [
    {
      name: 'Health Check',
      url: `${PRODUCTION_URL}/health`,
      method: 'GET',
      expected: 'status should be OK',
      critical: true
    },
    {
      name: 'API Documentation',
      url: `${PRODUCTION_URL}/api`,
      method: 'GET',
      expected: 'should return API info',
      critical: true
    },
    {
      name: 'Registration Endpoint',
      url: `${PRODUCTION_URL}/api/auth/register`,
      method: 'POST',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        phone: '+1234567890',
        password: 'password123',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      },
      expected: 'should create user or return validation error',
      critical: true
    },
    {
      name: 'Login Endpoint',
      url: `${PRODUCTION_URL}/api/auth/login`,
      method: 'POST',
      data: {
        email: 'test@example.com',
        password: 'password123'
      },
      expected: 'should return authentication response',
      critical: true
    },
    {
      name: 'Rides Endpoint',
      url: `${PRODUCTION_URL}/api/rides`,
      method: 'GET',
      expected: 'should return rides data',
      critical: false
    },
    {
      name: 'Static Files (Frontend)',
      url: `${PRODUCTION_URL}/`,
      method: 'GET',
      expected: 'should serve frontend or return HTML',
      critical: false
    }
  ];

  let passed = 0;
  let failed = 0;
  let criticalFailed = 0;
  const results = [];

  console.log('Running tests...\n');

  for (const test of tests) {
    try {
      const startTime = Date.now();
      const response = await axios({
        method: test.method,
        url: test.url,
        data: test.data,
        timeout: 15000,
        validateStatus: () => true // Don't throw on non-2xx status codes
      });
      const responseTime = Date.now() - startTime;

      const result = {
        name: test.name,
        status: 'PASSED',
        httpStatus: response.status,
        responseTime: `${responseTime}ms`,
        data: response.data
      };

      // Check if response is what we expect
      if (response.status >= 200 && response.status < 500) {
        console.log(`✅ ${test.name}: PASSED (${response.status}) - ${responseTime}ms`);
        
        // Additional validation for specific endpoints
        if (test.name === 'Health Check' && response.data) {
          if (response.data.status === 'OK') {
            console.log(`   💚 Health status: ${response.data.status}`);
            if (response.data.message && response.data.message.includes('Demo Mode')) {
              console.log(`   ⚠️  Warning: Still running in Demo Mode`);
              result.warning = 'Running in Demo Mode';
            }
          } else {
            console.log(`   ⚠️  Health status: ${response.data.status}`);
          }
          
          if (response.data.checks) {
            console.log(`   📊 Database: ${response.data.checks.database?.status || 'Unknown'}`);
          }
        }
        
        if (test.name === 'Registration Endpoint') {
          if (response.data.success === false && response.data.message) {
            console.log(`   📝 Registration response: ${response.data.message}`);
          }
        }
        
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED (${response.status})`);
        if (response.data && response.data.message) {
          console.log(`   📝 Error: ${response.data.message}`);
        }
        result.status = 'FAILED';
        result.error = response.data?.message || 'HTTP error';
        failed++;
        
        if (test.critical) {
          criticalFailed++;
        }
      }
      
      results.push(result);
      
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED (${error.code || error.message})`);
      
      const result = {
        name: test.name,
        status: 'FAILED',
        error: error.message,
        responseTime: 'N/A'
      };
      
      if (error.code === 'ENOTFOUND') {
        console.log(`   📝 DNS Error: Cannot resolve ${PRODUCTION_URL}`);
        result.error = 'DNS resolution failed';
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`   📝 Connection Error: Server is not responding`);
        result.error = 'Connection refused';
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`   📝 Timeout Error: Server took too long to respond`);
        result.error = 'Request timeout';
      }
      
      results.push(result);
      failed++;
      
      if (test.critical) {
        criticalFailed++;
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Test Results Summary:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   🚨 Critical Failed: ${criticalFailed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  // Detailed analysis
  console.log('\n🔍 Detailed Analysis:');
  
  if (criticalFailed === 0) {
    console.log('🎉 All critical tests passed! Your deployment is healthy.');
  } else {
    console.log('🚨 Critical tests failed! Your deployment needs attention.');
  }
  
  // Check for common issues
  const healthResult = results.find(r => r.name === 'Health Check');
  if (healthResult) {
    if (healthResult.status === 'PASSED') {
      if (healthResult.warning) {
        console.log('\n⚠️  Issues detected:');
        console.log(`   - ${healthResult.warning}`);
        console.log('   💡 Fix: Update your deployment to use production mode (server.js instead of demo-server.js)');
      }
      
      // Check database connectivity
      if (healthResult.data?.checks?.database?.status === 'disconnected') {
        console.log('\n🚨 Database Issues:');
        console.log('   - Database is not connected');
        console.log('   💡 Fix: Check your MONGODB_URI environment variable');
      }
    } else {
      console.log('\n🚨 Critical Issue: Health check failed');
      console.log('   💡 Your application may not be running or accessible');
    }
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  
  if (criticalFailed > 0) {
    console.log('   1. Check deployment logs for errors');
    console.log('   2. Verify all environment variables are set');
    console.log('   3. Ensure your deployment platform is properly configured');
  }
  
  if (failed > criticalFailed) {
    console.log('   1. Some non-critical features may not be working');
    console.log('   2. Check API keys for external services (Paystack, Google Maps)');
  }
  
  if (passed === tests.length) {
    console.log('   🎉 Everything looks good! Your deployment is fully functional.');
  }

  console.log(`\n🌐 Access your application at: ${PRODUCTION_URL}`);
  
  return {
    totalTests: tests.length,
    passed,
    failed,
    criticalFailed,
    results,
    isHealthy: criticalFailed === 0
  };
}

// Test specific functionality
async function testAuthentication() {
  console.log('🔐 Testing Authentication Flow...\n');
  
  try {
    // Test registration
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test-auth-${Date.now()}@example.com`,
      phone: '+1234567890',
      password: 'password123',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    };
    
    const registerResponse = await axios.post(`${PRODUCTION_URL}/api/auth/register`, registerData);
    
    if (registerResponse.data.success) {
      console.log('✅ Registration: Working');
      
      // Test login
      const loginResponse = await axios.post(`${PRODUCTION_URL}/api/auth/login`, {
        email: registerData.email,
        password: registerData.password
      });
      
      if (loginResponse.data.success && loginResponse.data.token) {
        console.log('✅ Login: Working');
        console.log('✅ JWT Token: Generated');
        
        // Test protected route
        const profileResponse = await axios.get(`${PRODUCTION_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${loginResponse.data.token}`
          }
        });
        
        if (profileResponse.data.success) {
          console.log('✅ Protected Routes: Working');
          console.log('🎉 Authentication flow is fully functional!');
        } else {
          console.log('⚠️  Protected Routes: Issues detected');
        }
      } else {
        console.log('❌ Login: Failed');
      }
    } else {
      console.log('❌ Registration: Failed');
      console.log(`   Error: ${registerResponse.data.message}`);
    }
  } catch (error) {
    console.log('❌ Authentication test failed:', error.response?.data?.message || error.message);
  }
}

// Main execution
if (require.main === module) {
  (async () => {
    // Allow custom URL via environment variable or command line
    if (process.argv[2]) {
      const customUrl = process.argv[2];
      if (customUrl.startsWith('http')) {
        console.log(`🌐 Using custom URL: ${customUrl}`);
        process.env.PRODUCTION_URL = customUrl;
      }
    }
    
    const result = await testProductionDeployment();
    
    // Run authentication test if basic tests pass
    if (result.isHealthy && process.argv.includes('--auth')) {
      console.log('\n' + '='.repeat(60));
      await testAuthentication();
    }
    
    // Exit with appropriate code
    process.exit(result.isHealthy ? 0 : 1);
  })();
}

module.exports = { testProductionDeployment, testAuthentication };
