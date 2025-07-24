# Carpool Backend Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: Create a free MongoDB Atlas cluster
2. **Paystack Account**: Get your API keys from Paystack dashboard
3. **Google Cloud Console**: Enable Maps/Places APIs and get API keys
4. **Hosting Platform**: Choose between Heroku, Railway, Render, or AWS

## Environment Variables for Production

Update your `.env` file with production values:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carpool?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-chars
PAYSTACK_SECRET_KEY=sk_live_your_live_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_paystack_public_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=https://your-frontend-domain.com
BASE_URL=https://your-backend-domain.com
```

## Deployment Options

### Option 1: Heroku (Recommended for beginners)

1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Add MongoDB Atlas add-on or use your own cluster
4. Set environment variables: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

### Option 2: Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Auto-deploy on git push

### Option 3: Render

1. Connect GitHub repository
2. Set environment variables
3. Choose Node.js environment
4. Deploy automatically

## Pre-deployment Checklist

- [ ] Update all environment variables with production values
- [ ] Test all API endpoints
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure Paystack webhooks
- [ ] Set up domain and SSL certificate
- [ ] Configure CORS for production frontend URL
- [ ] Test payment integration
- [ ] Set up monitoring and logging

## Post-deployment Steps

1. Test all API endpoints in production
2. Set up monitoring (e.g., Uptime Robot)
3. Configure backup strategy for database
4. Set up error tracking (e.g., Sentry)
5. Document API for frontend team
