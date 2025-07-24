# 🔑 Complete Guide: Get All API Keys & Secrets

This guide will help you get all the required keys for your carpool app in about 20 minutes.

## 1️⃣ MongoDB Atlas URL (FREE - Required for authentication)

### Step-by-Step:
1. **Visit**: [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. **Sign Up**: Click "Try Free" → Use Google/GitHub or create account
3. **Create Cluster**: 
   - Choose "Build a Database"
   - Select **M0 Sandbox (FREE)**
   - Pick closest region (e.g., AWS N. Virginia)
   - Cluster name: `carpool-cluster`
   - Click "Create"

4. **Create Database User**:
   - Username: `carpool-user`
   - Password: Click "Autogenerate" or create strong password
   - **SAVE THIS PASSWORD!** ⚠️
   - Click "Create User"

5. **Network Access**:
   - Choose "Add My Current IP Address" 
   - Or add `0.0.0.0/0` (allows all IPs - easy for development)
   - Click "Add Entry"

6. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string:
   ```
   mongodb+srv://carpool-user:<password>@carpool-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name at the end:
   ```
   mongodb+srv://carpool-user:YourPassword@carpool-cluster.xxxxx.mongodb.net/carpool?retryWrites=true&w=majority
   ```

**✅ Your MongoDB URL is ready!**

---

## 2️⃣ JWT Secret (FREE - Required for authentication)

### What it is:
A secret key used to sign and verify user login tokens.

### How to generate:
**Option A: Online Generator**
1. Visit: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
2. Copy the generated secret

**Option B: Command Line**
```bash
node -e "console.log('carpool-jwt-secret-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9))"
```

**Option C: Manual**
Use something like: `carpool-super-secret-key-2024-change-this-in-production`

**✅ Your JWT Secret is ready!**

---

## 3️⃣ Paystack API Keys (FREE - Required for payments)

### Step-by-Step:
1. **Visit**: [https://paystack.com](https://paystack.com)
2. **Create Account**: 
   - Click "Create a free account"
   - Verify your email
   - Complete business profile

3. **Get API Keys**:
   - Go to Dashboard → Settings → API Keys
   - Copy **Test Secret Key** (starts with `sk_test_`)
   - Copy **Test Public Key** (starts with `pk_test_`)

4. **For Production** (when ready):
   - Submit documents for verification
   - Use **Live Secret Key** and **Live Public Key**

**Example keys look like:**
```
Secret Key: sk_test_1234567890abcdef1234567890abcdef12345678
Public Key: pk_test_1234567890abcdef1234567890abcdef12345678
```

**✅ Your Paystack keys are ready!**

---

## 4️⃣ Google Maps API Key (FREE tier available)

### Step-by-Step:
1. **Visit**: [https://console.cloud.google.com](https://console.cloud.google.com)
2. **Create Project**:
   - Click "Select a project" → "New Project"
   - Project name: `carpool-app`
   - Click "Create"

3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Enable these APIs:
     - ✅ **Maps JavaScript API**
     - ✅ **Geocoding API**
     - ✅ **Directions API**
     - ✅ **Places API**

4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key (looks like: `AIzaSyB1234567890abcdef...`)

5. **Secure Your Key** (Important!):
   - Click on your API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose the 4 APIs you enabled above
   - Under "Website restrictions", add your domain:
     - `https://carpool-backend1-1.onrender.com/*`
     - `http://localhost:3000/*` (for development)

**✅ Your Google Maps API key is ready!**

---

## 🚨 Google Maps Free Tier Limits:
- **$200 free credit monthly** (covers ~40,000+ requests)
- If you need more, you'll need to add billing
- For development/small apps, free tier is usually enough

---

## 📋 Final Checklist:

When you have all keys, add them to Render:

1. **Go to Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
2. **Your Service** → **Environment**
3. **Add these variables**:

```bash
# Database
MONGODB_URI=mongodb+srv://carpool-user:YourPassword@carpool-cluster.xxxxx.mongodb.net/carpool?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-generated-jwt-secret
JWT_EXPIRE=30d

# Payments
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key

# Maps
GOOGLE_MAPS_API_KEY=AIzaSyYour_Google_Maps_API_Key
GOOGLE_PLACES_API_KEY=AIzaSyYour_Google_Maps_API_Key

# App Configuration
NODE_ENV=production
BASE_URL=https://carpool-backend1-1.onrender.com
FRONTEND_URL=https://carpool-backend1-1.onrender.com

# Optional (Email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

4. **Click "Save Changes"**
5. **Your app will redeploy automatically**

---

## 🎉 That's it! 

Your carpool app will have:
- ✅ Real user registration/login
- ✅ Database storage
- ✅ Payment processing
- ✅ Location services
- ✅ Maps integration

**Total time**: ~20 minutes  
**Total cost**: FREE (with generous usage limits)

Need help with any specific step? Just ask!
