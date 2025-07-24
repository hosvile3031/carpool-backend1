const mongoose = require('mongoose');

// Test MongoDB connection
async function testMongoConnection() {
  console.log('🧪 Testing MongoDB Atlas Connection...\n');
  
  // Get connection string from environment or command line
  const mongoUri = process.env.MONGODB_URI || process.argv[2];
  
  if (!mongoUri) {
    console.log('❌ No MongoDB URI provided');
    console.log('💡 Usage: node test-mongodb-connection.js "your-connection-string"');
    console.log('💡 Or set MONGODB_URI environment variable');
    process.exit(1);
  }
  
  console.log('🔍 Connection string format check:');
  
  // Basic format validation
  if (mongoUri.startsWith('mongodb+srv://')) {
    console.log('✅ Protocol: mongodb+srv:// (correct)');
  } else if (mongoUri.startsWith('mongodb://')) {
    console.log('⚠️  Protocol: mongodb:// (works but mongodb+srv:// is recommended)');
  } else {
    console.log('❌ Protocol: invalid (should start with mongodb:// or mongodb+srv://)');
    process.exit(1);
  }
  
  if (mongoUri.includes('<db_password>')) {
    console.log('❌ Password: Still contains <db_password> placeholder');
    console.log('💡 Replace <db_password> with your actual MongoDB Atlas password');
    process.exit(1);
  } else {
    console.log('✅ Password: Appears to be set');
  }
  
  if (mongoUri.includes('/carpool?') || mongoUri.endsWith('/carpool')) {
    console.log('✅ Database: carpool database specified');
  } else {
    console.log('⚠️  Database: No database name specified (will use default)');
    console.log('💡 Add /carpool before the ? in your connection string');
  }
  
  console.log('\n🔗 Attempting connection...');
  
  try {
    // Set connection timeout
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000,
    };
    
    await mongoose.connect(mongoUri, options);
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    console.log('\n📊 Testing database operations...');
    
    // Ping the database
    await mongoose.connection.db.admin().ping();
    console.log('✅ Database ping successful');
    
    // List collections (will be empty for new database)
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Collections found: ${collections.length}`);
    
    // Test write operation
    const testCollection = mongoose.connection.db.collection('test');
    const testDoc = await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful' 
    });
    console.log('✅ Test write operation successful');
    
    // Clean up test document
    await testCollection.deleteOne({ _id: testDoc.insertedId });
    console.log('✅ Test document cleaned up');
    
    console.log('\n🎉 MongoDB Atlas connection is fully functional!');
    console.log('📋 Next steps:');
    console.log('   1. Add this connection string to Render environment variables');
    console.log('   2. Change Render start command to "node server.js"');
    console.log('   3. Test your deployment with: npm run test:production');
    
  } catch (error) {
    console.log('❌ MongoDB connection failed');
    console.log('📝 Error details:', error.message);
    
    // Provide specific error guidance
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication Error Solutions:');
      console.log('   - Check your MongoDB Atlas username and password');
      console.log('   - Ensure the password doesn\'t contain special characters');
      console.log('   - Verify the database user exists and has proper permissions');
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      console.log('\n💡 Network Error Solutions:');
      console.log('   - Check your internet connection');
      console.log('   - Verify MongoDB Atlas IP whitelist (try 0.0.0.0/0 for testing)');
      console.log('   - Ensure no firewall is blocking the connection');
    } else if (error.message.includes('hostname')) {
      console.log('\n💡 Hostname Error Solutions:');
      console.log('   - Check the cluster hostname in your connection string');
      console.log('   - Ensure the cluster is running and accessible');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

// Run the test
if (require.main === module) {
  testMongoConnection();
}

module.exports = { testMongoConnection };
