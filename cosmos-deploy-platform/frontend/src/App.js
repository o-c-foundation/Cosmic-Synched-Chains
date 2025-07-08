import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import NetworkCreation from './pages/NetworkCreation';
import NetworksList from './pages/NetworksList';
import NetworkDetails from './pages/NetworkDetails';
import Monitoring from './pages/Monitoring';
import Governance from './pages/Governance';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import { NetworkProvider } from './context/NetworkContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser, initialized } = useAuth();
  
  // Show nothing while checking authentication
  if (!initialized) {
    return null;
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public layout - used for LandingPage, Login, Signup
const PublicLayout = ({ children }) => {
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <NetworkProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/create-network" element={
              <ProtectedRoute>
                <Layout>
                  <NetworkCreation />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/networks" element={
              <ProtectedRoute>
                <Layout>
                  <NetworksList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/networks/:id" element={
              <ProtectedRoute>
                <Layout>
                  <NetworkDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/monitoring" element={
              <ProtectedRoute>
                <Layout>
                  <Monitoring />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/governance" element={
              <ProtectedRoute>
                <Layout>
                  <Governance />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route - redirect to dashboard if authenticated, otherwise to landing page */}
            <Route path="*" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </NetworkProvider>
    </AuthProvider>
  );
};

export default App;