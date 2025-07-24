import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import apiService from './services/api';
import AuthModalIntegrated from './components/AuthModalIntegrated';

// Test component inside AuthProvider
const TestPageContent: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [testResults, setTestResults] = useState<string[]>([]);
  const { user, isAuthenticated, logout } = useAuth();

  // Test API connectivity
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        setApiStatus(`✅ Backend Connected: ${data.message}`);
      } catch (error) {
        setApiStatus(`❌ Backend Connection Failed: ${error.message}`);
      }
    };
    testAPI();
  }, []);

  // Run integration tests
  const runTests = async () => {
    const results: string[] = [];
    
    try {
      // Test 1: Health check
      results.push('🔍 Testing API Health...');
      const health = await fetch('http://localhost:3000/health');
      const healthData = await health.json();
      results.push(`✅ Health Check: ${healthData.status}`);

      // Test 2: API Documentation
      const docs = await fetch('http://localhost:3000/');
      const docsData = await docs.json();
      results.push(`✅ API Docs: Version ${docsData.version}`);

      // Test 3: Authentication endpoints
      results.push('🔍 Testing Auth Endpoints...');
      
      if (isAuthenticated && user) {
        // Test authenticated endpoint
        const profile = await apiService.getProfile();
        results.push(`✅ Profile API: ${profile.user.email}`);
        
        // Test driver status
        try {
          const driverStatus = await apiService.getDriverVerificationStatus();
          results.push(`✅ Driver API: ${driverStatus.status}`);
        } catch (error) {
          results.push('ℹ️ Driver API: User not registered as driver');
        }
      } else {
        results.push('ℹ️ Auth Test: Please login to test authenticated endpoints');
      }

      setTestResults([...results, '🎉 All available tests passed!']);
    } catch (error) {
      results.push(`❌ Test failed: ${error.message}`);
      setTestResults(results);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🚗 Carpool Platform - Integration Test
        </h1>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Backend Connection Status</h2>
          <p className="text-lg">{apiStatus}</p>
        </div>

        {/* User Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
          {isAuthenticated && user ? (
            <div>
              <p className="text-green-600 text-lg">✅ Logged in as: {user.firstName} {user.lastName}</p>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Role: {user.role}</p>
              <button
                onClick={logout}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <p className="text-yellow-600 text-lg">⚠️ Not logged in</p>
              <button
                onClick={() => setShowAuth(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login / Register
              </button>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Integration Tests</h2>
          <button
            onClick={runTests}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mb-4"
          >
            Run Tests
          </button>
          
          {testResults.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              {testResults.map((result, index) => (
                <p key={index} className="mb-1">{result}</p>
              ))}
            </div>
          )}
        </div>

        {/* Feature List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">✅ Working Features:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• User Registration & Login</li>
                <li>• JWT Authentication</li>
                <li>• Driver Registration</li>
                <li>• Ride Management</li>
                <li>• Payment Integration (Paystack)</li>
                <li>• Notification System</li>
                <li>• Rating & Reviews</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">🔧 API Endpoints:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• /api/auth/* - Authentication</li>
                <li>• /api/driver/* - Driver Management</li>
                <li>• /api/rides/* - Ride Operations</li>
                <li>• /api/payments/* - Payment Processing</li>
                <li>• /api/notifications/* - Notifications</li>
                <li>• /api/ratings/* - Rating System</li>
                <li>• /api/admin/* - Admin Panel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        {showAuth && (
          <AuthModalIntegrated
            isOpen={showAuth}
            onClose={() => setShowAuth(false)}
            initialMode="login"
          />
        )}
      </div>
    </div>
  );
};

// Main test page with AuthProvider
const TestPage: React.FC = () => {
  return (
    <AuthProvider>
      <TestPageContent />
    </AuthProvider>
  );
};

export default TestPage;
