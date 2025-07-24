import React, { useState } from 'react';
import Header from './components/Header';
import SearchRides from './components/SearchRides';
import PostRide from './components/PostRide';
import MyBookings from './components/MyBookings';
import Profile from './components/Profile';
import AuthModalIntegrated from './components/AuthModalIntegrated';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ViewMode } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('search');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthRequired = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode === 'signin' ? 'login' : 'register');
    setShowAuthModal(true);
  };

  const handleSignOut = () => {
    logout();
    setCurrentView('search');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return <SearchRides user={user} onAuthRequired={handleAuthRequired} />;
      case 'post':
        return <PostRide user={user} onAuthRequired={handleAuthRequired} />;
      case 'bookings':
        return <MyBookings user={user} onAuthRequired={handleAuthRequired} />;
      case 'profile':
        return <Profile user={user} onAuthRequired={handleAuthRequired} onSignOut={handleSignOut} />;
      default:
        return <SearchRides user={user} onAuthRequired={handleAuthRequired} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        user={user}
        onAuthRequired={handleAuthRequired}
        onSignOut={handleSignOut}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModalIntegrated
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
