import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // If we have both token and stored user data
      if (token && storedUser) {
        try {
          // Set the user from localStorage immediately for fast rendering
          setCurrentUser(JSON.parse(storedUser));
          
          // Then verify with the server in the background
          const response = await authService.getCurrentUser();
          // Update with fresh data from server
          setCurrentUser(response.data.user);
        } catch (err) {
          console.error('Auth check failed:', err);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      } else if (token) {
        // If we have token but no user data
        try {
          const response = await authService.getCurrentUser();
          setCurrentUser(response.data.user);
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
        }
      } else if (storedUser) {
        // If we have user data but no token, clear it
        localStorage.removeItem('user');
      }
      
      setLoading(false);
      setInitialized(true);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      const { user } = response;
      
      // Update state
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      const { user } = response;
      
      // Update state
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Reset state regardless of API success
      setCurrentUser(null);
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    initialized,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};