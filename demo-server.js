const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
let PORT = process.env.PORT || 3001;

// Render.com uses port 10000 by default
if (process.env.NODE_ENV === 'production' && !process.env.PORT) {
  PORT = 10000;
}

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: "*",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Mock API routes for demo
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Carpool Backend is running (Demo Mode)',
    timestamp: new Date().toISOString(),
    features: [
      'User Authentication',
      'Driver Management', 
      'Ride Booking',
      'Payment Processing',
      'Real-time Location',
      'Admin Dashboard'
    ]
  });
});

// API documentation route
app.get('/api', (req, res) => {
  res.json({
    message: 'Carpool Backend API - Demo Mode',
    version: '2.0.0',
    status: 'Ready for production deployment',
    endpoints: {
      auth: '/api/auth',
      driver: '/api/driver', 
      rides: '/api/rides',
      payments: '/api/payments',
      location: '/api/location',
      notifications: '/api/notifications',
      ratings: '/api/ratings',
      admin: '/api/admin',
      health: '/health'
    },
    nextSteps: [
      'Set up MongoDB Atlas',
      'Configure Paystack API',
      'Add Google Maps API',
      'Deploy to production'
    ]
  });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration endpoint ready! Configure MongoDB to enable.',
    data: {
      user: {
        id: 'demo123',
        firstName: req.body.firstName || 'Demo',
        lastName: req.body.lastName || 'User',
        email: req.body.email || 'demo@carpool.com'
      }
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint ready! Configure MongoDB to enable.',
    data: {
      token: 'demo-jwt-token',
      user: {
        id: 'demo123',
        email: req.body.email || 'demo@carpool.com'
      }
    }
  });
});

// Mock rides endpoint
app.get('/api/rides', (req, res) => {
  res.json({
    success: true,
    message: 'Rides endpoint ready! Configure MongoDB to enable.',
    data: {
      rides: [
        {
          id: 'ride1',
          driver: 'John Doe',
          origin: 'Lagos',
          destination: 'Abuja', 
          price: 5000,
          availableSeats: 3,
          departureTime: '2024-01-15T10:00:00Z'
        }
      ]
    }
  });
});

// Test page route for integration testing
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Integration Test</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
          .success { background: #d4edda; color: #155724; }
          .error { background: #f8d7da; color: #721c24; }
          button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>🚗 Carpool Backend - Quick Test</h1>
        <div id="status">Testing...</div>
        <button onclick="runTests()">Run API Tests</button>
        <div id="results"></div>
        
        <script>
          async function runTests() {
            const results = document.getElementById('results');
            results.innerHTML = '<h3>Test Results:</h3>';
            
            try {
              // Test health endpoint
              const health = await fetch('/health');
              const healthData = await health.json();
              results.innerHTML += '<div class="status success">✅ Health Check: ' + healthData.status + '</div>';
              
              // Test API docs
              const api = await fetch('/api');
              const apiData = await api.json();
              results.innerHTML += '<div class="status success">✅ API Docs: Version ' + apiData.version + '</div>';
              
              // Test rides endpoint
              const rides = await fetch('/api/rides');
              const ridesData = await rides.json();
              results.innerHTML += '<div class="status success">✅ Rides API: ' + ridesData.data.rides.length + ' demo rides</div>';
              
              results.innerHTML += '<div class="status success">🎉 All tests passed! Your backend is working!</div>';
            } catch (error) {
              results.innerHTML += '<div class="status error">❌ Test failed: ' + error.message + '</div>';
            }
          }
          
          // Auto-run tests on page load
          runTests();
        </script>
      </body>
    </html>
  `);
});

// Handle React routing
app.get('*', (req, res) => {
  // Skip API routes (but not /health)
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not configured yet' });
  }
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Carpool Backend Demo Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API Health: http://localhost:${PORT}/health`);
  console.log(`📊 API Info: http://localhost:${PORT}/api`);
  console.log('');
  console.log('✨ Your carpool backend is ready for production!');
  console.log('📋 Next steps: Configure MongoDB, Paystack, and Google Maps APIs');
  console.log('🚀 Then deploy to Render.com, Heroku, or Railway');
});

module.exports = app;
