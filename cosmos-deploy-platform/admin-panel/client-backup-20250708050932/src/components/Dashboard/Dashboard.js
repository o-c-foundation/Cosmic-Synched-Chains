import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Avatar,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import {
  PeopleOutline as PeopleIcon,
  NetworkCheck as NetworkIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

// Chart.js setup
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error connecting to server: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    const statusColors = {
      active: 'success',
      planned: 'info',
      deploying: 'warning',
      error: 'error',
      stopped: 'default',
      terminated: 'default'
    };
    return statusColors[status] || 'default';
  };

  if (loading && !dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, backgroundColor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="h6">Error Loading Dashboard</Typography>
          <Typography variant="body1">{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2, bgcolor: 'background.paper', color: 'error.main' }}
            onClick={fetchDashboardData}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  // Prepare chart data if we have dashboard data
  const networkStatusData = {
    labels: Object.keys(dashboardData?.networks.byStatus || {}),
    datasets: [
      {
        data: Object.values(dashboardData?.networks.byStatus || {}),
        backgroundColor: [
          '#4caf50', // active
          '#2196f3', // planned
          '#ff9800', // deploying
          '#f44336', // error
          '#9e9e9e', // stopped
          '#616161'  // terminated
        ],
        borderWidth: 1
      }
    ]
  };

  const validatorStatusData = {
    labels: Object.keys(dashboardData?.validators || {}),
    datasets: [
      {
        label: 'Validators Count',
        data: Object.values(dashboardData?.validators || {}).map(v => v.count),
        backgroundColor: 'rgba(204, 255, 0, 0.7)',
        borderColor: 'rgba(204, 255, 0, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <IconButton onClick={fetchDashboardData} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Typography variant="h6">Users</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                {dashboardData?.users.total || 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`Active: ${dashboardData?.users.active || 0}`} 
                  size="small" 
                  color="success" 
                />
                <Chip 
                  label={`Inactive: ${dashboardData?.users.inactive || 0}`} 
                  size="small" 
                  color="default" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <NetworkIcon />
                </Avatar>
                <Typography variant="h6">Networks</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                {dashboardData?.networks.total || 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`Active: ${dashboardData?.networks.byStatus?.active || 0}`} 
                  size="small" 
                  color="success" 
                />
                <Chip 
                  label={`Deploying: ${dashboardData?.networks.byStatus?.deploying || 0}`} 
                  size="small" 
                  color="warning" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <StorageIcon />
                </Avatar>
                <Typography variant="h6">System</Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Memory: {dashboardData?.system.memory.percentage || 0}%
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`DB: ${dashboardData?.system.database.status || 'Unknown'}`} 
                  size="small" 
                  color={dashboardData?.system.database.isConnected ? "success" : "error"} 
                />
                <Chip 
                  label={`Uptime: ${Math.floor((dashboardData?.system.uptime || 0) / 3600)}h`} 
                  size="small" 
                  color="info" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <WarningIcon />
                </Avatar>
                <Typography variant="h6">Errors</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                {dashboardData?.logs.recentErrors.length || 0}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                color="error"
                onClick={() => navigate('/system/logs')}
              >
                View Logs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts & Lists */}
      <Grid container spacing={3}>
        {/* Network Status Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Network Status" />
            <Divider />
            <CardContent sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {Object.keys(dashboardData?.networks.byStatus || {}).length > 0 ? (
                <Pie data={networkStatusData} options={{ maintainAspectRatio: false }} />
              ) : (
                <Typography variant="body1" color="textSecondary">No network data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Validator Status Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Validators" />
            <Divider />
            <CardContent sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {Object.keys(dashboardData?.validators || {}).length > 0 ? (
                <Bar 
                  data={validatorStatusData} 
                  options={{ 
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }} 
                />
              ) : (
                <Typography variant="body1" color="textSecondary">No validator data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Recent Activity" />
            <Divider />
            <CardContent sx={{ height: 300, overflowY: 'auto' }}>
              <List>
                {dashboardData?.logs.recentLogs.length > 0 ? (
                  dashboardData.logs.recentLogs.map((log, index) => (
                    <React.Fragment key={log._id || index}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {log.level === 'error' || log.level === 'critical' ? (
                                <WarningIcon color="error" fontSize="small" />
                              ) : (
                                <CheckCircleIcon color="success" fontSize="small" />
                              )}
                              <Typography variant="subtitle2">{log.message}</Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.secondary">
                                {log.source} • {format(new Date(log.timestamp), 'MMM d, HH:mm')}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.logs.recentLogs.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                    No recent activity
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Networks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Recent Networks" 
              action={
                <Button size="small" onClick={() => navigate('/networks')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ maxHeight: 400, overflowY: 'auto' }}>
              <List>
                {dashboardData?.networks.recent.length > 0 ? (
                  dashboardData.networks.recent.map((network, index) => (
                    <React.Fragment key={network._id || index}>
                      <ListItem 
                        alignItems="flex-start"
                        button
                        onClick={() => navigate(`/networks/${network._id}`)}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2">{network.name}</Typography>
                              <Chip 
                                label={network.status} 
                                size="small" 
                                color={getStatusColor(network.status)} 
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {network.chainId}
                              </Typography>
                              <Typography component="span" variant="body2" color="text.secondary">
                                {network.owner && ` • Owner: ${network.owner.name}`}
                                {` • Created: ${format(new Date(network.createdAt), 'MMM d, yyyy')}`}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.networks.recent.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                    No networks found
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent User Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Recent User Activity" 
              action={
                <Button size="small" onClick={() => navigate('/users')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ maxHeight: 400, overflowY: 'auto' }}>
              <List>
                {dashboardData?.activity?.length > 0 ? (
                  dashboardData.activity.map((user, index) => (
                    <React.Fragment key={user._id || index}>
                      <ListItem 
                        alignItems="flex-start"
                        button
                        onClick={() => navigate(`/users/${user._id}`)}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">{user.name}</Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {user.email}
                              </Typography>
                              <Typography component="span" variant="body2" color="text.secondary">
                                {` • Last login: ${format(new Date(user.lastLogin), 'MMM d, HH:mm')}`}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.activity.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                    No recent user activity
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;