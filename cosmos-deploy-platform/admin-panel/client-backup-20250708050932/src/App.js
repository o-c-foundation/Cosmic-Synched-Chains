import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

// Layout components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

// Pages
import Dashboard from './components/Dashboard/Dashboard';
import UsersList from './components/Users/UsersList';
import UserDetails from './components/Users/UserDetails';
import NetworksList from './components/Networks/NetworksList';
import NetworkDetails from './components/Networks/NetworkDetails';
import SystemLogs from './components/System/SystemLogs';
import SystemStatus from './components/System/SystemStatus';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          mt: 8,
          backgroundColor: 'background.default',
          overflowY: 'auto'
        }}
      >
        <Routes>
          {/* Default route redirects to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Users */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          
          {/* Networks */}
          <Route path="/networks" element={<NetworksList />} />
          <Route path="/networks/:id" element={<NetworkDetails />} />
          
          {/* System */}
          <Route path="/system/logs" element={<SystemLogs />} />
          <Route path="/system/status" element={<SystemStatus />} />
          
          {/* 404 route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;