# 🚀 Production Mode Setup Guide

Complete guide for deploying your carpool backend to production with full MongoDB Atlas integration.

## 📋 Table of Contents
1. [MongoDB Atlas Production Setup](#mongodb-atlas-production-setup)
2. [Environment Configuration](#environment-configuration)
3. [Security Setup](#security-setup)
4. [Deployment Platforms](#deployment-platforms)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 1. MongoDB Atlas Production Setup

### 🗄️ Step 1: Create Production Database

#### A. Sign up for MongoDB Atlas
```bash
# Visit: https://cloud.mongodb.com
# Click "Try Free" → Sign up with Google/GitHub or email
```

#### B. Create Production Cluster
1. **Choose Cluster Type**: 
   - **Shared (M0)**: FREE - Perfect for development/small apps
   - **Dedicated (M10+)**: $57+/month - For production with guaranteed performance
   
2. **Configuration**:
   ```
   Cloud Provider: AWS (recommended)
   Region: Choose closest to your users
   Cluster Name: carpool-production
   MongoDB Version: 6.0+ (latest stable)
   ```

3. **Cluster Settings**:
   ```
   Backup: Enable (recommended for production)
   Monitoring: Enable
   Performance Advisor: Enable
   ```

#### C. Database Security Setup
1. **Create Database User**:
   ```
   Username: carpool-prod-user
   Password: [Generate strong password - save it!]
   Database User Privileges: Read and write to any database
   ```

2. **Network Access**:
   ```
   # Option 1: Specific IPs (Most Secure)
   Add your deployment platform IPs:
   - Render: Dynamic IPs (use 0.0.0.0/0 for simplicity)
   - Heroku: 0.0.0.0/0 (Heroku uses dynamic IPs)
   - Railway: Check their documentation for IP ranges
   
   # Option 2: Allow all IPs (Less secure but works)
   0.0.0.0/0
   ```

#### D. Get Production Connection String
```bash
# Format:
mongodb+srv://carpool-prod-user:<password>@carpool-production.xxxxx.mongodb.net/carpool?retryWrites=true&w=majority

# Replace:
# - <password> with your actual password
# - xxxxx with your cluster identifier
# - carpool with your database name
```

### 🔧 Step 2: Database Optimization

#### A. Create Indexes for Performance
Create a script to set up production indexes:

```javascript
// Create file: setup-production-indexes.js
const mongoose = require('mongoose');

async function setupProductionIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // User indexes
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ phone: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ createdAt: -1 });
    
    // Ride indexes
    await mongoose.connection.db.collection('rides').createIndex({ 
      'origin.coordinates': '2dsphere' 
    });
    await mongoose.connection.db.collection('rides').createIndex({ 
      'destination.coordinates': '2dsphere' 
    });
    await mongoose.connection.db.collection('rides').createIndex({ departureTime: 1 });
    await mongoose.connection.db.collection('rides').createIndex({ status: 1 });
    await mongoose.connection.db.collection('rides').createIndex({ driver: 1 });
    
    // Driver indexes
    await mongoose.connection.db.collection('drivers').createIndex({ user: 1 }, { unique: true });
    await mongoose.connection.db.collection('drivers').createIndex({ licenseNumber: 1 }, { unique: true });
    await mongoose.connection.db.collection('drivers').createIndex({ isVerified: 1 });
    
    // Notification indexes
    await mongoose.connection.db.collection('notifications').createIndex({ user: 1, createdAt: -1 });
    await mongoose.connection.db.collection('notifications').createIndex({ isRead: 1 });
    
    console.log('✅ Production indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
}

setupProductionIndexes();
```

#### B. Add to package.json
```json
{
  "scripts": {
    "setup:indexes": "node setup-production-indexes.js",
    "setup:production": "npm run setup:indexes"
  }
}
```

---

## 2. Environment Configuration

### 🔐 Production Environment Variables

Create comprehensive environment configuration:

#### A. Complete .env.production
```bash
# ===========================================
# PRODUCTION ENVIRONMENT CONFIGURATION
# ===========================================

# Server Configuration
NODE_ENV=production
PORT=10000

# Database Configuration
MONGODB_URI=mongodb+srv://carpool-prod-user:YOUR_PASSWORD@carpool-production.xxxxx.mongodb.net/carpool?retryWrites=true&w=majority&appName=CarpoolApp

# JWT Configuration
JWT_SECRET=carpool-super-secure-jwt-secret-2024-prod-$(openssl rand -hex 32)
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=carpool-refresh-secret-2024-$(openssl rand -hex 32)
JWT_REFRESH_EXPIRE=7d

# Paystack Configuration (Production)
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# Google APIs Configuration
GOOGLE_MAPS_API_KEY=AIzaSyYour_Production_Google_Maps_API_Key
GOOGLE_PLACES_API_KEY=AIzaSyYour_Production_Google_Places_API_Key

# Cloudinary Configuration (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Production SMTP)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com

# App URLs
BASE_URL=https://your-app-domain.com
FRONTEND_URL=https://your-app-domain.com
API_URL=https://your-app-domain.com/api

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_$(openssl rand -hex 32)

# Feature Flags
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_PAYMENT_PROCESSING=true
ENABLE_DRIVER_VERIFICATION=true

# Logging Configuration
LOG_LEVEL=info
LOG_TO_FILE=true
LOG_TO_DATABASE=true

# Cache Configuration (Redis - Optional)
REDIS_URL=redis://localhost:6379
ENABLE_CACHING=false

# Analytics & Monitoring
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
ENABLE_ANALYTICS=true
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Development Tools (Disable in production)
ENABLE_SWAGGER_DOCS=false
ENABLE_DEBUG_ROUTES=false
ENABLE_CORS_ALL_ORIGINS=false
```

#### B. Environment Validation Script
```javascript
// Create file: validate-environment.js
const requiredEnvVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'PAYSTACK_SECRET_KEY',
  'GOOGLE_MAPS_API_KEY'
];

const optionalEnvVars = [
  'EMAIL_HOST',
  'CLOUDINARY_CLOUD_NAME',
  'SENTRY_DSN'
];

function validateEnvironment() {
  console.log('🔍 Validating production environment...\n');
  
  let isValid = true;
  
  // Check required variables
  console.log('Required Environment Variables:');
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
    } else {
      console.log(`❌ ${envVar}: Missing`);
      isValid = false;
    }
  });
  
  console.log('\nOptional Environment Variables:');
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
    } else {
      console.log(`⚠️  ${envVar}: Not set (feature may be disabled)`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  
  if (isValid) {
    console.log('🎉 Environment validation passed!');
    console.log('✅ Ready for production deployment');
  } else {
    console.log('❌ Environment validation failed!');
    console.log('⚠️  Please set missing required variables');
    process.exit(1);
  }
}

if (require.main === module) {
  validateEnvironment();
}

module.exports = { validateEnvironment };
```

---

## 3. Security Setup

### 🔒 Production Security Configuration

#### A. Enhanced Security Middleware
```javascript
// Create file: middleware/productionSecurity.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const productionSecurity = (app) => {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.paystack.co"],
      },
    },
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Stricter rate limiting for authentication routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    skipSuccessfulRequests: true,
  });
  app.use('/api/auth', authLimiter);

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(hpp({
    whitelist: ['sort', 'fields', 'page', 'limit']
  }));

  console.log('✅ Production security middleware enabled');
};

module.exports = productionSecurity;
```

#### B. Enhanced CORS Configuration
```javascript
// Update server.js CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://your-app-domain.com',
      'https://www.your-app-domain.com'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## 4. Deployment Platforms

### 🌐 Multi-Platform Deployment Guides

#### A. Render.com Deployment

##### 1. Create render.yaml (Production)
```yaml
# render-production.yaml
services:
  - type: web
    name: carpool-backend-prod
    env: node
    plan: starter  # $7/month for better performance
    region: oregon  # Choose closest to your users
    buildCommand: |
      npm ci --only=production
      npm run build:full
      npm run setup:indexes
    startCommand: node server.js
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false  # Set manually in dashboard
      - key: JWT_SECRET
        generateValue: true
      - key: PAYSTACK_SECRET_KEY
        sync: false
      - key: GOOGLE_MAPS_API_KEY
        sync: false
    scaling:
      minInstances: 1
      maxInstances: 3
```

##### 2. Deployment Steps
```bash
# 1. Connect GitHub repository to Render
# 2. Use render-production.yaml configuration
# 3. Set environment variables in Render dashboard
# 4. Deploy automatically on git push

# Manual deployment trigger:
curl -X POST "https://api.render.com/deploy/srv-YOUR_SERVICE_ID?key=YOUR_DEPLOY_KEY"
```

#### B. Heroku Deployment

##### 1. Heroku Configuration
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login and create app
heroku login
heroku create carpool-backend-prod

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-connection-string"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set PAYSTACK_SECRET_KEY="your-paystack-key"
heroku config:set GOOGLE_MAPS_API_KEY="your-google-maps-key"

# Deploy
git add .
git commit -m "Production deployment"
git push heroku main

# Scale dynos
heroku ps:scale web=1

# View logs
heroku logs --tail
```

##### 2. Update Procfile for Production
```procfile
# Procfile
web: npm run setup:indexes && node server.js
release: npm run setup:production
```

#### C. Railway Deployment

##### 1. Railway Configuration
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Set environment variables
railway variables:set NODE_ENV=production
railway variables:set MONGODB_URI="your-mongodb-connection-string"
railway variables:set JWT_SECRET="your-jwt-secret"

# Deploy
railway up
```

##### 2. railway.json Configuration
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run setup:indexes && node server.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### D. DigitalOcean App Platform

##### 1. App Spec Configuration
```yaml
# .do/app.yaml
name: carpool-backend-prod
services:
- name: api
  source_dir: /
  github:
    repo: your-username/carpool-backend
    branch: main
  run_command: node server.js
  build_command: npm ci --only=production && npm run build:full
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  health_check:
    http_path: /health
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    type: SECRET
  - key: JWT_SECRET
    type: SECRET
```

---

## 5. Post-Deployment Verification

### ✅ Production Health Checks

#### A. Create Comprehensive Health Check
```javascript
// Update server.js health check
app.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {}
  };

  try {
    // Database connectivity check
    const dbState = mongoose.connection.readyState;
    healthCheck.checks.database = {
      status: dbState === 1 ? 'connected' : 'disconnected',
      readyState: dbState
    };

    // Memory usage check
    const memUsage = process.memoryUsage();
    healthCheck.checks.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
    };

    // External services check
    healthCheck.checks.services = {
      paystack: !!process.env.PAYSTACK_SECRET_KEY,
      googleMaps: !!process.env.GOOGLE_MAPS_API_KEY,
      email: !!process.env.EMAIL_HOST,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME
    };

    // Response time check
    const start = Date.now();
    await mongoose.connection.db.admin().ping();
    healthCheck.checks.responseTime = {
      database: `${Date.now() - start}ms`
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'ERROR';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});
```

#### B. Automated Testing Script
```javascript
// Create file: test-production.js
const axios = require('axios');

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://your-app-domain.com';

async function testProductionDeployment() {
  console.log('🧪 Testing Production Deployment...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${PRODUCTION_URL}/health`,
      method: 'GET'
    },
    {
      name: 'API Documentation',
      url: `${PRODUCTION_URL}/api`,
      method: 'GET'
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
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: test.url,
        data: test.data,
        timeout: 10000
      });

      console.log(`✅ ${test.name}: PASSED (${response.status})`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED (${error.response?.status || error.message})`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Production deployment is healthy.');
  } else {
    console.log('⚠️  Some tests failed. Check your deployment configuration.');
  }
}

if (require.main === module) {
  testProductionDeployment();
}

module.exports = { testProductionDeployment };
```

---

## 6. Monitoring & Maintenance

### 📊 Production Monitoring Setup

#### A. Logging Configuration
```javascript
// Create file: utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'carpool-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### B. Error Tracking with Sentry
```javascript
// Add to server.js
const Sentry = require('@sentry/node');

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  
  // Add error handler before other error handlers
  app.use(Sentry.Handlers.errorHandler());
}
```

#### C. Performance Monitoring
```javascript
// Create file: middleware/performance.js
const responseTime = require('response-time');

const performanceMonitoring = (app) => {
  app.use(responseTime((req, res, time) => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`${req.method} ${req.url} - ${time.toFixed(2)}ms`);
      
      // Log slow requests
      if (time > 1000) {
        console.warn(`Slow request: ${req.method} ${req.url} - ${time.toFixed(2)}ms`);
      }
    }
  }));
};

