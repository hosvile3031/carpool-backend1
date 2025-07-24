require('dotenv').config();

const requiredEnvVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET'
];

const criticalEnvVars = [
  'PAYSTACK_SECRET_KEY',
  'GOOGLE_MAPS_API_KEY'
];

const optionalEnvVars = [
  'EMAIL_HOST',
  'CLOUDINARY_CLOUD_NAME',
  'SENTRY_DSN',
  'PAYSTACK_PUBLIC_KEY',
  'GOOGLE_PLACES_API_KEY',
  'BASE_URL',
  'FRONTEND_URL'
];

function validateEnvironment() {
  console.log('🔍 Validating production environment configuration...\n');
  
  let isValid = true;
  let hasCriticalIssues = false;
  let warnings = [];

  // Check required variables (must have for basic functionality)
  console.log('🔴 Required Environment Variables (Must Have):');
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
      
      // Additional validation for specific variables
      if (envVar === 'MONGODB_URI') {
        if (!process.env[envVar].includes('mongodb')) {
          console.log(`⚠️  ${envVar}: Does not appear to be a valid MongoDB URI`);
          warnings.push(`${envVar} should start with mongodb:// or mongodb+srv://`);
        }
      }
      
      if (envVar === 'JWT_SECRET') {
        if (process.env[envVar].length < 32) {
          console.log(`⚠️  ${envVar}: Should be at least 32 characters long for security`);
          warnings.push(`${envVar} is too short for production use`);
        }
      }
    } else {
      console.log(`❌ ${envVar}: Missing`);
      isValid = false;
    }
  });

  console.log('\n🟡 Critical Environment Variables (Highly Recommended):');
  criticalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
      
      // Validate Paystack keys format
      if (envVar === 'PAYSTACK_SECRET_KEY') {
        if (!process.env[envVar].startsWith('sk_')) {
          console.log(`⚠️  ${envVar}: Should start with 'sk_'`);
          warnings.push(`${envVar} format appears incorrect`);
        }
      }
      
      // Validate Google Maps API key format
      if (envVar === 'GOOGLE_MAPS_API_KEY') {
        if (!process.env[envVar].startsWith('AIza')) {
          console.log(`⚠️  ${envVar}: Should start with 'AIza'`);
          warnings.push(`${envVar} format appears incorrect`);
        }
      }
    } else {
      console.log(`⚠️  ${envVar}: Not set (feature will be disabled)`);
      hasCriticalIssues = true;
    }
  });

  console.log('\n🟢 Optional Environment Variables (Nice to Have):');
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
    } else {
      console.log(`⚪ ${envVar}: Not set`);
    }
  });

  // Environment-specific checks
  console.log('\n🔧 Environment-Specific Validation:');
  
  if (process.env.NODE_ENV === 'production') {
    console.log('✅ NODE_ENV: production (correct for deployment)');
    
    // Production-specific checks
    if (!process.env.BASE_URL || process.env.BASE_URL.includes('localhost')) {
      console.log('⚠️  BASE_URL: Should be set to your production domain');
      warnings.push('BASE_URL should not contain localhost in production');
    }
    
    if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes('localhost')) {
      console.log('⚠️  FRONTEND_URL: Should be set to your production domain');
      warnings.push('FRONTEND_URL should not contain localhost in production');
    }
  } else {
    console.log(`⚠️  NODE_ENV: ${process.env.NODE_ENV || 'not set'} (should be 'production' for deployment)`);
    warnings.push('NODE_ENV should be set to "production" for production deployment');
  }

  // Security checks
  console.log('\n🔒 Security Validation:');
  
  if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
    console.log('❌ JWT_SECRET: Using default/example secret (SECURITY RISK!)');
    isValid = false;
  } else {
    console.log('✅ JWT_SECRET: Custom secret set');
  }
  
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('localhost')) {
    console.log('⚠️  MONGODB_URI: Using localhost (should use MongoDB Atlas for production)');
    warnings.push('Consider using MongoDB Atlas for production database');
  }

  // Feature availability summary
  console.log('\n🎯 Feature Availability Summary:');
  console.log(`  Authentication: ${process.env.MONGODB_URI && process.env.JWT_SECRET ? '✅ Available' : '❌ Unavailable'}`);
  console.log(`  Payment Processing: ${process.env.PAYSTACK_SECRET_KEY ? '✅ Available' : '❌ Unavailable'}`);
  console.log(`  Location Services: ${process.env.GOOGLE_MAPS_API_KEY ? '✅ Available' : '❌ Unavailable'}`);
  console.log(`  File Uploads: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Available' : '⚪ Basic only'}`);
  console.log(`  Email Notifications: ${process.env.EMAIL_HOST ? '✅ Available' : '⚪ Disabled'}`);
  console.log(`  Error Tracking: ${process.env.SENTRY_DSN ? '✅ Available' : '⚪ Disabled'}`);

  // Summary
  console.log('\n' + '='.repeat(60));
  
  if (isValid && warnings.length === 0) {
    console.log('🎉 Environment validation passed!');
    console.log('✅ Your application is ready for production deployment');
    return { isValid: true, warnings: [], criticalIssues: !hasCriticalIssues };
  } else if (isValid) {
    console.log('⚠️  Environment validation passed with warnings');
    console.log('✅ Your application can be deployed, but consider addressing warnings');
    
    if (warnings.length > 0) {
      console.log('\n📋 Warnings to address:');
      warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }
    
    if (hasCriticalIssues) {
      console.log('\n🚨 Some features will be disabled due to missing critical variables');
    }
    
    return { isValid: true, warnings, criticalIssues: hasCriticalIssues };
  } else {
    console.log('❌ Environment validation failed!');
    console.log('🚫 Cannot deploy - missing required environment variables');
    
    console.log('\n📋 Required actions:');
    requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        console.log(`  - Set ${envVar}`);
      }
    });
    
    return { isValid: false, warnings, criticalIssues: true };
  }
}

