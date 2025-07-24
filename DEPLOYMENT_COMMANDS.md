# 🚀 Deployment Commands Guide

Complete reference for all deployment-related commands and scripts.

## 📋 Quick Reference

### Essential Commands
```bash
# Validate environment before deployment
npm run validate:env

# Set up production database indexes
npm run setup:indexes

# Complete production setup (validation + indexes)
npm run setup:production

# Test your live deployment
npm run test:production

# Test with authentication flow
npm run test:production:auth
```

## 🔧 Development Commands

### Local Development
```bash
# Start development server with auto-reload
npm run dev

# Start demo server (no database required)
npm run demo

# Run tests
npm test
npm run test:watch

# Health check (when server is running)
npm run health:check
```

### Build Commands
```bash
# Build frontend only
npm run build

# Full build (backend + frontend)
npm run build:full

# Production build for Render
npm run build:render
```

## 🌐 Platform-Specific Deployment

### Render.com Deployment

#### Method 1: Automatic (Recommended)
```bash
# 1. Validate environment for Render
npm run validate:env:render

# 2. Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Deploy to production"
git push origin main

# 3. Test deployment
npm run test:production
```

#### Method 2: Manual Deploy
```bash
# Deploy using Render CLI
npm run deploy:render

# Or using curl (get deploy key from Render dashboard)
curl -X POST "https://api.render.com/deploy/srv-YOUR_SERVICE_ID?key=YOUR_DEPLOY_KEY"
```

### Heroku Deployment

#### Setup
```bash
# Install Heroku CLI first: https://devcenter.heroku.com/articles/heroku-cli

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-connection-string"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set PAYSTACK_SECRET_KEY="your-paystack-key"
heroku config:set GOOGLE_MAPS_API_KEY="your-google-maps-key"
```

#### Deployment
```bash
# Validate environment
npm run validate:env:heroku

# Deploy
npm run deploy:heroku
git push heroku main

# Scale app
heroku ps:scale web=1

# View logs
heroku logs --tail

# Test deployment
npm run test:production
```

### Railway Deployment

#### Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init
```

#### Deployment
```bash
# Validate environment
npm run validate:env:railway

# Set environment variables
railway variables:set NODE_ENV=production
railway variables:set MONGODB_URI="your-mongodb-connection-string"
railway variables:set JWT_SECRET="your-jwt-secret"

# Deploy
npm run deploy:railway
railway up

# Test deployment
npm run test:production
```

### DigitalOcean App Platform

#### Using App Spec
```bash
# Create .do/app.yaml file (already included)
# Deploy via DigitalOcean dashboard or CLI

# Using doctl CLI
doctl apps create --spec .do/app.yaml

# Test deployment
npm run test:production
```

## 🔍 Environment Validation

### Basic Validation
```bash
# Check all environment variables
npm run validate:env

# Platform-specific validation
npm run validate:env:render
npm run validate:env:heroku
npm run validate:env:railway

# Generate environment template
node validate-environment.js --template
```

### Custom Validation
```bash
# Validate specific environment file
NODE_ENV=production npm run validate:env

# Check environment for specific platform
node validate-environment.js render
node validate-environment.js heroku
node validate-environment.js railway
```

## 🗄️ Database Setup

### MongoDB Atlas Setup
```bash
# Set up production indexes (run after MongoDB Atlas setup)
npm run setup:indexes

# Test database connection
MONGODB_URI="your-connection-string" node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.log('❌ Error:', err.message));
"
```

## 🧪 Testing & Monitoring

### Production Testing
```bash
# Basic health check
npm run test:production

# Test with authentication flow
npm run test:production:auth

# Test custom URL
node test-production.js https://your-custom-url.com

# Test with authentication on custom URL
node test-production.js https://your-custom-url.com --auth
```

### Health Monitoring
```bash
# Quick health check
curl -f https://your-app-domain.com/health

# Detailed health check with formatting
curl -s https://your-app-domain.com/health | jq '.'

# Monitor response time
curl -w "@curl-format.txt" -s -o /dev/null https://your-app-domain.com/health
```

## 🔧 Troubleshooting Commands

### Debug Environment
```bash
# List all environment variables
printenv | grep -E "(NODE_ENV|MONGODB|JWT|PAYSTACK|GOOGLE)"

