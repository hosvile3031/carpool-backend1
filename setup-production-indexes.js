const mongoose = require('mongoose');
require('dotenv').config();

async function setupProductionIndexes() {
  console.log('🗄️ Setting up production database indexes...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;

    // User indexes for performance and constraints
    console.log('📝 Creating User indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ phone: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: -1 });
    await db.collection('users').createIndex({ isActive: 1 });
    await db.collection('users').createIndex({ role: 1 });
    console.log('✅ User indexes created');

    // Ride indexes for geospatial queries and performance
    console.log('📝 Creating Ride indexes...');
    await db.collection('rides').createIndex({ 
      'origin.coordinates': '2dsphere' 
    });
    await db.collection('rides').createIndex({ 
      'destination.coordinates': '2dsphere' 
    });
    await db.collection('rides').createIndex({ departureTime: 1 });
    await db.collection('rides').createIndex({ status: 1 });
    await db.collection('rides').createIndex({ driver: 1 });
    await db.collection('rides').createIndex({ createdAt: -1 });
    await db.collection('rides').createIndex({ 
      status: 1, 
      departureTime: 1 
    }); // Compound index for active rides
    console.log('✅ Ride indexes created');

    // Driver indexes
    console.log('📝 Creating Driver indexes...');
    await db.collection('drivers').createIndex({ user: 1 }, { unique: true });
    await db.collection('drivers').createIndex({ licenseNumber: 1 }, { unique: true });
    await db.collection('drivers').createIndex({ isVerified: 1 });
    await db.collection('drivers').createIndex({ 
      'vehicle.licensePlate': 1 
    }, { unique: true });
    console.log('✅ Driver indexes created');

    // Notification indexes for efficient queries
    console.log('📝 Creating Notification indexes...');
    await db.collection('notifications').createIndex({ 
      user: 1, 
      createdAt: -1 
    });
    await db.collection('notifications').createIndex({ isRead: 1 });
    await db.collection('notifications').createIndex({ type: 1 });
    console.log('✅ Notification indexes created');

    // Rating indexes
    console.log('📝 Creating Rating indexes...');
    await db.collection('ratings').createIndex({ ratedUser: 1 });
    await db.collection('ratings').createIndex({ ratingUser: 1 });
    await db.collection('ratings').createIndex({ ride: 1 });
    await db.collection('ratings').createIndex({ createdAt: -1 });
    console.log('✅ Rating indexes created');

    // Payment indexes
    console.log('📝 Creating Payment indexes...');
    await db.collection('payments').createIndex({ user: 1 });
    await db.collection('payments').createIndex({ ride: 1 });
    await db.collection('payments').createIndex({ reference: 1 }, { unique: true });
    await db.collection('payments').createIndex({ status: 1 });
    await db.collection('payments').createIndex({ createdAt: -1 });
    console.log('✅ Payment indexes created');

    // Session indexes (if using database sessions)
    console.log('📝 Creating Session indexes...');
    await db.collection('sessions').createIndex({ 
      expiresAt: 1 
    }, { 
      expireAfterSeconds: 0 
    });
    await db.collection('sessions').createIndex({ userId: 1 });
    console.log('✅ Session indexes created');

    console.log('\n🎉 All production indexes created successfully!');
    console.log('📊 Database is now optimized for production workloads');

    // Display index statistics
    console.log('\n📈 Index Statistics:');
    const collections = ['users', 'rides', 'drivers', 'notifications', 'ratings', 'payments'];
    
    for (const collectionName of collections) {
      try {
        const indexes = await db.collection(collectionName).indexes();
        console.log(`  ${collectionName}: ${indexes.length} indexes`);
      } catch (error) {
        console.log(`  ${collectionName}: Collection not found (will be created on first use)`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 This might be a duplicate key error. Some indexes may already exist.');
    }
    
    if (error.name === 'MongoNetworkError') {
      console.error('💡 Check your MongoDB connection string and network access settings.');
    }
    
    process.exit(1);
  }
}

// Test database connection first
async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await mongoose.connection.db.admin().ping();
    console.log('✅ MongoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

// Main execution
if (require.main === module) {
  (async () => {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.log('💡 Make sure to set your MongoDB Atlas connection string');
      process.exit(1);
    }

    const isConnected = await testConnection();
    if (isConnected) {
      await setupProductionIndexes();
    } else {
      console.error('❌ Cannot proceed without database connection');
      process.exit(1);
    }
  })();
}

module.exports = { setupProductionIndexes };
