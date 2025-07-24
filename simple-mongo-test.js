const mongoose = require('mongoose');

// Simple MongoDB test
async function testMongo() {
  console.log('🔍 Simple MongoDB Test\n');
  
  // Test different connection strings
  const testConnections = [
    {
      name: 'Original User',
      uri: 'mongodb+srv://hosvile3031:QefZTuZ1adjzeZAQD@cluster0.bpmsg69.mongodb.net/carpool?retryWrites=true&w=majority'
    },
    {
      name: 'Simple Test',
      uri: 'mongodb+srv://hosvile3031:QefZTuZ1adjzeZAQD@cluster0.bpmsg69.mongodb.net/?retryWrites=true&w=majority'  
    }
  ];
  
  for (const test of testConnections) {
    console.log(`🧪 Testing: ${test.name}`);
    
    try {
      await mongoose.connect(test.uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      
      console.log('✅ Connection successful!');
      await mongoose.connection.close();
      console.log('✅ Connection closed\n');
      
      // If this one works, use it!
      console.log('🎉 Working connection string:');
      console.log(test.uri);
      return test.uri;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
      
      // Close any open connections
      try {
        await mongoose.connection.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  }
  
  console.log('🚨 All tests failed. Please check:');
  console.log('   1. MongoDB Atlas username and password');
  console.log('   2. Database user exists and has permissions');
  console.log('   3. Network access allows your IP (try 0.0.0.0/0)');
  console.log('   4. Cluster is running and accessible');
  
  return null;
}

testMongo();
