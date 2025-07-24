#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...\n');

// Check if required files exist
const requiredFiles = ['.env', 'package.json', 'server.js'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error(`❌ Missing required files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

// Check environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
}

try {
  // Install dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build frontend
  console.log('🏗️  Building frontend...');
  if (fs.existsSync('frontend')) {
    execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
    console.log('✅ Frontend built successfully!');
  } else {
    console.log('⚠️  No frontend directory found, skipping frontend build');
  }

  // Run tests
  console.log('🧪 Running tests...');
  try {
    execSync('npm test', { stdio: 'pipe' });
    console.log('✅ All tests passed!');
  } catch (error) {
    console.log('⚠️  Some tests failed, but continuing deployment...');
  }

  console.log('\n✨ Deployment preparation complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Set up your production database (MongoDB Atlas)');
  console.log('2. Get API keys (Paystack, Google Maps)');
  console.log('3. Deploy to your hosting platform:');
  console.log('   - Heroku: heroku create your-app-name && git push heroku main');
  console.log('   - Railway: Connect your GitHub repo');
  console.log('   - Render: Connect your GitHub repo');
  console.log('4. Set environment variables on your hosting platform');
  console.log('5. Test your deployed application');

} catch (error) {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
}
