import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Badge, 
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNetworks: 0,
    activeNetworks: 0,
    unresolvedErrors: 0
  });

  useEffect(() => {
    // Fetch quick stats for header
    const fetchQuickStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/quick-stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching quick stats:', error);
      }
    };

    fetchQuickStats();

    // Refresh stats every 60 seconds
    const interval = setInterval(fetchQuickStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={toggleSidebar}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box 
            component="span"
            sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                color: 'primary.main',
                mr: 1,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              CSC
            </Box>
            Admin Panel
          </Box>
        </Typography>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
          <Chip 
            label={`Users: ${stats.totalUsers}`} 
            size="small" 
            onClick={() => navigate('/users')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip 
            label={`Networks: ${stats.totalNetworks}`} 
            size="small" 
            onClick={() => navigate('/networks')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip 
            label={`Active: ${stats.activeNetworks}`} 
            size="small" 
            color="success"
            sx={{ cursor: 'pointer' }}
          />
        </Box>

        {/* Icons */}
        <Box sx={{ display: 'flex' }}>
          <IconButton color="inherit" onClick={() => navigate('/system/logs')}>
            <Badge badgeContent={stats.unresolvedErrors} color="error">
              <ErrorIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/system/status')}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;