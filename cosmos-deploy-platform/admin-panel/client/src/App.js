import React from 'react';
import { Box, Typography, AppBar, Toolbar, Container, Paper } from '@mui/material';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cosmic Synched Chains Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>
          <Typography variant="body1">
            The admin panel is currently being set up. This is a minimal implementation to verify connectivity.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Backend API: http://localhost:4001
          </Typography>
        </Paper>
      </Container>
      
      <Box component="footer" sx={{ p: 2, bgcolor: 'background.dark', color: 'white', textAlign: 'center' }}>
        <Typography variant="body2">
          Cosmic Synched Chains by Syncron Labs - Admin Access Only
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
