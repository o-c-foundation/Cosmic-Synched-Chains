import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
  InputBase,
  IconButton,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GetAppIcon from '@mui/icons-material/GetApp';
import Layout from '../components/Layout/Layout';

const DocumentationCategory = ({ title, description, icon, links }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" color="primary" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      <List dense>
        {links.map((link, index) => (
          <ListItem 
            key={index} 
            button 
            component={Link} 
            href="#" 
            onClick={(e) => e.preventDefault()}
            sx={{ 
              pl: 0, 
              '&:hover': { 
                color: 'primary.main', 
                backgroundColor: 'rgba(25, 118, 210, 0.04)' 
              }
            }}
          >
            <ListItemText primary={link} />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

const DocumentationPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = useState('panel1');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const documentationCategories = [
    {
      title: "Getting Started",
      description: "Quick start guides and introductory tutorials to help you set up your first Cosmos blockchain network.",
      icon: <SchoolIcon color="primary" />,
      links: [
        "Platform Overview",
        "Quick Start Guide",
        "Creating Your First Network",
        "Deployment Options",
        "Understanding Validators"
      ]
    },
    {
      title: "User Guides",
      description: "Step-by-step guides for using various features of the Cosmic Synched Chains platform.",
      icon: <MenuBookIcon color="primary" />,
      links: [
        "Dashboard Navigation",
        "Network Creation Process",
        "Token Economics Configuration",
        "Validator Setup",
        "Governance Tools"
      ]
    },
    {
      title: "API Reference",
      description: "Comprehensive API documentation for developers integrating with the CSC platform.",
      icon: <CodeIcon color="primary" />,
      links: [
        "Authentication",
        "Networks API",
        "Validators API",
        "Governance API",
        "Monitoring API"
      ]
    },
    {
      title: "Technical Documents",
      description: "Detailed technical documentation on the architecture and components of the CSC platform.",
      icon: <DescriptionIcon color="primary" />,
      links: [
        "Architecture Overview",
        "Security Model",
        "Deployment Specifications",
        "High Availability Setup",
        "Disaster Recovery"
      ]
    },
    {
      title: "Tutorials",
      description: "Step-by-step tutorials for specific use cases and advanced features.",
      icon: <ArticleIcon color="primary" />,
      links: [
        "Multi-validator Network Setup",
        "IBC Configuration",
        "CosmWasm Integration",
        "Custom Module Development",
        "Monitoring and Alerting"
      ]
    },
    {
      title: "Resources",
      description: "Additional resources, templates, and downloadable content to support your blockchain development.",
      icon: <GetAppIcon color="primary" />,
      links: [
        "Configuration Templates",
        "Genesis File Examples",
        "Docker Compose Templates",
        "Kubernetes Manifests",
        "Terraform Scripts"
      ]
    }
  ];

  const faqs = [
    {
      question: "What is Cosmic Synched Chains?",
      answer: "Cosmic Synched Chains (CSC) is a comprehensive platform for creating, deploying, and managing Cosmos blockchain networks. It simplifies the process of setting up and maintaining blockchain infrastructure across multiple cloud providers or on-premises environments."
    },
    {
      question: "Can I deploy my blockchain to multiple cloud providers?",
      answer: "Yes, CSC supports multi-cloud deployment across AWS, Google Cloud, Microsoft Azure, and Digital Ocean. You can distribute validators across different cloud providers for increased decentralization and redundancy."
    },
    {
      question: "What Cosmos SDK modules are supported?",
      answer: "CSC supports all standard Cosmos SDK modules including Bank, Staking, Distribution, Gov, and Slashing. Additionally, we support IBC, Authz, Feegrant, Group, NFT, and CosmWasm for smart contract functionality."
    },
    {
      question: "How are security updates handled?",
      answer: "The platform provides automatic security updates for the underlying infrastructure. For blockchain node software, we provide notifications of available updates which can be applied with a single click or scheduled for maintenance windows."
    },
    {
      question: "Can I migrate an existing Cosmos blockchain to CSC?",
      answer: "Yes, CSC supports importing existing blockchain configurations and data. Our migration tools help you transition your existing network to our managed platform with minimal downtime."
    },
    {
      question: "What kind of monitoring is available?",
      answer: "CSC provides comprehensive monitoring including node health, validator performance, transaction throughput, block production metrics, governance activity, and infrastructure metrics. Custom alerts can be configured for various thresholds."
    }
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Documentation
          </Typography>
          <Typography variant="body1">
            Comprehensive guides, API references, and resources for the Cosmic Synched Chains platform.
          </Typography>
          
          <Box sx={{ mt: 3, bgcolor: 'white', borderRadius: 1, p: 0.5, display: 'flex' }}>
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'text.primary' }}
              placeholder="Search documentation..."
              inputProps={{ 'aria-label': 'search documentation' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Box>
        </Paper>

        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link color="inherit" href="/" onClick={(e) => e.preventDefault()}>
            Home
          </Link>
          <Typography color="text.primary">Documentation</Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Browse" />
            <Tab label="Guides" />
            <Tab label="API Reference" />
            <Tab label="FAQs" />
            <Tab label="Resources" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            {documentationCategories.map((category, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <DocumentationCategory {...category} />
              </Grid>
            ))}
          </Grid>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom color="primary">
              User Guides
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Getting Started
                    </Typography>
                    <List dense>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Platform Overview" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Creating an Account" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard Navigation" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Network Creation
                    </Typography>
                    <List dense>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Basic Network Setup" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Token Economics" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Validator Configuration" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Deployment
                    </Typography>
                    <List dense>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Cloud Provider Setup" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Local Deployment" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Production Deployment" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 3 && (
          <Box>
            <Typography variant="h5" gutterBottom color="primary">
              Frequently Asked Questions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {faqs.map((faq, index) => (
              <Accordion 
                key={index}
                expanded={expanded === `panel${index + 1}`}
                onChange={handleAccordionChange(`panel${index + 1}`)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index + 1}bh-content`}
                  id={`panel${index + 1}bh-header`}
                >
                  <Typography variant="subtitle1">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Can't find an answer to your question?
              </Typography>
              <Button variant="contained" color="primary" startIcon={<ArticleIcon />}>
                Contact Support
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default DocumentationPage;