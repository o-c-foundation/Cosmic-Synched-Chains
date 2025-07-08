import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import HelpIcon from '@mui/icons-material/Help';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import SchoolIcon from '@mui/icons-material/School';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

/**
 * Help Center page with documentation, FAQs and support
 * @returns {JSX.Element} HelpCenter component
 */
const HelpCenter = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Categories for help articles
  const categories = [
    { 
      title: 'Getting Started', 
      icon: <SchoolIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      count: 12 
    },
    { 
      title: 'Network Deployment', 
      icon: <CodeIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      count: 18 
    },
    { 
      title: 'Monitoring & Management', 
      icon: <ArticleIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      count: 15 
    },
    { 
      title: 'Security', 
      icon: <HelpIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      count: 9 
    },
    { 
      title: 'Troubleshooting', 
      icon: <SupportAgentIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      count: 21 
    },
    { 
      title: 'API Documentation', 
      icon: <LiveHelpIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      count: 7 
    }
  ];

  // FAQ data
  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I create a new blockchain network?',
      answer: 'To create a new blockchain network, navigate to the Dashboard and click the "Create Network" button. Follow the step-by-step wizard that will guide you through configuring your network parameters, validator setup, token economics, and governance rules. Once completed, the platform will automatically deploy your network infrastructure.'
    },
    {
      id: 'faq-2',
      question: 'What are the system requirements for running a validator node?',
      answer: 'Validator nodes require at minimum: 4 CPU cores, 8GB RAM, 200GB SSD storage, and a stable internet connection with at least 10 Mbps bandwidth. For production networks, we recommend 8 CPU cores, 16GB RAM, 500GB SSD storage, and redundant internet connections. The platform will automatically check if your infrastructure meets these requirements during the deployment process.'
    },
    {
      id: 'faq-3',
      question: 'How do I monitor the health of my network?',
      answer: 'The platform provides a comprehensive monitoring dashboard for each network. Navigate to your network details page and select the "Monitoring" tab. Here you can view real-time metrics including block production, validator performance, network throughput, and resource utilization. You can also set up custom alerts based on specific thresholds for various metrics.'
    },
    {
      id: 'faq-4',
      question: 'What security measures does the platform implement?',
      answer: 'Our platform implements multiple security layers including: secure key management with HSM support, automated security patching, DDoS protection, network isolation, intrusion detection, and regular security audits. All communications are encrypted using TLS, and we provide options for IP whitelisting and multi-factor authentication for administrative access.'
    },
    {
      id: 'faq-5',
      question: 'How can I upgrade my blockchain network?',
      answer: 'To upgrade your network, go to the network details page and select the "Configuration" tab. Click on "Schedule Upgrade" to choose the new version and set the upgrade height or time. The platform will automatically handle the upgrade process across all nodes while ensuring consensus is maintained. You can also test upgrades on a staging environment before applying them to production.'
    },
    {
      id: 'faq-6',
      question: 'What types of networks can I deploy with this platform?',
      answer: 'Our platform supports deploying various types of networks including Cosmos SDK-based chains, Substrate-based networks, and custom blockchain implementations. You can create public permissionless networks, private permissioned networks, or hybrid configurations depending on your specific use case and requirements.'
    },
    {
      id: 'faq-7',
      question: 'How do I get technical support?',
      answer: 'Technical support is available through multiple channels. You can open a support ticket directly from the dashboard, join our community Discord server for community-based help, or email support@opencryptofoundation.org. Enterprise customers also have access to dedicated support managers and priority response times.'
    }
  ];
  
  // Popular articles
  const popularArticles = [
    {
      title: 'Setting Up Your First Validator Node',
      category: 'Getting Started',
      views: 12453
    },
    {
      title: 'Configuring Governance Parameters',
      category: 'Network Deployment',
      views: 8976
    },
    {
      title: 'Monitoring Network Performance',
      category: 'Monitoring & Management',
      views: 7654
    },
    {
      title: 'Security Best Practices for Node Operators',
      category: 'Security',
      views: 6543
    },
    {
      title: 'Troubleshooting Common Network Issues',
      category: 'Troubleshooting',
      views: 5432
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout title="Help Center">
      {/* Search Bar */}
      <Box sx={{ 
        mb: theme.spacing.xl, 
        maxWidth: '800px', 
        mx: 'auto',
        textAlign: 'center' 
      }}>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
          Find answers to your questions about using the Cosmos Deploy Platform
        </Typography>
        <TextField
          fullWidth
          placeholder="Search for help articles, FAQs, or topics..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.colors.text.secondary }} />
              </InputAdornment>
            ),
            style: { 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: theme.colors.border.light },
              '&:hover fieldset': { borderColor: theme.colors.border.medium },
              '&.Mui-focused fieldset': { borderColor: theme.colors.accent }
            }
          }}
        />
      </Box>

      {/* Tabs for different content */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ 
          mb: theme.spacing.xl,
          '& .MuiTabs-indicator': {
            backgroundColor: theme.colors.accent
          },
          '& .MuiTab-root': {
            color: theme.colors.text.secondary,
            '&.Mui-selected': {
              color: theme.colors.text.accent
            }
          }
        }}
      >
        <Tab label="Documentation" />
        <Tab label="FAQs" />
        <Tab label="Support" />
      </Tabs>

      {/* Documentation Tab */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
            Documentation
          </Typography>
          
          {/* Categories */}
          <Grid container spacing={3} sx={{ mb: theme.spacing.xl }}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  backgroundColor: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border.light}`,
                  height: '100%',
                  '&:hover': {
                    borderColor: theme.colors.accent,
                    cursor: 'pointer'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', p: theme.spacing.lg }}>
                    <Box sx={{ mb: 2 }}>
                      {category.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      {category.count} Articles
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Popular Articles */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent, mb: theme.spacing.md }}>
              Popular Articles
            </Typography>
            <List>
              {popularArticles.map((article, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.small,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: theme.colors.background.tertiary
                    }
                  }}
                >
                  <ListItemIcon>
                    <ArticleIcon sx={{ color: theme.colors.accent }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={article.title} 
                    secondary={`${article.category} • ${article.views.toLocaleString()} views`}
                    primaryTypographyProps={{ color: theme.colors.text.primary }}
                    secondaryTypographyProps={{ color: theme.colors.text.secondary }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      )}

      {/* FAQs Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
            Frequently Asked Questions
          </Typography>
          
          {filteredFaqs.length > 0 ? (
            <Box>
              {filteredFaqs.map((faq) => (
                <Accordion 
                  key={faq.id}
                  expanded={expandedFaq === faq.id}
                  onChange={handleFaqChange(faq.id)}
                  sx={{
                    backgroundColor: theme.colors.background.secondary,
                    color: theme.colors.text.primary,
                    mb: theme.spacing.sm,
                    border: `1px solid ${expandedFaq === faq.id ? theme.colors.accent : theme.colors.border.light}`,
                    borderRadius: '4px !important',
                    '&:before': {
                      display: 'none',
                    },
                    '&.Mui-expanded': {
                      margin: `0 0 ${theme.spacing.sm}px`,
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: theme.colors.text.primary }} />}
                    aria-controls={`${faq.id}-content`}
                    id={`${faq.id}-header`}
                  >
                    <Typography sx={{ fontWeight: theme.typography.fontWeight.medium, color: expandedFaq === faq.id ? theme.colors.text.accent : theme.colors.text.primary }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ borderTop: `1px solid ${theme.colors.border.light}` }}>
                    <Typography>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: theme.spacing.xl,
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.medium,
              border: `1px solid ${theme.colors.border.light}`
            }}>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                No FAQs found matching your search
              </Typography>
              <Typography variant="body1" sx={{ color: theme.colors.text.secondary, mb: 3 }}>
                Try using different keywords or browse all FAQs
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSearchQuery('')}
                sx={{
                  color: theme.colors.accent,
                  borderColor: theme.colors.accent,
                  '&:hover': {
                    borderColor: theme.colors.accentLight,
                    backgroundColor: 'rgba(204, 255, 0, 0.1)'
                  }
                }}
              >
                Clear Search
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Support Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
            Get Support
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.light}`,
                height: '100%'
              }}>
                <CardContent sx={{ p: theme.spacing.lg }}>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                    Technical Support
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Experiencing issues with your blockchain deployment? Our technical support team is available to help.
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
                    Response time: Within 24 hours (Standard), 4 hours (Enterprise)
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.colors.accent,
                      color: '#000000',
                      fontWeight: theme.typography.fontWeight.bold,
                      '&:hover': {
                        backgroundColor: theme.colors.accentLight
                      },
                      mt: theme.spacing.md
                    }}
                  >
                    Open Support Ticket
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.light}`,
                height: '100%'
              }}>
                <CardContent sx={{ p: theme.spacing.lg }}>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                    Community Support
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Join our community channels to connect with other users and get help from the community.
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
                    Active community with thousands of members and dedicated moderators
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: theme.spacing.md }}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          color: theme.colors.accent,
                          borderColor: theme.colors.accent,
                          '&:hover': {
                            borderColor: theme.colors.accentLight,
                            backgroundColor: 'rgba(204, 255, 0, 0.1)'
                          }
                        }}
                      >
                        Discord Community
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          color: theme.colors.accent,
                          borderColor: theme.colors.accent,
                          '&:hover': {
                            borderColor: theme.colors.accentLight,
                            backgroundColor: 'rgba(204, 255, 0, 0.1)'
                          }
                        }}
                      >
                        Forum
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Contact Information */}
          <Box sx={{ mt: theme.spacing.xl }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
              Contact Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: theme.spacing.md, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.medium }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: theme.colors.text.accent }}>
                    Email Support
                  </Typography>
                  <Typography variant="body2">
                    <a href="mailto:support@opencryptofoundation.org" style={{ color: theme.colors.text.primary, textDecoration: 'none' }}>
                      support@opencryptofoundation.org
                    </a>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: theme.spacing.md, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.medium }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: theme.colors.text.accent }}>
                    Phone Support
                  </Typography>
                  <Typography variant="body2">
                    <a href="tel:+18885550123" style={{ color: theme.colors.text.primary, textDecoration: 'none' }}>
                      +1 (888) 555-0123
                    </a>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: theme.spacing.md, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.medium }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: theme.colors.text.accent }}>
                    Business Hours
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.primary }}>
                    24/7 for Priority Support<br />
                    Mon-Fri: 9AM-5PM PST (Standard)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </PageLayout>
  );
};

export default HelpCenter;