// Specific deployment platform checks
function validateForPlatform(platform) {
  console.log(`\n🌐 ${platform.toUpperCase()} Deployment Validation:`);
  
  switch (platform.toLowerCase()) {
    case 'render':
      console.log('✅ Render automatically handles PORT environment variable');
      console.log('📋 Remember to set environment variables in Render dashboard');
      break;
      
    case 'heroku':
      console.log('✅ Heroku automatically handles PORT environment variable');
      console.log('📋 Use: heroku config:set VARIABLE_NAME=value');
      break;
      
    case 'railway':
      console.log('✅ Railway automatically handles PORT environment variable');
      console.log('📋 Use Railway dashboard or CLI to set variables');
      break;
      
    case 'vercel':
      console.log('⚠️  Vercel is for frontend - use for static builds only');
      console.log('📋 Consider Vercel + separate backend deployment');
      break;
      
    default:
      console.log('📋 Ensure PORT environment variable is handled by your platform');
  }
}

// Generate deployment-ready environment template
function generateEnvTemplate() {
  console.log('\n📝 Environment Template for Production:');
  console.log('Copy this template and fill in your actual values:\n');
  
  const template = `# Production Environment Configuration
NODE_ENV=production
PORT=10000

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-chars
JWT_EXPIRE=30d

# Payments (Paystack)
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key

# Maps (Google)
GOOGLE_MAPS_API_KEY=AIzaSyYour_Google_Maps_API_Key
GOOGLE_PLACES_API_KEY=AIzaSyYour_Google_Places_API_Key

# App URLs (Update with your domain)
BASE_URL=https://your-app-domain.com
FRONTEND_URL=https://your-app-domain.com

# Optional Features
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
EMAIL_HOST=smtp.sendgrid.net
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project`;

  console.log(template);
}

// Main execution
if (require.main === module) {
  const result = validateEnvironment();
  
  // Check for platform-specific validation
  const platform = process.argv[2];
  if (platform) {
    validateForPlatform(platform);
  }
  
  // Generate template if requested
  if (process.argv.includes('--template')) {
    generateEnvTemplate();
  }
  
  // Exit with appropriate code
  process.exit(result.isValid ? 0 : 1);
}

module.exports = { 
  validateEnvironment, 
  validateForPlatform, 
  generateEnvTemplate 
};
