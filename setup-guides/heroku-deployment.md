# Heroku Deployment Guide

## Prerequisites
- Git installed on your computer
- Heroku CLI installed
- All external services configured (MongoDB, Paystack, Google Maps)

## Step 1: Install Heroku CLI

### Windows:
1. Download from [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
2. Run the installer
3. Restart your terminal

### Verify Installation:
```bash
heroku --version
```

## Step 2: Login to Heroku

```bash
heroku login
```
This will open your browser to log in.

## Step 3: Create Heroku Application

```bash
# Create a new app (replace 'your-carpool-app' with your preferred name)
heroku create your-carpool-app

# Or let Heroku generate a name
heroku create
```

## Step 4: Set Environment Variables

Set all your environment variables on Heroku:

```bash
# Database
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/carpool?retryWrites=true&w=majority"

# JWT
heroku config:set JWT_SECRET="your-super-secure-jwt-secret-key"
heroku config:set JWT_EXPIRE="30d"

# Paystack
heroku config:set PAYSTACK_SECRET_KEY="sk_test_your_paystack_secret_key"
heroku config:set PAYSTACK_PUBLIC_KEY="pk_test_your_paystack_public_key"

# Google Maps
heroku config:set GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
heroku config:set GOOGLE_PLACES_API_KEY="your_google_places_api_key"

# App Configuration
heroku config:set NODE_ENV="production"
heroku config:set FRONTEND_URL="https://your-carpool-app.herokuapp.com"
heroku config:set BASE_URL="https://your-carpool-app.herokuapp.com"

# Rate Limiting
heroku config:set RATE_LIMIT_WINDOW_MS="900000"
heroku config:set RATE_LIMIT_MAX_REQUESTS="100"
```

## Step 5: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

## Step 6: Deploy to Heroku

```bash
# Add Heroku as a remote
heroku git:remote -a your-carpool-app

# Deploy
git push heroku main
```

## Step 7: Verify Deployment

```bash
# Open your app in browser
heroku open

# Check logs if there are issues
heroku logs --tail

# Check app status
heroku ps
```

## Step 8: Test Your Live API

Test these endpoints with your live URL:

```bash
# Health check
curl https://your-carpool-app.herokuapp.com/health

# API info
curl https://your-carpool-app.herokuapp.com/
```

## Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Open app in browser
heroku open

# View config vars
heroku config

# Scale dynos
heroku ps:scale web=1

# Run commands on Heroku
heroku run node -e "console.log('Hello from Heroku')"
```

## Troubleshooting

### Common Issues:

1. **Build Failed**:
   ```bash
   # Check build logs
   heroku logs --tail
   ```

2. **App Crashed**:
   ```bash
   # Check error logs
   heroku logs --tail
   # Restart app
   heroku restart
   ```

3. **Database Connection Issues**:
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas network access settings
   - Ensure database user has correct permissions

4. **Environment Variables**:
   ```bash
   # Check all config vars
   heroku config
   ```

## Setting Up Custom Domain (Optional)

```bash
# Add custom domain
heroku domains:add www.your-domain.com

# Check DNS targets
heroku domains
```

Then update your DNS provider to point to the Heroku DNS target.

## Monitoring and Scaling

1. **View App Metrics**: Go to Heroku Dashboard → Your App → Metrics
2. **Scale Up**: `heroku ps:scale web=2` (increases to 2 dynos)
3. **Add Monitoring**: Consider add-ons like New Relic or Papertrail

## Cost Considerations

- **Free Tier**: 550-1000 free dyno hours per month
- **Paid Plans**: Start at $7/month for Hobby plan (no sleep)
- **Add-ons**: May have additional costs

## ✅ Deployment Checklist

- [ ] Heroku CLI installed
- [ ] Heroku account created
- [ ] App created on Heroku
- [ ] All environment variables set
- [ ] Code pushed to Heroku
- [ ] App deployed successfully
- [ ] Health check passes
- [ ] API endpoints working
- [ ] Frontend loads correctly

Your carpool app is now live on Heroku! 🚀
