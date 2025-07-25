// Simple in-memory database for development testing
const bcrypt = require('bcryptjs');

class MockDatabase {
  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.nextUserId = 1;
    this.nextRideId = 1;
  }

  // User methods
  async findUserByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserByPhone(phone) {
    for (let user of this.users.values()) {
      if (user.phone === phone) {
        return user;
      }
    }
    return null;
  }

  async createUser(userData) {
    const userId = this.nextUserId++;
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = {
      _id: userId,
      ...userData,
      password: hashedPassword,
      role: 'passenger',
      isActive: true,
      isVerified: false,
      loginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(userId, user);
    return user;
  }

  async findUserById(id) {
    return this.users.get(parseInt(id));
  }

  async comparePassword(storedPassword, candidatePassword) {
    return await bcrypt.compare(candidatePassword, storedPassword);
  }

  // Add some test users
  async seedTestUsers() {
    if (this.users.size === 0) {
      await this.createUser({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male'
      });

      console.log('✅ Created test user: test@example.com / password123');
    }
  }
}

module.exports = new MockDatabase();
