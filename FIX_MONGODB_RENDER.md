# 🔧 Fix MongoDB Atlas Connection for Render

## The Issue
```
MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
```

This means Render cannot connect to MongoDB Atlas due to network restrictions.

## Quick Fix (2 minutes)

### Step 1: Update MongoDB Atlas Network Access
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click your project → **Network Access** (left sidebar)
3. Click **"+ Add IP Address"**
4. Select **"Allow Access from Anywhere"** 
5. IP Address: `0.0.0.0/0`
6. Comment: `Render deployment access`
7. Click **"Confirm"**

### Step 2: Verify Connection String in Render
1. Go to Render Dashboard
2. Your service → **Environment** tab
3. Check `MONGODB_URI` value matches:
   ```
   mongodb+srv://sandraallen3031:ridealongflo@cluster0.zfzhnnv.mongodb.net/carpool?retryWrites=true&w=majority&appName=Cluster0
   ```

### Step 3: Add Database Name
If the connection string doesn't have `/carpool`, add it:
```
mongodb+srv://sandraallen3031:ridealongflo@cluster0.zfzhnnv.mongodb.net/carpool?retryWrites=true&w=majority&appName=Cluster0
```

## Advanced Fix (if still failing)

### Option 1: Test Connection String
1. MongoDB Atlas → Connect → Drivers
2. Copy the NEW connection string
3. Replace `<password>` with: `ridealongflo`
4. Add `/carpool` after `.net`

### Option 2: Create New Database User
1. MongoDB Atlas → Database Access
2. Add New Database User
3. Username: `renderuser`
4. Password: Generate strong password
5. Privileges: **Read and write to any database**
6. Update connection string with new credentials

## Test After Fix
Wait 2-3 minutes after making changes, then test:
```
GET https://carpool-backend1-3.onrender.com/health
POST https://carpool-backend1-3.onrender.com/api/auth/register
```

## Expected Log Output (Success)
```
Attempting to connect to database...
Connected to MongoDB
Server is running on port 10000
```
