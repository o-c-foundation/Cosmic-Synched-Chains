import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import MonitorIcon from '@mui/icons-material/Monitor';
import TimelineIcon from '@mui/icons-material/Timeline';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Hero Section
  const HeroSection = () => (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(135deg, #2E3192 0%, #1A1C63 100%)',
        color: 'white',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 16 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
            >
              Deploy Cosmos Blockchains With Ease
            </Typography>
            <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
              The all-in-one platform for creating, deploying, and managing Cosmos-based blockchain networks in minutes, not months.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  fontSize: '1.1rem',
                  backgroundColor: '#E50278',
                  '&:hover': {
                    backgroundColor: '#AD004F'
                  }
                }}
              >
                Get Started Free
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  fontSize: '1.1rem',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              component="img"
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                transform: 'perspective(1000px) rotateY(-10deg)',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // Features Section
  const FeaturesSection = () => (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Everything You Need to Launch a Blockchain
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Our platform simplifies blockchain deployment with powerful tools and intuitive interfaces.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <FeatureCard
            icon={<SpeedIcon sx={{ fontSize: 50 }} />}
            title="Quick Deployment"
            description="Launch a fully functional blockchain network in minutes with just a few clicks."
            color="#2E3192"
          />
          <FeatureCard
            icon={<SecurityIcon sx={{ fontSize: 50 }} />}
            title="Enterprise Security"
            description="Bank-grade security with automated backups and disaster recovery."
            color="#E50278"
          />
          <FeatureCard
            icon={<SettingsIcon sx={{ fontSize: 50 }} />}
            title="Full Customization"
            description="Configure every aspect of your blockchain from consensus to governance."
            color="#00C853"
          />
          <FeatureCard
            icon={<MonitorIcon sx={{ fontSize: 50 }} />}
            title="Advanced Monitoring"
            description="Real-time monitoring dashboards and alerting systems to keep your network healthy."
            color="#FF9800"
          />
          <FeatureCard
            icon={<StorageIcon sx={{ fontSize: 50 }} />}
            title="Multi-Cloud Support"
            description="Deploy to AWS, GCP, Azure, or bring your own infrastructure."
            color="#00BCD4"
          />
          <FeatureCard
            icon={<TimelineIcon sx={{ fontSize: 50 }} />}
            title="Analytics & Insights"
            description="Comprehensive analytics to understand your network's performance and usage."
            color="#9C27B0"
          />
        </Grid>
      </Container>
    </Box>
  );

  // Feature Card Component
  const FeatureCard = ({ icon, title, description, color }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%', borderRadius: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ color: color, mb: 2 }}>
            {icon}
          </Box>
          <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  // How It Works Section
  const HowItWorksSection = () => (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Get your blockchain network up and running in three simple steps.
          </Typography>
        </Box>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/setup-wizard.png"
              alt="Setup Wizard"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <StepItem
                number="1"
                title="Configure Your Network"
                description="Choose your token economics, validator settings, governance parameters, and more through our intuitive setup wizard."
              />
              <StepItem
                number="2"
                title="Deploy to Your Cloud"
                description="Select your preferred cloud provider and region, and our platform handles the rest - infrastructure, node setup, and network configuration."
              />
              <StepItem
                number="3"
                title="Manage & Monitor"
                description="Use our comprehensive dashboard to monitor performance, manage validators, and govern your network."
              />
            </List>

            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
            >
              Start Building Now
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // Step Item Component
  const StepItem = ({ number, title, description }) => (
    <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
      <ListItemIcon>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          {number}
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        }
        secondary={
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        }
      />
    </ListItem>
  );

  // Pricing Section
  const PricingSection = () => (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Choose the plan that works for your needs, with no hidden fees.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard
              title="Developer"
              price="Free"
              description="Perfect for testing and development"
              features={[
                "1 testnet deployment",
                "Basic monitoring",
                "Community support",
                "Standard infrastructure"
              ]}
              buttonText="Start Free"
              buttonLink="/signup"
              highlighted={false}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard
              title="Professional"
              price="$299"
              period="per month"
              description="For production networks and teams"
              features={[
                "Up to 3 networks",
                "Advanced monitoring",
                "Priority support",
                "High-performance infrastructure",
                "Automatic backups",
                "Custom domain"
              ]}
              buttonText="Get Started"
              buttonLink="/signup"
              highlighted={true}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard
              title="Enterprise"
              price="Custom"
              description="For organizations with complex needs"
              features={[
                "Unlimited networks",
                "Enterprise SLA",
                "Dedicated support",
                "Custom infrastructure",
                "Compliance features",
                "White-label options",
                "On-premises deployment"
              ]}
              buttonText="Contact Us"
              buttonLink="/contact"
              highlighted={false}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // Pricing Card Component
  const PricingCard = ({ title, price, period, description, features, buttonText, buttonLink, highlighted }) => (
    <Paper
      elevation={highlighted ? 8 : 1}
      sx={{
        height: '100%',
        borderRadius: 3,
        p: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-8px)' },
        ...(highlighted && {
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow: `0 10px 40px ${theme.palette.primary.main}30`,
        }),
      }}
    >
      {highlighted && (
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: -30,
            transform: 'rotate(45deg)',
            backgroundColor: 'primary.main',
            color: 'white',
            py: 0.5,
            px: 4,
            fontWeight: 'bold',
          }}
        >
          POPULAR
        </Box>
      )}

      <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
        {title}
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="h3" component="p" fontWeight="bold">
          {price}
        </Typography>
        {period && (
          <Typography variant="body1" color="text.secondary">
            {period}
          </Typography>
        )}
      </Box>

      <Typography variant="body1" paragraph>
        {description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <List sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CheckCircleIcon color={highlighted ? 'primary' : 'success'} />
            </ListItemIcon>
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto' }}>
        <Button
          component={RouterLink}
          to={buttonLink}
          variant={highlighted ? 'contained' : 'outlined'}
          color="primary"
          fullWidth
          sx={{ py: 1.5 }}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );

  // Footer Section
  const FooterSection = () => (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Cosmos Deploy
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The easiest way to launch and manage your own Cosmos blockchain network.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Cosmos Deploy. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Product
            </Typography>
            <List dense disablePadding>
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/documentation">Documentation</FooterLink>
              <FooterLink to="/changelog">Changelog</FooterLink>
            </List>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Company
            </Typography>
            <List dense disablePadding>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </List>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Legal
            </Typography>
            <List dense disablePadding>
              <FooterLink to="/terms">Terms</FooterLink>
              <FooterLink to="/privacy">Privacy</FooterLink>
              <FooterLink to="/cookies">Cookies</FooterLink>
              <FooterLink to="/licenses">Licenses</FooterLink>
            </List>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Support
            </Typography>
            <List dense disablePadding>
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/status">Status</FooterLink>
              <FooterLink to="/community">Community</FooterLink>
              <FooterLink to="/feedback">Feedback</FooterLink>
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // Footer Link Component
  const FooterLink = ({ to, children }) => (
    <ListItem disablePadding sx={{ mb: 1 }}>
      <Button
        component={RouterLink}
        to={to}
        sx={{ 
          color: 'text.secondary',
          p: 0,
          justifyContent: 'flex-start',
          '&:hover': { 
            color: 'primary.main',
            backgroundColor: 'transparent'
          }
        }}
      >
        {children}
      </Button>
    </ListItem>
  );

  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FooterSection />
    </Box>
  );
};

export default LandingPage;