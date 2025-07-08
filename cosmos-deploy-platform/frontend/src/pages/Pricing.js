import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Container,
  Switch,
  FormControlLabel
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../components/Layout/Layout';
import { useState } from 'react';

const PricingCard = ({ title, price, description, features, recommended, buttonText }) => (
  <Card elevation={recommended ? 8 : 3} sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: recommended ? '2px solid #CCFF00' : '1px solid rgba(204, 255, 0, 0.1)',
    transform: recommended ? 'scale(1.02)' : 'none',
    zIndex: recommended ? 1 : 0,
    transition: 'all 0.3s ease',
    backgroundColor: '#121212',
    '&:hover': {
      boxShadow: recommended ? '0 8px 30px rgba(204, 255, 0, 0.3)' : '0 8px 20px rgba(204, 255, 0, 0.1)',
      transform: recommended ? 'scale(1.03)' : 'scale(1.01)'
    }
  }}>
    {recommended && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: '#CCFF00',
          color: '#000000',
          fontWeight: 'bold',
          py: 0.5,
          px: 2,
          borderBottomLeftRadius: 8,
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          boxShadow: '0 2px 10px rgba(204, 255, 0, 0.3)'
        }}
      >
        <Typography variant="subtitle2">
          Recommended
        </Typography>
      </Box>
    )}
    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ color: '#CCFF00', fontWeight: 'bold', textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
        {title}
      </Typography>
      <Typography variant="h4" component="div" align="center" sx={{
        my: 2,
        color: 'white',
        textShadow: recommended ? '0 0 10px rgba(204, 255, 0, 0.5)' : 'none'
      }}>
        {typeof price === 'number' ? `$${price}` : price}
        {typeof price === 'number' && (
          <Typography component="span" variant="subtitle2" color="text.secondary">
            /month
          </Typography>
        )}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" paragraph>
        {description}
      </Typography>
      <Divider sx={{ my: 2, backgroundColor: 'rgba(204, 255, 0, 0.2)' }} />
      <List dense>
        {features.map((feature, idx) => (
          <ListItem key={idx} disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {feature.included ?
                <CheckIcon sx={{ color: '#CCFF00' }} fontSize="small" /> :
                <CloseIcon color="disabled" fontSize="small" />
              }
            </ListItemIcon>
            <ListItemText 
              primary={feature.text} 
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: feature.included ? 'textPrimary' : 'textSecondary',
                sx: feature.included ? {} : { textDecoration: 'line-through' }
              }} 
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
    <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
      <Button
        variant={recommended ? "contained" : "outlined"}
        color="primary"
        size="large"
        fullWidth
        sx={{
          py: 1.2,
          fontWeight: 'bold',
          ...(recommended ? {
            boxShadow: '0 4px 15px rgba(204, 255, 0, 0.3)'
          } : {
            borderColor: 'rgba(204, 255, 0, 0.5)',
            '&:hover': {
              borderColor: '#CCFF00',
              backgroundColor: 'rgba(204, 255, 0, 0.08)'
            }
          })
        }}
      >
        {buttonText || 'Get Started'}
      </Button>
    </CardActions>
  </Card>
);

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(false);
  
  // Apply 20% discount for annual billing
  const discount = annualBilling ? 0.8 : 1;

  const pricingData = [
    {
      title: 'Free Tier',
      price: 0,
      description: 'Perfect for exploration and testing with limited resources',
      features: [
        { text: 'Single network deployment', included: true },
        { text: 'Up to 3 validators', included: true },
        { text: 'Basic monitoring tools', included: true },
        { text: 'Local and testnet deployment', included: true },
        { text: 'Community support', included: true },
        { text: 'Multi-cloud deployment', included: false },
        { text: 'Advanced security features', included: false },
        { text: 'Custom modules', included: false },
        { text: 'Priority support', included: false },
        { text: 'Backup and recovery', included: false },
      ],
      recommended: false,
      buttonText: 'Start for Free'
    },
    {
      title: 'Developer',
      price: Math.round(49 * discount),
      description: 'For developers building production-ready networks',
      features: [
        { text: 'Up to 5 networks', included: true },
        { text: 'Up to 10 validators per network', included: true },
        { text: 'Advanced monitoring', included: true },
        { text: 'Multi-cloud deployment', included: true },
        { text: 'Basic security features', included: true },
        { text: 'Basic governance tools', included: true },
        { text: 'Email support', included: true },
        { text: 'Custom modules', included: false },
        { text: 'SLA guarantees', included: false },
        { text: 'Advanced analytics', included: false },
      ],
      recommended: false,
      buttonText: 'Subscribe Now'
    },
    {
      title: 'Professional',
      price: Math.round(199 * discount),
      description: 'For production networks with advanced features',
      features: [
        { text: 'Unlimited networks', included: true },
        { text: 'Up to 30 validators per network', included: true },
        { text: 'Advanced monitoring & alerts', included: true },
        { text: 'Multi-cloud deployment', included: true },
        { text: 'Advanced security features', included: true },
        { text: 'Full governance toolset', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Custom module integration', included: true },
        { text: 'Backup and recovery', included: true },
        { text: 'Advanced analytics', included: true },
      ],
      recommended: true,
      buttonText: 'Choose Professional'
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      description: 'For large-scale deployments with dedicated support',
      features: [
        { text: 'Unlimited networks', included: true },
        { text: 'Unlimited validators', included: true },
        { text: 'Custom monitoring solutions', included: true },
        { text: 'Multi-cloud & on-premises', included: true },
        { text: 'Enterprise security features', included: true },
        { text: 'Custom governance solutions', included: true },
        { text: '24/7 dedicated support', included: true },
        { text: 'Custom development', included: true },
        { text: 'SLA guarantees', included: true },
        { text: 'Compliance & regulatory tools', included: true },
      ],
      recommended: false,
      buttonText: 'Contact Sales'
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{
          p: 4,
          mb: 4,
          bgcolor: '#000000',
          color: 'white',
          borderRadius: 3,
          backgroundImage: 'linear-gradient(135deg, rgba(204, 255, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%)',
          border: '1px solid rgba(204, 255, 0, 0.2)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{
            color: '#FFFFFF',
            '& .highlight': {
              color: '#CCFF00',
              textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }
          }}>
            <span className="highlight">Transparent Pricing</span> for All Your Blockchain Needs
          </Typography>
          <Typography variant="body1" align="center" sx={{ opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
            Choose the plan that works for your blockchain deployment requirements.
            All plans include core features of Cosmic Synched Chains platform.
          </Typography>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={annualBilling}
                onChange={() => setAnnualBilling(!annualBilling)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>Monthly</Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    bgcolor: annualBilling ? 'success.light' : 'transparent',
                    color: annualBilling ? 'white' : 'inherit',
                    py: 0.5,
                    px: 1,
                    borderRadius: 1
                  }}
                >
                  Annual (Save 20%)
                </Typography>
              </Box>
            }
            labelPlacement="end"
          />
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {pricingData.map((plan, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <PricingCard {...plan} />
            </Grid>
          ))}
        </Grid>

        <Paper elevation={4} sx={{
          p: 4,
          mt: 6,
          backgroundColor: '#121212',
          border: '1px solid rgba(204, 255, 0, 0.1)',
          borderRadius: 3,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ color: '#CCFF00', fontWeight: 'bold', textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
            Enterprise Features
          </Typography>
          <Divider sx={{ mb: 3, backgroundColor: 'rgba(204, 255, 0, 0.2)' }} />
          <Typography variant="body1" paragraph align="center">
            Our Enterprise plan includes additional features for organizations requiring high-performance, 
            secure, and customizable blockchain solutions.
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#CCFF00', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }} gutterBottom>
                Security & Compliance
              </Typography>
              <List dense>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="Advanced access control" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="Regulatory compliance tools" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="Audit logging & reporting" />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#CCFF00', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }} gutterBottom>
                Support & Services
              </Typography>
              <List dense>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="Dedicated account manager" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="Custom onboarding process" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="24/7 priority support" />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#CCFF00', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }} gutterBottom>
                Customization
              </Typography>
              <List dense>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="Custom module development" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="Integration with existing systems" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon><CheckIcon sx={{ color: '#CCFF00' }} /></ListItemIcon>
                  <ListItemText primary="Custom reporting & analytics" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(204, 255, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'rotate(45deg)',
                  animation: 'shine 3s infinite linear',
                  '@keyframes shine': {
                    from: { transform: 'translateX(-100%) rotate(45deg)' },
                    to: { transform: 'translateX(100%) rotate(45deg)' }
                  }
                }
              }}
            >
              Contact Enterprise Sales
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Pricing;