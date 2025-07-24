# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)
2. Click "Try Free" or "Start Free"
3. Sign up with your email or Google account
4. Verify your email address

## Step 2: Create a Cluster

1. **Choose Deployment Option**: Select "Database" from the left sidebar
2. **Create Deployment**: Click "Build a Database"
3. **Choose Tier**: Select "M0 Sandbox" (Free forever)
4. **Cloud Provider**: Choose "AWS" (recommended)
5. **Region**: Select closest region to your users
6. **Cluster Name**: Use "carpool-cluster" or any name you prefer
7. Click "Create"

## Step 3: Create Database User

1. In the "Security" section, click "Database Access"
2. Click "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: `carpool-admin` (or your choice)
5. **Password**: Generate a secure password (save this!)
6. **Database User Privileges**: Select "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in the Security section
2. Click "Add IP Address"
3. **For Development**: Click "Add Current IP Address"
4. **For Production**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: This is less secure but required for most hosting platforms
5. Click "Confirm"

## Step 5: Get Connection String

1. Go back to "Database" section
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string (looks like):
   ```
   mongodb+srv://carpool-admin:<password>@carpool-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your Environment Variables

Replace `<password>` with your actual password and update your `.env` file:

```env
MONGODB_URI=mongodb+srv://carpool-admin:YOUR_PASSWORD@carpool-cluster.xxxxx.mongodb.net/carpool?retryWrites=true&w=majority
```

## ✅ Test Connection

Run this command to test your database connection:
```bash
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_CONNECTION_STRING').then(() => console.log('✅ Connected to MongoDB!')).catch(err => console.error('❌ Connection failed:', err))"
```