module.exports = performanceMonitoring;
```

---

## 🎯 Quick Start Checklist

### Essential Steps:
- [ ] Set up MongoDB Atlas production cluster
- [ ] Configure all environment variables
- [ ] Choose deployment platform (Render/Heroku/Railway)
- [ ] Deploy application
- [ ] Run health checks
- [ ] Set up monitoring

### Optional Enhancements:
- [ ] Set up Sentry for error tracking
- [ ] Configure SendGrid for emails
- [ ] Set up Cloudinary for file uploads
- [ ] Add Redis for caching
- [ ] Set up automated backups

---

## 🚨 Security Checklist

### Before Going Live:
- [ ] All environment variables are set
- [ ] Database user has minimum required permissions
- [ ] CORS is configured for specific domains only
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Sensitive data is not logged
- [ ] API keys are not exposed in client-side code
- [ ] Authentication tokens have proper expiration
- [ ] Input validation is implemented
- [ ] SQL injection protection is enabled

---

## 📞 Support & Troubleshooting

### Common Issues:
1. **Database Connection Errors**: Check MongoDB Atlas IP whitelist
2. **Environment Variables**: Ensure exact variable names (case-sensitive)
3. **Build Failures**: Check Node.js version compatibility
4. **CORS Errors**: Verify frontend URL in CORS configuration
5. **Payment Issues**: Ensure Paystack keys are for correct environment

### Getting Help:
- Check deployment platform logs first
- Use health check endpoint for diagnostics
- Test individual API endpoints
- Verify environment variables are set correctly

**Your carpool backend is now production-ready!** 🎉
