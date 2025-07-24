# 🌐 Browser Testing Guide

## 🚀 Your App is Running!

**Frontend (Development)**: [http://localhost:5173/](http://localhost:5173/)
**Backend API**: [http://localhost:3000/](http://localhost:3000/)

## 📋 Testing Steps

### **Step 1: Open Your Browser**
1. Open your web browser
2. Navigate to: **http://localhost:5173/**
3. You should see the "Carpool Platform - Integration Test" page

### **Step 2: Test Backend Connectivity**
- Check the "Backend Connection Status" section
- Should show: ✅ Backend Connected: Carpool Backend is running

### **Step 3: Test Authentication**
1. Click the **"Login / Register"** button
2. Try registering a new user:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: 08012345678
   - Password: password123
   - Date of Birth: 1990-01-01
   - Gender: Male

3. After successful registration, you should see:
   - ✅ Logged in as: Test User
   - Email and role displayed

### **Step 4: Run Integration Tests**
1. Click the **"Run Tests"** button
2. You should see:
   - ✅ Health Check: OK
   - ✅ API Docs: Version 2.0.0
   - ✅ Profile API: test@example.com
   - ℹ️ Driver API: User not registered as driver
   - 🎉 All available tests passed!

### **Step 5: Test Driver Registration**
1. While logged in, open browser developer tools (F12)
2. Go to Console tab
3. Run this command to test driver registration:
   ```javascript
   // Test driver registration
   fetch('http://localhost:3000/api/driver/register', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
     },
     body: JSON.stringify({
       licenseNumber: 'TEST123456',
       vehicle: {
         make: 'Toyota',
         model: 'Camry',
         year: 2022,
         licensePlate: 'TEST-001',
         color: 'Blue'
       }
     })
   })
   .then(res => res.json())
   .then(data => console.log('Driver Registration:', data));
   ```

4. Run tests again to see driver status change

### **Step 6: Test Ride Creation**
1. In browser console, test ride creation:
   ```javascript
   // Test ride creation
   fetch('http://localhost:3000/api/rides', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
     },
     body: JSON.stringify({
       origin: {
         address: 'Victoria Island, Lagos',
         latitude: 6.4281,
         longitude: 3.4219
       },
       destination: {
         address: 'Ikeja, Lagos',
         latitude: 6.5958,
         longitude: 3.3488
       },
       departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
       availableSeats: 3,
       pricePerSeat: 2500,
       notes: 'Test ride from browser'
     })
   })
   .then(res => res.json())
   .then(data => console.log('Ride Creation:', data));
   ```

### **Step 7: Test Ride Search**
1. Test ride search:
   ```javascript
   // Test ride search
   fetch('http://localhost:3000/api/rides?origin=Victoria&destination=Ikeja', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
     }
   })
   .then(res => res.json())
   .then(data => console.log('Ride Search:', data));
   ```

## 🔍 What to Look For

### **✅ Success Indicators:**
- Green checkmarks in test results
- User can register and login
- Authentication persists on page refresh
- API calls return data without errors
- Console shows successful responses

### **❌ Common Issues & Solutions:**

1. **CORS Errors:**
   - Make sure backend is running on port 3000
   - Check that CORS is configured for localhost:5173

2. **Network Errors:**
   - Verify both servers are running
   - Check firewall settings

3. **Authentication Errors:**
   - Clear browser localStorage: `localStorage.clear()`
   - Try registering with different email

4. **Build Errors:**
   - Run `npm install` in frontend directory
   - Check for TypeScript errors

## 🎯 Advanced Testing

### **Test Real Components:**
To test your actual UI components instead of the test page:

1. Edit `src/main.tsx`:
   ```tsx
   import App from './App.tsx'; // Change back to App
   
   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <App />
     </StrictMode>
   );
   ```

2. Your integrated components are available:
   - `AuthModalIntegrated`
   - `SearchRidesIntegrated`
   - API service in `services/api.ts`
   - Auth context in `contexts/AuthContext.tsx`

### **Test API Endpoints Directly:**
Visit these URLs in your browser (while logged in):

- Backend API Docs: http://localhost:3000/
- Health Check: http://localhost:3000/health

## 📱 Production Testing

To test the production build:

1. **Build frontend:**
   ```bash
   npm run build
   ```

2. **Set production mode:**
   ```bash
   # In backend directory
   set NODE_ENV=production
   ```

3. **Restart backend:**
   - Backend will now serve the built frontend
   - Visit: http://localhost:3000/

## 🎊 Success!

If all tests pass, your integration is working perfectly! Your carpool platform has:

- ✅ Working authentication
- ✅ API connectivity  
- ✅ Real-time features ready
- ✅ Payment integration setup
- ✅ Database persistence
- ✅ Production-ready build

## 🚀 Next Steps

1. **Customize the UI** with your branding
2. **Add real API keys** for Paystack and Google Maps
3. **Deploy to production** 
4. **Add more features** using the established patterns

Happy testing! 🎉