# Check specific variables
echo $MONGODB_URI
echo $JWT_SECRET
echo $NODE_ENV
```

### Debug Database
```bash
# Test MongoDB connection
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Database connected');
    return mongoose.connection.db.admin().ping();
  })
  .then(() => console.log('✅ Database ping successful'))
  .catch(err => console.log('❌ Database error:', err.message))
  .finally(() => process.exit());
"
```

### Debug API Endpoints
```bash
# Test specific endpoints
curl -X GET https://your-app-domain.com/health
curl -X GET https://your-app-domain.com/api

# Test authentication
curl -X POST https://your-app-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

## 📊 Performance Monitoring

### Basic Monitoring
```bash
# Check response times
time curl -s https://your-app-domain.com/health > /dev/null

# Monitor specific endpoints
while true; do
  echo "$(date): $(curl -s -w '%{time_total}' -o /dev/null https://your-app-domain.com/health)s"
  sleep 30
done
```

### Advanced Monitoring (if Sentry is configured)
```bash
# Check Sentry configuration
node -e "
require('dotenv').config();
console.log('Sentry DSN:', process.env.SENTRY_DSN ? 'Configured' : 'Not configured');
"
```

## 🔄 Deployment Workflow

### Complete Deployment Process
```bash
# 1. Validate environment
npm run validate:env

# 2. Run tests locally
npm test

# 3. Build application
npm run build:full

# 4. Set up database (first time only)
npm run setup:indexes

# 5. Deploy to platform
git add .
git commit -m "Production deployment"
git push origin main  # For Render auto-deploy

# 6. Test deployment
sleep 60  # Wait for deployment to complete
npm run test:production

# 7. Monitor health
curl -f https://your-app-domain.com/health
```

### Rollback Process
```bash
# Heroku rollback
heroku rollback

# Railway rollback
railway rollback

# Render rollback (via dashboard or API)
curl -X POST "https://api.render.com/deploy/srv-YOUR_SERVICE_ID?key=YOUR_DEPLOY_KEY&clear_cache=true"
```

## ⚙️ Environment Management

### Development Environment
```bash
# Copy example environment
cp .env.example .env

# Generate JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### Production Environment
```bash
# Validate production environment
NODE_ENV=production npm run validate:env

# Generate production environment template
node validate-environment.js --template > .env.production.template
```

## 🔐 Security Commands

### SSL/HTTPS Verification
```bash
# Check SSL certificate
openssl s_client -connect your-app-domain.com:443 -servername your-app-domain.com

# Check security headers
curl -I https://your-app-domain.com/health
```

### API Key Validation
```bash
# Test Paystack key format
node -e "
const key = process.env.PAYSTACK_SECRET_KEY;
console.log('Paystack key valid:', key?.startsWith('sk_test_') || key?.startsWith('sk_live_'));
"

# Test Google Maps key format
node -e "
const key = process.env.GOOGLE_MAPS_API_KEY;
console.log('Google Maps key valid:', key?.startsWith('AIza'));
"
```

## 📞 Support & Debugging

### Common Issues & Solutions

#### Issue: "Demo Mode" still showing
```bash
# Solution: Update start command in deployment platform
# Render: Change from "node demo-server.js" to "node server.js"
# Heroku: Update Procfile
# Railway: Update railway.json
```

#### Issue: Database connection failed
```bash
# Debug database connection
npm run setup:indexes
# Check MongoDB Atlas IP whitelist
# Verify connection string format
```

#### Issue: Environment variables not set
```bash
# Platform-specific environment variable commands
# Render: Set in dashboard
# Heroku: heroku config:set VAR_NAME=value
# Railway: railway variables:set VAR_NAME value
```

#### Issue: Build failures
```bash
# Check Node.js version compatibility
node --version  # Should be 18.x
npm --version   # Should be 9.x

# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Quick Start Commands

For immediate deployment to fix authentication:

```bash
# 1. Set up MongoDB Atlas (get connection string)
# 2. Validate your setup
npm run validate:env

# 3. Deploy (choose your platform)
# Render: git push origin main
# Heroku: git push heroku main  
# Railway: railway up

# 4. Test immediately
npm run test:production
```

**Your carpool backend will be production-ready!** 🚀
