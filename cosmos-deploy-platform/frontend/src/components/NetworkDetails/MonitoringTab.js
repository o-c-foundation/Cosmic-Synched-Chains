import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  LinearProgress,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorageIcon from '@mui/icons-material/Storage';
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';

const MonitoringTab = ({ network }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(network.metrics || {
    blockHeight: 0,
    blockTime: 0,
    activeValidators: 0,
    totalStaked: 0,
    transactions: {
      total: 0,
      perSecond: 0
    },
    updatedAt: new Date().toISOString()
  });
  
  // Simulate fetching metrics
  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call an API
      // For now, just simulate a delay and use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If network already has metrics, use those
      if (network.metrics) {
        setMetrics({
          ...network.metrics,
          blockHeight: network.metrics.blockHeight + Math.floor(Math.random() * 10),
          transactions: {
            total: network.metrics.transactions.total + Math.floor(Math.random() * 100),
            perSecond: network.metrics.transactions.perSecond + (Math.random() * 0.5 - 0.25)
          },
          updatedAt: new Date().toISOString()
        });
      } else {
        // Use mock metrics
        setMetrics({
          blockHeight: Math.floor(900000 + Math.random() * 100000),
          blockTime: 5 + Math.random() * 2,
          activeValidators: Math.floor(10 + Math.random() * 40),
          totalStaked: Math.floor(5000000 + Math.random() * 5000000),
          transactions: {
            total: Math.floor(1000000 + Math.random() * 9000000),
            perSecond: 5 + Math.random() * 15
          },
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      setError('Failed to fetch metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch metrics on mount and when network changes
  useEffect(() => {
    fetchMetrics();
    // Set up polling for metrics
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, [network.id]);
  
  // Render a metric card
  const MetricCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            backgroundColor: `${color}20`, 
            color: color,
            borderRadius: '50%', 
            p: 1, 
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="medium" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
  
  // Check if the network is active
  const isActive = network.status === 'Active';
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Network Monitoring
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={fetchMetrics}
          disabled={loading || !isActive}
        >
          Refresh Metrics
        </Button>
      </Box>
      
      {!isActive && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Monitoring is only available when the network is active. 
          {network.status === 'Created' ? ' Deploy the network first.' : 
           ` Current status: ${network.status}`}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <LinearProgress sx={{ mb: 3 }} />
      )}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Block Height" 
            value={metrics.blockHeight.toLocaleString()} 
            icon={<StorageIcon />}
            color="#2E3192"
            subtitle={`Last updated: ${new Date(metrics.updatedAt).toLocaleTimeString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Block Time" 
            value={`${metrics.blockTime.toFixed(2)}s`} 
            icon={<AccessTimeIcon />}
            color="#00C853"
            subtitle="Average over last 100 blocks"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Active Validators" 
            value={metrics.activeValidators} 
            icon={<PeopleIcon />}
            color="#E50278"
            subtitle={`Out of ${network.validatorRequirements.maxValidators || 'unlimited'}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Transactions/sec" 
            value={metrics.transactions.perSecond.toFixed(2)} 
            icon={<SpeedIcon />}
            color="#FF9800"
            subtitle={`Total: ${metrics.transactions.total.toLocaleString()}`}
          />
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Staking Metrics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Staked
                </Typography>
                <Typography variant="h5">
                  {metrics.totalStaked.toLocaleString()} {network.tokenEconomics.symbol}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {((metrics.totalStaked / network.tokenEconomics.initialSupply) * 100).toFixed(2)}% of total supply
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Estimated APR
                </Typography>
                <Typography variant="h5">
                  {(10 + Math.random() * 5).toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on current staking ratio and inflation
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Blocks
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Height</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Proposer</TableCell>
                <TableCell>Transactions</TableCell>
                <TableCell>Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => {
                const blockHeight = metrics.blockHeight - index;
                return (
                  <TableRow key={index}>
                    <TableCell>{blockHeight.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(Date.now() - index * metrics.blockTime * 1000).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {network.validators && network.validators.length > 0
                        ? network.validators[index % network.validators.length].moniker
                        : `Validator ${index % 5 + 1}`}
                    </TableCell>
                    <TableCell>{Math.floor(Math.random() * 100)}</TableCell>
                    <TableCell>{Math.floor(10 + Math.random() * 90)} KB</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="outlined"
            startIcon={<ShowChartIcon />}
            disabled={!isActive}
          >
            Open Block Explorer
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MonitoringTab;