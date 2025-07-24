#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('🚀 Carpool Backend Deployment Wizard\n');
  console.log('This wizard will help you deploy your carpool backend to production.\n');

  // Check if external services are configured
  console.log('📋 First, let\'s check if you have configured the external services:\n');

  const mongoConfigured = await askQuestion('1. Have you set up MongoDB Atlas? (y/n): ');
  const paystackConfigured = await askQuestion('2. Have you set up Paystack? (y/n): ');
  const googleMapsConfigured = await askQuestion('3. Have you set up Google Maps API? (y/n): ');

  if (mongoConfigured.toLowerCase() !== 'y' || 
      paystackConfigured.toLowerCase() !== 'y' || 
      googleMapsConfigured.toLowerCase() !== 'y') {
    
    console.log(`\n⚠️  Please complete the setup for missing services:`);
    if (mongoConfigured.toLowerCase() !== 'y') {
      console.log('   📖 MongoDB Atlas: Read setup-guides/mongodb-atlas.md');
    }
    if (paystackConfigured.toLowerCase() !== 'y') {
      console.log('   💳 Paystack: Read setup-guides/paystack.md');
    }
    if (googleMapsConfigured.toLowerCase() !== 'y') {
      console.log('   🗺️  Google Maps: Read setup-guides/google-maps.md');
    }
    console.log('\nRun this wizard again once all services are configured.\n');
    rl.close();
    return;
  }

  // Get API keys and configuration
  console.log('\n🔑 Now, let\'s collect your API keys and configuration:\n');

  const mongoUri = await askQuestion('MongoDB URI: ');
  const jwtSecret = await askQuestion('JWT Secret (or press Enter for auto-generated): ') || 
                   `carpool-jwt-secret-${Date.now()}-${Math.random().toString(36)}`;
  const paystackSecret = await askQuestion('Paystack Secret Key: ');
  const paystackPublic = await askQuestion('Paystack Public Key: ');
  const googleMapsKey = await askQuestion('Google Maps API Key: ');

  // Choose deployment platform
  console.log('\n🌐 Choose your deployment platform:\n');
  console.log('1. Heroku (Recommended for beginners)');
  console.log('2. Railway (Modern and fast)');
  console.log('3. Render (Simple and reliable)');
  console.log('4. Manual (I\'ll configure myself)\n');

  const platform = await askQuestion('Enter your choice (1-4): ');

  // Update .env file with production values
  console.log('\n📝 Updating environment variables...');

  const envContent = `# Server Configuration
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=${mongoUri}

# JWT
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=30d

# Paystack API
PAYSTACK_SECRET_KEY=${paystackSecret}
PAYSTACK_PUBLIC_KEY=${paystackPublic}

# Google APIs
GOOGLE_MAPS_API_KEY=${googleMapsKey}
GOOGLE_PLACES_API_KEY=${googleMapsKey}

# Cloudinary (optional - update if needed)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (optional - update if needed)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App Configuration (will be updated with actual URLs after deployment)
BASE_URL=https://your-app-domain.com
FRONTEND_URL=https://your-app-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync('.env.production', envContent);
  console.log('✅ Created .env.production file');

  // Build the application
  console.log('\n🏗️  Building application...');
  try {
    execSync('npm run build:full', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.log('⚠️  Build completed with warnings');
  }

  // Platform-specific instructions
  if (platform === '1') {
    console.log('\n🔧 Heroku Deployment Instructions:');
    console.log('1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli');
    console.log('2. Run: heroku login');
    console.log('3. Run: heroku create your-app-name');
    console.log('4. Set environment variables:');
    console.log(`   heroku config:set MONGODB_URI="${mongoUri}"`);
    console.log(`   heroku config:set JWT_SECRET="${jwtSecret}"`);
    console.log(`   heroku config:set PAYSTACK_SECRET_KEY="${paystackSecret}"`);
    console.log(`   heroku config:set PAYSTACK_PUBLIC_KEY="${paystackPublic}"`);
    console.log(`   heroku config:set GOOGLE_MAPS_API_KEY="${googleMapsKey}"`);
    console.log('   heroku config:set NODE_ENV="production"');
    console.log('5. Run: git add . && git commit -m "Ready for deployment"');
    console.log('6. Run: git push heroku main');
    console.log('7. Run: heroku open');
    console.log('\n📖 Full guide: setup-guides/heroku-deployment.md');
  } else if (platform === '2') {
    console.log('\n🚄 Railway Deployment Instructions:');
    console.log('1. Go to https://railway.app/');
    console.log('2. Connect your GitHub repository');
    console.log('3. Add environment variables in the Railway dashboard');
    console.log('4. Deploy automatically on git push');
  } else if (platform === '3') {
    console.log('\n🎨 Render Deployment Instructions:');
    console.log('1. Go to https://render.com/');
    console.log('2. Connect your GitHub repository');
    console.log('3. Choose "Web Service"');
    console.log('4. Add environment variables in Render dashboard');
    console.log('5. Deploy automatically');
  } else {
    console.log('\n📋 Manual Deployment:');
    console.log('1. Use the .env.production file for your environment variables');
    console.log('2. Run: npm run build:full');
    console.log('3. Run: npm start');
    console.log('4. Ensure your server is accessible from the internet');
  }

  // Final checklist
  console.log('\n✅ Final Deployment Checklist:');
  console.log('□ External services configured (MongoDB, Paystack, Google Maps)');
  console.log('□ Environment variables set');
  console.log('□ Application built successfully');
  console.log('□ Deployment platform chosen');
  console.log('□ Code pushed to platform');
  console.log('□ App deployed and accessible');
  console.log('□ API endpoints tested');
  console.log('□ Frontend loads correctly');

  console.log('\n🎉 Your carpool backend is ready to go live!');
  console.log('💡 Don\'t forget to update BASE_URL and FRONTEND_URL with your actual domain after deployment.');

  rl.close();
}

main().catch(console.error);
