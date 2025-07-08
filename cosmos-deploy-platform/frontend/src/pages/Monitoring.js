import React from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';

const Monitoring = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Monitoring
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Alert severity="info">
          This is the global monitoring page for all networks. For individual network monitoring, 
          please visit the specific network's details page and navigate to the Monitoring tab.
        </Alert>
        
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          From this page, you can monitor the health and performance of all your Cosmos networks in one place.
          The comprehensive monitoring dashboard will be available in the next update.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Monitoring;