import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import BuildIcon from '@mui/icons-material/Build';
import StorageIcon from '@mui/icons-material/Storage';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Layout from '../components/Layout/Layout';

const FeatureCard = ({ title, description, icon, features }) => (
  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardHeader
      avatar={icon}
      title={title}
      titleTypographyProps={{ variant: 'h6', color: 'primary' }}
      sx={{ pb: 0 }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      <List dense>
        {features.map((feature, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <CheckCircleIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

const Features = () => {
  const featureData = [
    {
      title: 'Multi-Cloud Deployment',
      description: 'Deploy your Cosmos blockchain network to any major cloud provider with just a few clicks.',
      icon: <CloudIcon color="primary" />,
      features: [
        'AWS, GCP, Azure, and Digital Ocean support',
        'Automatic infrastructure provisioning',
        'Cross-cloud validator setup',
        'Hybrid cloud configurations'
      ]
    },
    {
      title: 'Security Features',
      description: 'Enterprise-grade security for your blockchain network with advanced security features.',
      icon: <SecurityIcon color="primary" />,
      features: [
        'Secure key management',
        'Multi-signature support',
        'Role-based access control',
        'Network isolation and firewall rules',
        'Automated security patches'
      ]
    },
    {
      title: 'Performance Optimization',
      description: 'High-performance blockchain networks with optimized configurations for your use case.',
      icon: <SpeedIcon color="primary" />,
      features: [
        'Auto-scaling validators',
        'Optimized consensus parameters',
        'Network throughput monitoring',
        'Performance analytics dashboard',
        'Custom performance tuning'
      ]
    },
    {
      title: 'Governance Tools',
      description: 'Comprehensive governance tools for managing your blockchain network.',
      icon: <AccountBalanceWalletIcon color="primary" />,
      features: [
        'Proposal creation interface',
        'Voting analytics',
        'Parameter change simulations',
        'Governance notifications',
        'Historical proposal tracking'
      ]
    },
    {
      title: 'Customization Options',
      description: 'Tailor your blockchain network to your specific requirements with flexible customization.',
      icon: <BuildIcon color="primary" />,
      features: [
        'Custom module integration',
        'Token economics design',
        'Governance parameter customization',
        'CosmWasm smart contract support',
        'Custom API endpoints'
      ]
    },
    {
      title: 'Data & Storage',
      description: 'Robust data storage solutions for your blockchain network with backup and recovery options.',
      icon: <StorageIcon color="primary" />,
      features: [
        'Automatic state snapshots',
        'Backup and restore functionality',
        'Pruning options configuration',
        'Data export tools',
        'Archive node setup'
      ]
    },
    {
      title: 'Analytics & Monitoring',
      description: 'Comprehensive analytics and monitoring for your blockchain network.',
      icon: <AnalyticsIcon color="primary" />,
      features: [
        'Real-time metrics dashboard',
        'Transaction volume analytics',
        'Validator performance monitoring',
        'Custom alerts and notifications',
        'Historical data analysis'
      ]
    }
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Features of Cosmic Synched Chains (CSC)
          </Typography>
          <Typography variant="body1">
            Our platform provides a comprehensive suite of tools to create, deploy, and manage Cosmos blockchain networks.
            From multi-cloud deployment to advanced governance tools, we've got everything you need to launch and maintain
            your blockchain infrastructure.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {featureData.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                features={feature.features}
              />
            </Grid>
          ))}
        </Grid>

        <Paper elevation={2} sx={{ p: 4, my: 4 }}>
          <Typography variant="h5" gutterBottom color="primary">
            Enterprise Features
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph>
            For enterprise users, we offer additional features designed for large-scale deployments and mission-critical operations:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dedicated Support" 
                    secondary="24/7 support with dedicated account manager" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="SLA Guarantees" 
                    secondary="99.9% uptime guarantee with financial penalties" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Custom Development" 
                    secondary="Bespoke module development for your specific needs" 
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="On-Premises Deployment" 
                    secondary="Deploy within your own infrastructure and firewalls" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Compliance Tools" 
                    secondary="Tools for regulatory compliance and auditing" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Disaster Recovery" 
                    secondary="Advanced disaster recovery and business continuity planning" 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Features;