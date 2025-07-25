# 🚄 Railway MongoDB Setup (5 minutes)

## Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub/Google

## Step 2: Deploy MongoDB
1. Click "Deploy from Template"
2. Search for "MongoDB"
3. Select "MongoDB" template
4. Click "Deploy Now"

## Step 3: Get Connection String
1. Wait 2-3 minutes for deployment
2. Click on your MongoDB service
3. Go to "Variables" tab
4. Copy the `MONGO_URL` value
5. It looks like: `mongodb://mongo:password@monorail.proxy.rlwy.net:12345/railway`

## Step 4: Update Your App
Add to your `.env` file:
```
MONGODB_URI=mongodb://mongo:password@monorail.proxy.rlwy.net:12345/railway
```

## Step 5: Update Render
1. Go to Render dashboard
2. Environment variables
3. Update `MONGODB_URI` with Railway connection string
4. Save and redeploy

## ✅ Test
Your login should work immediately!

## 💰 Cost
- **FREE tier**: 500 hours/month
- **Storage**: 1GB free
- **Perfect for development**
