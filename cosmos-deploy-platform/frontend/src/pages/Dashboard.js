import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNetworks } from '../context/NetworkContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Dashboard = () => {
  const { networks, loading } = useNetworks();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNetworks: 0,
    activeNetworks: 0,
    totalValidators: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    if (networks && networks.length > 0) {
      // Calculate dashboard statistics
      const activeNetworks = networks.filter(n => n.status === 'Active');
      
      let validatorCount = 0;
      let transactionCount = 0;
      
      networks.forEach(network => {
        validatorCount += network.validators?.length || 0;
        transactionCount += network.metrics?.transactions?.total || 0;
      });
      
      setStats({
        totalNetworks: networks.length,
        activeNetworks: activeNetworks.length,
        totalValidators: validatorCount,
        totalTransactions: transactionCount
      });
    }
  }, [networks]);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ 
            backgroundColor: `${color}20`, 
            borderRadius: '50%', 
            p: 1, 
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary" fontWeight="medium">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold" sx={{ mt: 2 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your Cosmos blockchain networks
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Networks" 
            value={stats.totalNetworks} 
            icon={<StorageIcon sx={{ color: '#2E3192' }} />}
            color="#2E3192"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Networks" 
            value={stats.activeNetworks} 
            icon={<BarChartIcon sx={{ color: '#00C853' }} />}
            color="#00C853"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Validators" 
            value={stats.totalValidators} 
            icon={<AccountBalanceWalletIcon sx={{ color: '#E50278' }} />}
            color="#E50278"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Transactions" 
            value={stats.totalTransactions.toLocaleString()} 
            icon={<BarChartIcon sx={{ color: '#FF9800' }} />}
            color="#FF9800"
          />
        </Grid>
      </Grid>

      {networks.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#f7f9fc'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Welcome to Cosmos Deploy Platform
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
            Create your first blockchain network to get started. The platform allows you to easily
            deploy and manage Cosmos-based blockchains with just a few clicks.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/create-network')}
          >
            Create Your First Network
          </Button>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Recent Networks
          </Typography>
          <Grid container spacing={3}>
            {networks.slice(0, 3).map(network => (
              <Grid item xs={12} md={4} key={network.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate(`/networks/${network.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6">{network.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {network.chainId}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          backgroundColor: network.status === 'Active' ? 'success.light' : 
                                         network.status === 'Created' ? 'primary.light' : 'warning.light',
                          color: network.status === 'Active' ? 'success.dark' : 
                                network.status === 'Created' ? 'primary.dark' : 'warning.dark',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 'medium'
                        }}
                      >
                        {network.status}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(network.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/networks')}
            >
              View All Networks
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;