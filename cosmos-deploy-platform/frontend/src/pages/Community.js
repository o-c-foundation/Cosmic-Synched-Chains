import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
  Chip,
  Link
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';
import CodeIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import LinkIcon from '@mui/icons-material/Link';

/**
 * Community page with forums, events, and resources
 * @returns {JSX.Element} Community component
 */
const Community = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Community channels data
  const communityChannels = [
    {
      name: 'Discord',
      description: 'Join our active Discord community for real-time discussions and support.',
      link: 'https://discord.gg/cosmos-deploy',
      icon: <ForumIcon sx={{ fontSize: 40, color: theme.colors.accent }} />
    },
    {
      name: 'GitHub',
      description: 'Contribute to our open source repositories and help improve the platform.',
      link: 'https://github.com/cosmos-deploy',
      icon: <GitHubIcon sx={{ fontSize: 40, color: theme.colors.accent }} />
    },
    {
      name: 'Telegram',
      description: 'Connect with our community on Telegram for announcements and chat.',
      link: 'https://t.me/cosmos-deploy',
      icon: <TelegramIcon sx={{ fontSize: 40, color: theme.colors.accent }} />
    },
    {
      name: 'Twitter',
      description: 'Follow us on Twitter for the latest updates and blockchain news.',
      link: 'https://twitter.com/cosmos-deploy',
      icon: <TwitterIcon sx={{ fontSize: 40, color: theme.colors.accent }} />
    },
    {
      name: 'Reddit',
      description: 'Join our subreddit for in-depth discussions and community support.',
      link: 'https://reddit.com/r/cosmos-deploy',
      icon: <RedditIcon sx={{ fontSize: 40, color: theme.colors.accent }} />
    },
    {
      name: 'Forum',
      description: 'Participate in our forum for technical discussions and governance proposals.',
      link: 'https://forum.cosmos-deploy.org',
      icon: <ArticleIcon sx={{ fontSize: 40, color: theme.colors.accent }} />
    }
  ];
  
  // Upcoming events data
  const upcomingEvents = [
    {
      id: 'event-1',
      title: 'Cosmos Deploy Platform v2.0 Launch',
      date: '2025-08-15T18:00:00Z',
      location: 'Virtual',
      description: 'Join us for the launch of Cosmos Deploy Platform v2.0 with exciting new features and improvements.',
      image: 'https://placehold.co/600x300/000000/CCFF00?text=Platform+Launch',
      registrationLink: '#register'
    },
    {
      id: 'event-2',
      title: 'Blockchain Deployment Workshop',
      date: '2025-08-22T14:00:00Z',
      location: 'Virtual',
      description: 'Learn how to deploy and manage your own blockchain networks with our expert team.',
      image: 'https://placehold.co/600x300/000000/CCFF00?text=Workshop',
      registrationLink: '#register'
    },
    {
      id: 'event-3',
      title: 'Cosmos Ecosystem Meetup',
      date: '2025-09-05T17:00:00Z',
      location: 'San Francisco, CA',
      description: 'Connect with other developers and enthusiasts from the Cosmos ecosystem.',
      image: 'https://placehold.co/600x300/000000/CCFF00?text=Meetup',
      registrationLink: '#register'
    }
  ];
  
  // Community projects data
  const communityProjects = [
    {
      title: 'Validator Dashboard',
      description: 'An open-source dashboard for monitoring validator performance across multiple networks.',
      author: 'CosmosUser42',
      technologies: ['React', 'Node.js', 'GraphQL'],
      stars: 128,
      link: 'https://github.com/cosmos-deploy/validator-dashboard'
    },
    {
      title: 'Network Explorer',
      description: 'A customizable block explorer for Cosmos-based blockchains with advanced filtering capabilities.',
      author: 'BlockchainDev',
      technologies: ['Vue.js', 'Go', 'PostgreSQL'],
      stars: 89,
      link: 'https://github.com/cosmos-deploy/network-explorer'
    },
    {
      title: 'Deploy CLI',
      description: 'Command-line interface for deploying and managing blockchain networks from your terminal.',
      author: 'CommandLineFan',
      technologies: ['Python', 'Docker', 'Kubernetes'],
      stars: 215,
      link: 'https://github.com/cosmos-deploy/deploy-cli'
    },
    {
      title: 'Mobile Wallet Integration',
      description: 'SDK for integrating Cosmos Deploy networks with mobile wallet applications.',
      author: 'MobileDevPro',
      technologies: ['Kotlin', 'Swift', 'JavaScript'],
      stars: 76,
      link: 'https://github.com/cosmos-deploy/mobile-wallet-sdk'
    }
  ];
  
  // Forum posts data
  const forumPosts = [
    {
      title: 'Best Practices for Secure Validator Setup',
      author: {
        name: 'SecurityExpert',
        avatar: 'https://placehold.co/40/CCFF00/000000?text=SE'
      },
      date: '2025-07-10T12:35:00Z',
      replies: 24,
      views: 1893,
      category: 'Security'
    },
    {
      title: 'How to Optimize Your Node Performance',
      author: {
        name: 'PerformanceGuru',
        avatar: 'https://placehold.co/40/CCFF00/000000?text=PG'
      },
      date: '2025-07-08T09:21:00Z',
      replies: 17,
      views: 1245,
      category: 'Performance'
    },
    {
      title: 'Proposal: Improve Network Governance UI',
      author: {
        name: 'GovernanceAdvocate',
        avatar: 'https://placehold.co/40/CCFF00/000000?text=GA'
      },
      date: '2025-07-05T15:47:00Z',
      replies: 32,
      views: 2156,
      category: 'Governance'
    },
    {
      title: 'Custom Modules Development Tutorial',
      author: {
        name: 'ModuleMaster',
        avatar: 'https://placehold.co/40/CCFF00/000000?text=MM'
      },
      date: '2025-07-03T11:14:00Z',
      replies: 12,
      views: 987,
      category: 'Development'
    },
    {
      title: 'Network Monitoring Tool Comparison',
      author: {
        name: 'MonitoringExpert',
        avatar: 'https://placehold.co/40/CCFF00/000000?text=ME'
      },
      date: '2025-07-01T16:28:00Z',
      replies: 19,
      views: 1432,
      category: 'Tools'
    }
  ];
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <PageLayout title="Community">
      {/* Hero Section */}
      <Box sx={{ 
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.border.light}`,
        borderRadius: theme.borderRadius.medium,
        p: theme.spacing.xl,
        textAlign: 'center',
        mb: theme.spacing.xl
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.colors.text.accent }}>
          Join Our Growing Community
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mb: theme.spacing.lg }}>
          Connect with developers, validators, and blockchain enthusiasts from around the world.
          Share knowledge, collaborate on projects, and help shape the future of blockchain deployment.
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" sx={{ mb: theme.spacing.lg }}>
          <Grid item>
            <Button 
              variant="contained"
              startIcon={<ForumIcon />}
              sx={{
                backgroundColor: theme.colors.accent,
                color: '#000000',
                fontWeight: theme.typography.fontWeight.bold,
                '&:hover': {
                  backgroundColor: theme.colors.accentLight
                }
              }}
            >
              Join Discord
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined"
              startIcon={<GitHubIcon />}
              sx={{
                color: theme.colors.accent,
                borderColor: theme.colors.accent,
                '&:hover': {
                  borderColor: theme.colors.accentLight,
                  backgroundColor: 'rgba(204, 255, 0, 0.1)'
                }
              }}
            >
              GitHub Repos
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: theme.spacing.md }}>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
            <strong>5,000+</strong> Community Members
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
            <strong>120+</strong> Open Source Contributors
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
            <strong>50+</strong> Community Projects
          </Typography>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ 
        mb: theme.spacing.xl, 
        display: 'flex',
        alignItems: 'center'
      }}>
        <TextField
          fullWidth
          placeholder="Search the community..."
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
        <Tab label="Channels" icon={<PeopleIcon />} iconPosition="start" />
        <Tab label="Events" icon={<EventIcon />} iconPosition="start" />
        <Tab label="Forum" icon={<ForumIcon />} iconPosition="start" />
        <Tab label="Projects" icon={<CodeIcon />} iconPosition="start" />
      </Tabs>

      {/* Channels Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {communityChannels.map((channel, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.light}`,
                height: '100%',
                '&:hover': {
                  borderColor: theme.colors.accent,
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: theme.spacing.md }}>
                    {channel.icon}
                    <Typography variant="h6" sx={{ ml: 2, color: theme.colors.text.primary }}>
                      {channel.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: theme.spacing.md, color: theme.colors.text.secondary }}>
                    {channel.description}
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<LinkIcon />}
                    component="a"
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: theme.colors.accent,
                      borderColor: theme.colors.accent,
                      '&:hover': {
                        borderColor: theme.colors.accentLight,
                        backgroundColor: 'rgba(204, 255, 0, 0.1)'
                      }
                    }}
                  >
                    Join {channel.name}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Events Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {upcomingEvents.map((event) => (
            <Grid item xs={12} md={4} key={event.id}>
              <Card sx={{ 
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.light}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={event.image}
                  alt={event.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
                    {event.title}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1, color: theme.colors.text.accent }}>
                    <EventIcon fontSize="small" sx={{ mr: 1 }} />
                    {formatDate(event.date)}
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
                    Location: {event.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: theme.colors.text.primary }}>
                    {event.description}
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    href={event.registrationLink}
                    sx={{
                      backgroundColor: theme.colors.accent,
                      color: '#000000',
                      fontWeight: theme.typography.fontWeight.bold,
                      '&:hover': {
                        backgroundColor: theme.colors.accentLight
                      }
                    }}
                  >
                    Register
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Forum Tab */}
      {tabValue === 2 && (
        <Box>
          <Box sx={{ 
            p: theme.spacing.md, 
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: theme.borderRadius.medium,
            mb: theme.spacing.lg,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ color: theme.colors.text.primary }}>
              Recent Forum Discussions
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: theme.colors.accent,
                borderColor: theme.colors.accent,
                '&:hover': {
                  borderColor: theme.colors.accentLight,
                  backgroundColor: 'rgba(204, 255, 0, 0.1)'
                }
              }}
            >
              New Topic
            </Button>
          </Box>
          
          {forumPosts.map((post, index) => (
            <Card 
              key={index} 
              sx={{ 
                mb: theme.spacing.md, 
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.light}`,
                '&:hover': {
                  backgroundColor: theme.colors.background.tertiary,
                  cursor: 'pointer'
                }
              }}
            >
              <CardContent sx={{ '&:last-child': { pb: theme.spacing.md } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                    {post.title}
                  </Typography>
                  <Chip 
                    label={post.category} 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'rgba(204, 255, 0, 0.2)', 
                      color: theme.colors.accent,
                      borderRadius: '4px'
                    }} 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={post.author.avatar} 
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      {post.author.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mx: 1, color: theme.colors.text.secondary }}>•</Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      {formatDate(post.date)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    {post.replies} replies • {post.views} views
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
          
          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: theme.spacing.md,
              color: theme.colors.accent,
              borderColor: theme.colors.accent,
              '&:hover': {
                borderColor: theme.colors.accentLight,
                backgroundColor: 'rgba(204, 255, 0, 0.1)'
              }
            }}
          >
            View All Forum Topics
          </Button>
        </Box>
      )}

      {/* Projects Tab */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          {communityProjects.map((project, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ 
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.light}`,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: theme.colors.text.secondary }}>
                    By {project.author}
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {project.technologies.map((tech, i) => (
                      <Chip 
                        key={i}
                        label={tech} 
                        size="small" 
                        sx={{ 
                          backgroundColor: theme.colors.background.tertiary, 
                          color: theme.colors.text.primary,
                          borderRadius: '4px'
                        }} 
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      <GitHubIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {project.stars} stars
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: theme.colors.accent,
                        borderColor: theme.colors.accent,
                        '&:hover': {
                          borderColor: theme.colors.accentLight,
                          backgroundColor: 'rgba(204, 255, 0, 0.1)'
                        }
                      }}
                    >
                      View Project
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </PageLayout>
  );
};

export default Community;
