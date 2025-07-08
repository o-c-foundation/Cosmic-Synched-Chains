import React, { useState } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Collapse
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import MonitorIcon from '@mui/icons-material/Monitor';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SettingsIcon from '@mui/icons-material/Settings';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import UpdateIcon from '@mui/icons-material/Update';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GroupsIcon from '@mui/icons-material/Groups';
import GavelIcon from '@mui/icons-material/Gavel';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import CookieIcon from '@mui/icons-material/Cookie';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Determine if we're in a protected route or a marketing page
  const isProtectedRoute = currentUser && [
    '/dashboard',
    '/create-network',
    '/networks',
    '/monitoring',
    '/governance',
    '/settings'
  ].some(path => location.pathname.startsWith(path));
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // State for collapsible menu items
  const [openSubmenu, setOpenSubmenu] = useState('');

  const handleSubmenuToggle = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? '' : menu);
  };

  // Define menu items based on authentication state
  const protectedMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Create Network', icon: <AddCircleOutlineIcon />, path: '/create-network' },
    { text: 'My Networks', icon: <ViewListIcon />, path: '/networks' },
    { text: 'Monitoring', icon: <MonitorIcon />, path: '/monitoring' },
    { text: 'Governance', icon: <HowToVoteIcon />, path: '/governance' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];
  
  const publicMenuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Features', icon: <StarIcon />, path: '/features' },
    { text: 'Pricing', icon: <AttachMoneyIcon />, path: '/pricing' },
    { text: 'Documentation', icon: <DescriptionIcon />, path: '/documentation' },
    { text: 'Changelog', icon: <UpdateIcon />, path: '/changelog' },
    { 
      text: 'Resources', 
      icon: <InfoIcon />, 
      submenu: true,
      submenuItems: [
        { text: 'About Us', icon: <InfoIcon />, path: '/about' },
        { text: 'Help Center', icon: <HelpIcon />, path: '/help' },
        { text: 'System Status', icon: <MonitorIcon />, path: '/status' },
        { text: 'Community', icon: <GroupsIcon />, path: '/community' },
        { text: 'Feedback', icon: <FeedbackIcon />, path: '/feedback' }
      ]
    },
    { 
      text: 'Legal', 
      icon: <GavelIcon />, 
      submenu: true,
      submenuItems: [
        { text: 'Terms of Service', icon: <GavelIcon />, path: '/terms' },
        { text: 'Privacy Policy', icon: <PrivacyTipIcon />, path: '/privacy' },
        { text: 'Cookie Policy', icon: <CookieIcon />, path: '/cookies' },
        { text: 'Licenses', icon: <LibraryBooksIcon />, path: '/licenses' }
      ]
    }
  ];
  
  // Choose which menu items to display
  const menuItems = currentUser ?
    [...protectedMenuItems, ...publicMenuItems.filter(item => item.text !== 'Home')] :
    publicMenuItems;
  
  const drawer = (
    <div style={{ backgroundColor: '#000000', height: '100%', color: 'white' }}>
     <Toolbar sx={{
       display: 'flex',
       flexDirection: 'column',
       alignItems: 'center',
       justifyContent: 'center',
       py: 2
     }}>
       <Typography
         variant="h6"
         noWrap
         component="div"
         color="#CCFF00"
         fontWeight="bold"
         sx={{
           textShadow: '0 0 10px rgba(0,0,0,0.5)',
           letterSpacing: '0.5px'
         }}
       >
         Cosmic Synched Chains
       </Typography>
       <Typography
         variant="caption"
         noWrap
         component="div"
         color="white"
         sx={{
           mt: 0.5,
           opacity: 0.7
         }}
       >
         by Syncron Labs (CSC)
       </Typography>
     </Toolbar>
     <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {!item.submenu ? (
              <ListItem 
                button 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(204, 255, 0, 0.2)',
                    color: '#CCFF00',
                    textShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                    '& .MuiListItemIcon-root': {
                      color: '#CCFF00',
                    },
                    borderLeft: '4px solid #CCFF00'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(204, 255, 0, 0.3)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                  borderRadius: '0 20px 20px 0',
                  marginRight: '8px',
                  marginY: '4px',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ) : (
              <>
                <ListItem 
                  button 
                  onClick={() => handleSubmenuToggle(item.text)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                    borderRadius: '0 20px 20px 0',
                    marginRight: '8px',
                    marginY: '4px',
                    transition: 'all 0.3s ease',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openSubmenu === item.text ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openSubmenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenuItems.map((subItem) => (
                      <ListItem
                        key={subItem.text}
                        button
                        onClick={() => navigate(subItem.path)}
                        selected={location.pathname === subItem.path}
                        sx={{
                          pl: 4,
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(204, 255, 0, 0.2)',
                            color: '#CCFF00',
                            textShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                            '& .MuiListItemIcon-root': {
                              color: '#CCFF00',
                            },
                            borderLeft: '4px solid #CCFF00'
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: 'rgba(204, 255, 0, 0.3)',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          },
                          borderRadius: '0 20px 20px 0',
                          marginRight: '8px',
                          marginY: '2px',
                          transition: 'all 0.3s ease',
                          color: 'white',
                          '& .MuiListItemIcon-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: '40px', fontSize: 'small' }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={subItem.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.875rem',
                            fontWeight: location.pathname === subItem.path ? 'medium' : 'normal'
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#000000',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          borderBottom: '1px solid rgba(204, 255, 0, 0.2)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find(item => item.path === location.pathname)?.text || 'Cosmic Synched Chains (CSC)'}
          </Typography>
          
          {/* Login/Signup buttons for non-authenticated users */}
          {!currentUser && (
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(204, 255, 0, 0.7)',
                  '&:hover': {
                    borderColor: '#CCFF00',
                    backgroundColor: 'rgba(204, 255, 0, 0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/signup')}
                sx={{
                  backgroundColor: '#CCFF00',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#B8E600'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#000000',
              borderRight: '1px solid rgba(204, 255, 0, 0.2)'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#000000',
              borderRight: '1px solid rgba(204, 255, 0, 0.2)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
          backgroundColor: '#121212',
          minHeight: 'calc(100vh - 64px)',
          color: 'white'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;