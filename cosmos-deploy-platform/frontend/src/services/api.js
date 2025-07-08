/**
 * API Service
 * 
 * This file provides a centralized API client for making requests to the backend.
 * It handles authentication, error handling, and response formatting.
 */

import axios from 'axios';

// API base URL from environment or default to production URL
const API_URL = process.env.REACT_APP_API_URL || 'https://beta.syncron.network/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      // Clear stored credentials and redirect to login if needed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Authentication Service
 */
export const authService = {
  // User registration
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return handleAuthResponse(response);
  },
  
  // User login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return handleAuthResponse(response);
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    return await apiClient.put('/auth/updatedetails', userData);
  },
  
  // Update password
  updatePassword: async (passwordData) => {
    return await apiClient.put('/auth/updatepassword', passwordData);
  },
  
  // Logout
  logout: async () => {
    // API call to logout
    await apiClient.get('/auth/logout');
    
    // Clean up local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Network Service
 */
export const networkService = {
  // Get all networks
  getAllNetworks: async () => {
    return await apiClient.get('/networks');
  },
  
  // Get single network by ID
  getNetwork: async (id) => {
    return await apiClient.get(`/networks/${id}`);
  },
  
  // Create new network
  createNetwork: async (networkData) => {
    return await apiClient.post('/networks', networkData);
  },
  
  // Update network
  updateNetwork: async (id, networkData) => {
    return await apiClient.put(`/networks/${id}`, networkData);
  },
  
  // Delete network
  deleteNetwork: async (id) => {
    return await apiClient.delete(`/networks/${id}`);
  },
  
  // Deploy network
  deployNetwork: async (id) => {
    return await apiClient.post(`/networks/${id}/deploy`);
  },
  
  // Backup network
  backupNetwork: async (id) => {
    return await apiClient.post(`/networks/${id}/backup`);
  },
  
  // Restore network from backup
  restoreNetwork: async (id, backupId) => {
    return await apiClient.post(`/networks/${id}/restore/${backupId}`);
  }
};

/**
 * Health Service
 */
export const healthService = {
  // Check API health
  checkHealth: async () => {
    return await apiClient.get('/health');
  }
};

/**
 * Helper function to handle authentication responses
 * @param {Object} response - Axios response object
 * @returns {Object} Processed response data
 */
const handleAuthResponse = (response) => {
  // Store token and user data in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export default {
  apiClient,
  authService,
  networkService,
  healthService
};
