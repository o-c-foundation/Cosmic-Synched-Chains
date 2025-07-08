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
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import Changelog from './pages/Changelog';
import HelpCenter from './pages/HelpCenter';
import Status from './pages/Status';
import Community from './pages/Community';
import Feedback from './pages/Feedback';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Licenses from './pages/Licenses';
import About from './pages/About';
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

// Auth-based redirect component
const AuthRedirect = () => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/" replace />;
};

// Public layout - used for LandingPage, Login, Signup
const PublicLayout = ({ children }) => {
  return children;
};

// Marketing layout - used for Features, Pricing, Documentation, Changelog
// This wraps with Layout but doesn't require authentication
const MarketingLayout = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
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
            <Route path="/features" element={<MarketingLayout><Features /></MarketingLayout>} />
            <Route path="/pricing" element={<MarketingLayout><Pricing /></MarketingLayout>} />
            <Route path="/documentation" element={<MarketingLayout><Documentation /></MarketingLayout>} />
            <Route path="/changelog" element={<MarketingLayout><Changelog /></MarketingLayout>} />
            
            {/* Informational Pages */}
            <Route path="/about" element={<MarketingLayout><About /></MarketingLayout>} />
            <Route path="/help" element={<MarketingLayout><HelpCenter /></MarketingLayout>} />
            <Route path="/status" element={<MarketingLayout><Status /></MarketingLayout>} />
            <Route path="/community" element={<MarketingLayout><Community /></MarketingLayout>} />
            <Route path="/feedback" element={<MarketingLayout><Feedback /></MarketingLayout>} />
            <Route path="/terms" element={<MarketingLayout><Terms /></MarketingLayout>} />
            <Route path="/privacy" element={<MarketingLayout><Privacy /></MarketingLayout>} />
            <Route path="/cookies" element={<MarketingLayout><Cookies /></MarketingLayout>} />
            <Route path="/licenses" element={<MarketingLayout><Licenses /></MarketingLayout>} />
            
            {/* Protected Routes */}
            
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
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route - redirect based on authentication */}
            <Route path="*" element={
              <AuthRedirect />
            } />
          </Routes>
        </Router>
      </NetworkProvider>
    </AuthProvider>
  );
};

export default App;