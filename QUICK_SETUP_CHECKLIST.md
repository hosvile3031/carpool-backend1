# ✅ Quick Setup Checklist

## 🎯 Goal: Fix authentication on your live site

### Step 1: Get API Keys (20 minutes total)

#### 1️⃣ MongoDB Atlas (5 minutes) - **MOST IMPORTANT**
- [ ] Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
- [ ] Create free account
- [ ] Create M0 (free) cluster 
- [ ] Create database user
- [ ] Get connection string
- [ ] **Result**: `mongodb+srv://username:password@cluster.mongodb.net/carpool`

#### 2️⃣ JWT Secret (30 seconds) - **REQUIRED**
- [ ] Use this generated one: `carpool-jwt-secret-1753396477616-jc5iu3oz0`
- [ ] Or generate new: `node -e "console.log('jwt-' + Date.now())"`

#### 3️⃣ Paystack (5 minutes) - **FOR PAYMENTS**  
- [ ] Go to [https://paystack.com](https://paystack.com)
- [ ] Create account
- [ ] Get test API keys from dashboard
- [ ] **Result**: `sk_test_...` and `pk_test_...`

#### 4️⃣ Google Maps (10 minutes) - **FOR LOCATION**
- [ ] Go to [https://console.cloud.google.com](https://console.cloud.google.com)
- [ ] Create project
- [ ] Enable Maps, Geocoding, Directions, Places APIs
- [ ] Create API key
- [ ] **Result**: `AIzaSy...`

---

### Step 2: Update Render (2 minutes)

#### Fix Demo Mode:
- [ ] Go to [https://dashboard.render.com](https://dashboard.render.com)
- [ ] Find your service: `carpool-backend1-1`
- [ ] Settings → Build & Deploy
- [ ] Change Start Command: `node demo-server.js` → `node server.js`

#### Add Environment Variables:
- [ ] Settings → Environment 
- [ ] Add these (minimum required):

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=carpool-jwt-secret-1753396477616-jc5iu3oz0
NODE_ENV=production
```

#### Optional (for full features):
```bash
PAYSTACK_SECRET_KEY=sk_test_your_key
PAYSTACK_PUBLIC_KEY=pk_test_your_key
GOOGLE_MAPS_API_KEY=AIzaSy_your_key
BASE_URL=https://carpool-backend1-1.onrender.com
FRONTEND_URL=https://carpool-backend1-1.onrender.com
```

- [ ] Click "Save Changes"
- [ ] Wait for redeploy (2-3 minutes)

---

### Step 3: Test (1 minute)

- [ ] Visit: `https://carpool-backend1-1.onrender.com/health`
- [ ] Should show "running" (not "Demo Mode")
- [ ] Try registration on your frontend
- [ ] Should work! 🎉

---

## 🚨 Priority Order:

**To fix authentication RIGHT NOW:**
1. **MongoDB Atlas** (absolutely required)
2. **JWT Secret** (already generated above)
3. **Update Render start command**

**For full features later:**
4. Paystack (payments)
5. Google Maps (location)

---

## ⏰ Time Estimate:
- **Minimum fix**: 10 minutes (MongoDB + Render update)
- **Full setup**: 25 minutes (all APIs)

---

## 🆘 Need Help?

**If you get stuck on any step, just tell me:**
- Which step you're on
- What error you're seeing
- I'll help you through it!

**Common issues:**
- MongoDB: Make sure to replace `<password>` in connection string
- Render: Environment variables need exact names (case sensitive)
- Google: Need to enable APIs before creating key

---

## 🎯 Success Check:

When done correctly:
✅ `https://carpool-backend1-1.onrender.com/health` shows real status
✅ Registration creates real user accounts  
✅ Login returns real JWT tokens
✅ All features work on live site

**Your authentication will be 100% functional!** 🚀
