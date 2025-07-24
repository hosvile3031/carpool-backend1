# 🚀 Quick MongoDB Atlas Setup (5 minutes)

## Step 1: Create MongoDB Atlas Account
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Click "Sign up free" or sign in with Google
3. Choose the **FREE** M0 cluster (512MB storage)

## Step 2: Create Database
1. Click "Build a Database"
2. Choose **FREE** shared cluster
3. Select closest region (e.g., AWS N. Virginia)
4. Keep default name or change to "carpool"
5. Click "Create"

## Step 3: Create Database User
1. Create username and password (save these!)
2. Example: username: `carpool-user`, password: `YourSecurePassword123`
3. Click "Create User"

## Step 4: Add IP Address
1. Choose "Add My Current IP Address"
2. Or add `0.0.0.0/0` for all IPs (less secure but works for development)
3. Click "Add Entry"

## Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string, it looks like:
   ```
   mongodb+srv://carpool-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://carpool-user:YourPassword@cluster0.xxxxx.mongodb.net/carpool?retryWrites=true&w=majority`

## Step 6: Test Connection (Optional)
Run this locally to test:
```bash
MONGODB_URI="your-connection-string" node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.log('❌ Error:', err.message));
"
```

## Step 7: Add to Render
1. Go to Render dashboard
2. Your service → Settings → Environment
3. Add: `MONGODB_URI = your-connection-string`
4. Click "Save Changes"

🎉 **Your authentication will work immediately after this setup!**
