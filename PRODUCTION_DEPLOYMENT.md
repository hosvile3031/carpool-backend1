# 🚀 Switch to Production Mode

## 🎯 What Changes in Production Mode?

### ✅ Demo Mode (Current)
- ❌ No database required
- ❌ Mock API responses
- ❌ Fake user authentication
- ❌ Demo data only

### 🚀 Production Mode (Full Features)
- ✅ Real MongoDB database
- ✅ Actual user registration & login
- ✅ Real ride creation & booking
- ✅ Payment processing (Paystack)
- ✅ File uploads (Cloudinary)
- ✅ Email notifications
- ✅ Real-time features (Socket.IO)

## 📋 Prerequisites

### 1. MongoDB Atlas Database
Follow the [MongoDB Atlas Setup Guide](./MONGODB_ATLAS_SETUP.md) to:
- ✅ Create free MongoDB Atlas account
- ✅ Create M0 cluster (free tier)
- ✅ Get connection string

### 2. Environment Variables (Required)
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret for JWT tokens (already set)
- `NODE_ENV=production`

### 3. Optional Services (for full features)
- **Paystack Account** - For payment processing
- **Google Cloud** - For Maps API
- **Cloudinary** - For image uploads

## 🔄 Deployment Steps

### Step 1: Set Up MongoDB Atlas
1. Follow the [MongoDB Atlas Setup Guide](./MONGODB_ATLAS_SETUP.md)
2. Copy your connection string

### Step 2: Update Render Environment
Go to your Render dashboard → Environment tab:

**Required Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://carpooluser:yourpassword@carpool-cluster.xxxxx.mongodb.net/carpool?retryWrites=true&w=majority
JWT_SECRET=carpool-super-secret-jwt-key-2024-production-grade-change-this
```

**Optional Variables:**
```
PAYSTACK_SECRET_KEY=sk_test_your_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

### Step 3: Update Start Command
In Render dashboard → Settings:
- **Start Command**: `node server.js`

### Step 4: Deploy
- Click **"Manual Deploy"** → **"Deploy latest commit"**
- Watch logs for successful database connection

## 🧪 Testing Production Mode

### Test User Registration
```bash
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

### Test User Login
```bash
curl -X POST https://your-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Expected Production Features
- ✅ **Real user accounts** stored in MongoDB
- ✅ **JWT authentication** with actual tokens
- ✅ **Password hashing** with bcrypt
- ✅ **Ride creation** saved to database
- ✅ **User profiles** with real data
- ✅ **Admin panel** functionality

## 🔧 Local Testing

Test production mode locally:
```bash
# Make sure MongoDB Atlas connection string is in .env
npm run production

# Or with environment variables
NODE_ENV=production MONGODB_URI=your_connection_string npm start
```

## 🚨 Troubleshooting

### Database Connection Issues
```
MongoNetworkError: failed to connect to server
```
**Solutions:**
- ✅ Check MongoDB Atlas IP allowlist includes `0.0.0.0/0`
- ✅ Verify connection string format
- ✅ Ensure database user has correct permissions
- ✅ Check password doesn't need URL encoding

### JWT Token Issues
```
JsonWebTokenError: invalid signature
```
**Solutions:**
- ✅ Ensure `JWT_SECRET` is set in environment variables
- ✅ Use same JWT_SECRET across all instances
- ✅ Clear browser localStorage if testing

### API Route Not Found
```
404 - API route not found
```
**Solutions:**
- ✅ Verify all route files exist in `/routes` folder
- ✅ Check imports in `server.js`
- ✅ Ensure frontend build completed successfully

## 🎉 Success Indicators

Your app is in production mode when:
- ✅ Database connection shows: `"Connected to MongoDB"`
- ✅ User registration creates actual database records
- ✅ JWT tokens are real and verify correctly
- ✅ Ride data persists between sessions
- ✅ Health check shows: `"Carpool Backend is running"`

## 📊 Monitoring

### Check Render Logs
```bash
# In Render dashboard → Logs tab, look for:
✅ "Connected to MongoDB"
✅ "Server is running on port 10000" 
✅ "Environment: production"
```

### MongoDB Atlas Monitoring
- Monitor connections in Atlas dashboard
- Check database size and operations
- Review slow query logs

Your carpool platform is now running in full production mode! 🚗✨
