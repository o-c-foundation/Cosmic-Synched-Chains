import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button,
  ButtonGroup,
  Divider,
  LinearProgress,
  Tooltip,
  Alert
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Network } from '../../types/network';

interface MonitoringTabProps {
  network: Network;
}

const MonitoringTab: React.FC<MonitoringTabProps> = ({ network }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  
  // Mock data for charts - in a real app, these would come from an API
  const generateTimeSeriesData = (days: number, dataType: 'tps' | 'blockTime' | 'activeValidators') => {
    const now = new Date();
    const data = [];
    
    // Generate data points for the specified number of days
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - days + i);
      
      let value;
      switch (dataType) {
        case 'tps':
          // TPS varies between 8-20 with some random fluctuation
          value = 12 + Math.random() * 8 + Math.sin(i / 5) * 4;
          break;
        case 'blockTime':
          // Block time varies between 5-7 seconds with minor fluctuation
          value = 6 + Math.random() * 1 + Math.sin(i / 10) * 0.5;
          break;
        case 'activeValidators':
          // Active validators start at 80% of max and fluctuate slightly
          const maxVals = network.validatorRequirements.maxValidators || 100;
          value = Math.floor(maxVals * 0.8 + Math.random() * 10 + Math.sin(i / 8) * 5);
          break;
      }
      
      data.push({
        date: date.toLocaleDateString(),
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return data;
  };
  
  const getDaysForTimeRange = (range: string): number => {
    switch (range) {
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 1;
    }
  };
  
  const transactionData = generateTimeSeriesData(getDaysForTimeRange(timeRange), 'tps');
  const blockTimeData = generateTimeSeriesData(getDaysForTimeRange(timeRange), 'blockTime');
  const validatorsData = generateTimeSeriesData(getDaysForTimeRange(timeRange), 'activeValidators');
  
  // Distribution data for pie chart
  const stakingDistributionData = [
    { name: 'Top 5 Validators', value: 40 },
    { name: 'Next 20 Validators', value: 35 },
    { name: 'Remaining Validators', value: 25 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Resources usage data
  const resourcesData = [
    { name: 'CPU Usage', value: 45 },
    { name: 'Memory Usage', value: 62 },
    { name: 'Disk Usage', value: 38 },
    { name: 'Bandwidth', value: 27 },
  ];
  
  // Handle time range change
  const handleTimeRangeChange = (range: '24h' | '7d' | '30d' | '90d') => {
    setTimeRange(range);
  };
  
  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  if (!network.metrics) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Monitoring
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Metrics are only available for active networks. Deploy this network to view metrics.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Monitoring & Analytics
        </Typography>
        
        <ButtonGroup variant="outlined" size="small">
          <Button 
            onClick={() => handleTimeRangeChange('24h')}
            variant={timeRange === '24h' ? 'contained' : 'outlined'}
          >
            24H
          </Button>
          <Button 
            onClick={() => handleTimeRangeChange('7d')}
            variant={timeRange === '7d' ? 'contained' : 'outlined'}
          >
            7D
          </Button>
          <Button 
            onClick={() => handleTimeRangeChange('30d')}
            variant={timeRange === '30d' ? 'contained' : 'outlined'}
          >
            30D
          </Button>
          <Button 
            onClick={() => handleTimeRangeChange('90d')}
            variant={timeRange === '90d' ? 'contained' : 'outlined'}
          >
            90D
          </Button>
        </ButtonGroup>
      </Box>
      
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Current Block Height
              </Typography>
              <Typography variant="h4">
                {formatNumber(network.metrics.blockHeight)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Avg Block Time
              </Typography>
              <Typography variant="h4">
                {network.metrics.blockTime.toFixed(1)}s
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Active Validators
              </Typography>
              <Typography variant="h4">
                {network.metrics.activeValidators}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {network.validatorRequirements.maxValidators || 'unlimited'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Transactions Per Second
              </Typography>
              <Typography variant="h4">
                {network.metrics.transactions.perSecond.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(network.metrics.transactions.total)} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3}>
        {/* Transaction Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Transaction Rate
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Transactions per second over time
            </Typography>
            
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={transactionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="TPS" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Block Time Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Block Time
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Average block time in seconds
            </Typography>
            
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={blockTimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 'dataMax + 2']} />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Seconds" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Validators Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Active Validators
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Number of active validators over time
            </Typography>
            
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={validatorsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Bar dataKey="value" name="Validators" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Staking Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Staking Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Stake distribution across validators
            </Typography>
            
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stakingDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stakingDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Resources Usage */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Resources Usage
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Current system resources utilization
            </Typography>
            
            <Grid container spacing={2}>
              {resourcesData.map((resource) => (
                <Grid item xs={12} sm={6} key={resource.name}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{resource.name}</Typography>
                      <Typography variant="body2">{resource.value}%</Typography>
                    </Box>
                    <Tooltip title={`${resource.value}%`}>
                      <LinearProgress 
                        variant="determinate" 
                        value={resource.value} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 
                              resource.value > 80 ? '#f44336' : 
                              resource.value > 60 ? '#ff9800' : 
                              '#4caf50'
                          }
                        }} 
                      />
                    </Tooltip>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitoringTab;