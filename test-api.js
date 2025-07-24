const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🚀 Testing Carpool Backend API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test 2: Register a new user
    console.log('2. Testing user registration...');
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: `test${Date.now()}@example.com`,
      phone: `0801234${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
      password: 'password123',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: {
        street: '123 Test Street',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria'
      }
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    console.log('✅ User registered:', {
      success: registerResponse.data.success,
      message: registerResponse.data.message,
      userId: registerResponse.data.user._id,
      email: registerResponse.data.user.email
    });
    
    const token = registerResponse.data.token;
    const userId = registerResponse.data.user._id;
    console.log('');

    // Test 3: Login
    console.log('3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    console.log('✅ User logged in:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message
    });
    console.log('');

    // Test 4: Get user profile
    console.log('4. Testing get profile...');
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', {
      success: profileResponse.data.success,
      name: profileResponse.data.user.fullName,
      email: profileResponse.data.user.email
    });
    console.log('');

    // Test 5: Register as driver
    console.log('5. Testing driver registration...');
    const driverData = {
      licenseNumber: `DL${Date.now()}`,
      vehicle: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        licensePlate: `ABC-${Math.floor(Math.random() * 1000)}`,
        color: 'White'
      }
    };

    const driverResponse = await axios.post(`${BASE_URL}/api/driver/register`, driverData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Driver registered:', {
      success: driverResponse.data.success,
      message: driverResponse.data.message,
      vehicle: driverResponse.data.driver.vehicle.make + ' ' + driverResponse.data.driver.vehicle.model
    });
    console.log('');

    // Test 6: Get driver profile
    console.log('6. Testing get driver profile...');
    const driverProfileResponse = await axios.get(`${BASE_URL}/api/driver/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Driver profile retrieved:', {
      success: driverProfileResponse.data.success,
      licenseNumber: driverProfileResponse.data.driver.licenseNumber,
      isVerified: driverProfileResponse.data.driver.isVerified
    });
    console.log('');

    console.log('🎉 All tests passed successfully!');
    console.log('\n📝 API is ready for use. You can now:');
    console.log('- Use Postman to test more endpoints');
    console.log('- Integrate with your Paystack and Google Maps keys');
    console.log('- Build your frontend application');

  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    console.log('\n🔧 Make sure:');
    console.log('- MongoDB is running');
    console.log('- Server is running on port 3000');
    console.log('- All environment variables are set correctly');
  }
}

// Run the tests
testAPI();
