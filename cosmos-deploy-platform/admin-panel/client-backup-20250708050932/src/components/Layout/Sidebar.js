import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Collapse,
  ListItemButton
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const DRAWER_WIDTH = 260;

const Sidebar = ({ open, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [systemOpen, setSystemOpen] = React.useState(true);

  const handleSystemClick = () => {
    setSystemOpen(!systemOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSystemRoute = () => {
    return location.pathname.startsWith('/system');
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 72,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        overflowX: 'hidden',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : 72,
          overflowX: 'hidden',
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        },
      }}
    >
      <Box sx={{ height: (theme) => theme.mixins.toolbar }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
        <List sx={{ flexGrow: 1 }}>
          {/* Dashboard */}
          <ListItem 
            button 
            onClick={() => navigate('/dashboard')}
            selected={isActive('/dashboard')}
            sx={{ 
              my: 0.5, 
              borderRadius: open ? '0 24px 24px 0' : 1,
              ml: open ? 1 : 0.5,
              mr: open ? 1 : 0.5,
              pl: open ? 2 : 2.5,
              backgroundColor: isActive('/dashboard') ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40, 
                color: isActive('/dashboard') ? 'primary.main' : 'inherit'
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              sx={{ 
                opacity: open ? 1 : 0,
                color: isActive('/dashboard') ? 'primary.main' : 'inherit',
                fontWeight: isActive('/dashboard') ? 'bold' : 'normal'
              }} 
            />
          </ListItem>

          {/* Users */}
          <ListItem 
            button 
            onClick={() => navigate('/users')}
            selected={isActive('/users')}
            sx={{ 
              my: 0.5, 
              borderRadius: open ? '0 24px 24px 0' : 1,
              ml: open ? 1 : 0.5,
              mr: open ? 1 : 0.5,
              pl: open ? 2 : 2.5,
              backgroundColor: isActive('/users') ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40, 
                color: isActive('/users') ? 'primary.main' : 'inherit'
              }}
            >
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Users" 
              sx={{ 
                opacity: open ? 1 : 0,
                color: isActive('/users') ? 'primary.main' : 'inherit',
                fontWeight: isActive('/users') ? 'bold' : 'normal'
              }} 
            />
          </ListItem>

          {/* Networks */}
          <ListItem 
            button 
            onClick={() => navigate('/networks')}
            selected={isActive('/networks')}
            sx={{ 
              my: 0.5, 
              borderRadius: open ? '0 24px 24px 0' : 1,
              ml: open ? 1 : 0.5,
              mr: open ? 1 : 0.5,
              pl: open ? 2 : 2.5,
              backgroundColor: isActive('/networks') ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40, 
                color: isActive('/networks') ? 'primary.main' : 'inherit'
              }}
            >
              <NetworkCheckIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Networks" 
              sx={{ 
                opacity: open ? 1 : 0,
                color: isActive('/networks') ? 'primary.main' : 'inherit',
                fontWeight: isActive('/networks') ? 'bold' : 'normal'
              }} 
            />
          </ListItem>

          <Divider sx={{ my: 1, opacity: open ? 1 : 0 }} />

          {/* System */}
          <ListItemButton
            onClick={handleSystemClick}
            sx={{ 
              my: 0.5, 
              borderRadius: open ? '0 24px 24px 0' : 1,
              ml: open ? 1 : 0.5,
              mr: open ? 1 : 0.5,
              pl: open ? 2 : 2.5,
              backgroundColor: isSystemRoute() ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40, 
                color: isSystemRoute() ? 'primary.main' : 'inherit'
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="System" 
              sx={{ 
                opacity: open ? 1 : 0,
                color: isSystemRoute() ? 'primary.main' : 'inherit',
                fontWeight: isSystemRoute() ? 'bold' : 'normal'
              }} 
            />
            {open && (systemOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          
          <Collapse in={open && systemOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={isActive('/system/logs')}
                onClick={() => navigate('/system/logs')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Logs" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={isActive('/system/status')}
                onClick={() => navigate('/system/status')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <MonitorHeartIcon />
                </ListItemIcon>
                <ListItemText primary="Status" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>

        <Box sx={{ p: 2, opacity: open ? 1 : 0 }}>
          <Box
            sx={{
              backgroundColor: 'background.dark',
              color: 'text.secondary',
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              mb: 2
            }}
          >
            <StorageIcon sx={{ mb: 1 }} />
            <ListItemText 
              primary="Local Admin Panel" 
              secondary="Server Access Only" 
              primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;