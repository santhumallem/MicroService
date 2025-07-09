import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { User, LogOut, Settings, Shield, Users } from 'lucide-react';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import { authService } from './services/authService';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (result) => {
    setUser(result.user);
    setShowSignUp(false);
    setShowLogin(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="loading-spinner w-8 h-8 border-primary-600"></div>
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg mr-3"></div>
              <h1 className="text-xl font-bold text-gray-900">
                Cursor.ai Learning Example
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary text-sm py-2 px-3"
                  >
                    <LogOut size={16} className="mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="btn btn-secondary text-sm py-2 px-4"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="btn btn-primary text-sm py-2 px-4"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-soft p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome, {user.firstName}! 🎉
                </h2>
                <p className="text-gray-600 mb-6">
                  You have successfully registered and logged into the Cursor.ai learning example.
                </p>
                <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                  <Shield size={16} />
                  <span className="text-sm font-medium">
                    Email {user.emailVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user.firstName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-soft p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Settings size={24} className="text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Backend API
                </h4>
                <p className="text-gray-600 text-sm">
                  Complete Node.js/Express API with authentication, validation, and database integration.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-soft p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  React Frontend
                </h4>
                <p className="text-gray-600 text-sm">
                  Modern React application with form validation, state management, and beautiful UI.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-soft p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  PostgreSQL Database
                </h4>
                <p className="text-gray-600 text-sm">
                  Robust database schema with proper relationships, indexes, and security measures.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Cursor.ai Learning Example
              </h2>
              <p className="text-gray-600 mb-8">
                This is a complete full-stack application demonstrating how to use Cursor.ai 
                for rapid development. Sign up to explore the features!
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowSignUp(true)}
                  className="btn btn-primary w-full py-3 text-base font-medium"
                >
                  Get Started - Sign Up
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn btn-secondary w-full py-3 text-base font-medium"
                >
                  Already have an account? Log In
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Authentication Modals */}
      {showSignUp && (
        <SignUpForm
          onClose={() => setShowSignUp(false)}
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      )}

      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSuccess={handleAuthSuccess}
          onSwitchToSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}
    </div>
  );
}

export default App;