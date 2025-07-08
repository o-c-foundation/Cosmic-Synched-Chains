import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Button
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * Blog page with articles and filtering
 * @returns {JSX.Element} Blog component
 */
const Blog = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Blog post data
  const blogPosts = [
    {
      id: 1,
      title: 'Introducing Syncron: Next-Generation Blockchain Infrastructure',
      excerpt: 'We're excited to announce our latest protocol development, Syncron, which addresses fundamental scalability and security challenges in blockchain systems...',
      image: '/assets/images/blog/syncron-protocol.png',
      author: 'Dr. Sarah Chen',
      date: 'July 2, 2025',
      category: 'protocol',
      readTime: '8 min read'
    },
    {
      id: 2,
      title: 'Zero-Knowledge Proofs: A Technical Deep Dive',
      excerpt: 'Zero-knowledge proofs allow one party to prove to another that a statement is true without revealing any additional information. In this technical article...',
      image: '/assets/images/blog/zk-proofs.png',
      author: 'Aisha Patel',
      date: 'June 24, 2025',
      category: 'research',
      readTime: '12 min read'
    },
    {
      id: 3,
      title: 'The Path to Cross-Chain Interoperability',
      excerpt: 'As blockchain ecosystems multiply, the need for seamless cross-chain communication becomes increasingly important. Our latest research explores...',
      image: '/assets/images/blog/cross-chain.png',
      author: 'Michael Rodriguez',
      date: 'June 15, 2025',
      category: 'research',
      readTime: '10 min read'
    },
    {
      id: 4,
      title: 'Cosmos Deploy Platform: Product Updates Q2 2025',
      excerpt: 'This quarter, we've introduced several major improvements to the Cosmos Deploy Platform, including enhanced monitoring tools, automated security scanning...',
      image: '/assets/images/blog/q2-update.png',
      author: 'Elena Martinez',
      date: 'June 10, 2025',
      category: 'product',
      readTime: '5 min read'
    },
    {
      id: 5,
      title: 'Decentralized Governance: Best Practices for DAOs',
      excerpt: 'Decentralized Autonomous Organizations (DAOs) represent a new paradigm in organizational structure. Based on our research and experience...',
      image: '/assets/images/blog/dao-governance.png',
      author: 'James Wilson',
      date: 'May 28, 2025',
      category: 'governance',
      readTime: '9 min read'
    },
    {
      id: 6,
      title: 'Security Auditing for Smart Contracts: A Comprehensive Guide',
      excerpt: 'Smart contract vulnerabilities can lead to significant financial losses. Our security team has compiled a comprehensive guide to auditing and securing...',
      image: '/assets/images/blog/security-audit.png',
      author: 'Sophia Wang',
      date: 'May 15, 2025',
      category: 'security',
      readTime: '11 min read'
    }
  ];

  // Categories for filtering
  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Protocol', value: 'protocol' },
    { label: 'Research', value: 'research' },
    { label: 'Product', value: 'product' },
    { label: 'Security', value: 'security' },
    { label: 'Governance', value: 'governance' }
  ];

  // Filter posts based on search query and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination settings
  const postsPerPage = 4;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top on page change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <PageLayout title="Blog">
      <Box sx={{ mb: theme.spacing.xl }}>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
          Stay up to date with the latest in blockchain technology, protocol development, 
          research insights, and product updates from the Open Crypto Foundation team.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Left sidebar - filters */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: { md: 'sticky' }, top: '100px' }}>
            {/* Search */}
            <Box sx={{ mb: theme.spacing.lg }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Search
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search articles..."
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
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border.light
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
            
            {/* Categories */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleCategoryChange(category.value)}
                    sx={{
                      justifyContent: 'flex-start',
                      backgroundColor: selectedCategory === category.value ? theme.colors.accent : 'transparent',
                      color: selectedCategory === category.value ? '#000000' : theme.colors.text.primary,
                      borderColor: theme.colors.border.light,
                      '&:hover': {
                        backgroundColor: selectedCategory === category.value ? theme.colors.accentLight : 'rgba(204, 255, 0, 0.1)',
                        borderColor: theme.colors.accent
                      }
                    }}
                  >
                    {category.label}
                  </Button>
                ))}
              </Box>
            </Box>
            
            {/* Featured article */}
            <Box sx={{ mt: theme.spacing.xl }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Featured Article
              </Typography>
              <Card sx={{ 
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.light}`,
                '&:hover': {
                  borderColor: theme.colors.accent
                }
              }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="/assets/images/blog/featured.png"
                  alt="Featured article"
                  sx={{ backgroundColor: theme.colors.background.tertiary }}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ color: theme.colors.text.accent, fontWeight: theme.typography.fontWeight.bold }}>
                    The Future of Decentralized Finance: Trends to Watch in 2026
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: theme.colors.text.secondary, mr: 0.5 }} />
                    <Typography variant="caption" sx={{ color: theme.colors.text.secondary, mr: 1 }}>
                      June 30, 2025
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                      15 min read
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Grid>
        
        {/* Right side - articles */}
        <Grid item xs={12} md={9}>
          {displayedPosts.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {displayedPosts.map((post) => (
                  <Grid item xs={12} sm={6} key={post.id}>
                    <Card sx={{ 
                      backgroundColor: theme.colors.background.secondary,
                      border: `1px solid ${theme.colors.border.light}`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        borderColor: theme.colors.accent
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={post.image}
                        alt={post.title}
                        sx={{ backgroundColor: theme.colors.background.tertiary }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ mb: 1 }}>
                          <Chip 
                            label={post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                            size="small"
                            sx={{ 
                              backgroundColor: theme.colors.accent,
                              color: '#000000',
                              fontWeight: theme.typography.fontWeight.medium
                            }}
                          />
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.bold }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
                          {post.excerpt}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ fontSize: 16, color: theme.colors.text.secondary, mr: 0.5 }} />
                            <Typography variant="caption" sx={{ color: theme.colors.text.secondary, mr: 1 }}>
                              {post.author}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon sx={{ fontSize: 14, color: theme.colors.text.secondary, mr: 0.5 }} />
                            <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                              {post.date} · {post.readTime}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: theme.spacing.xl }}>
                  <Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: theme.colors.text.primary,
                      },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: theme.colors.accent,
                        color: '#000000'
                      }
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: theme.spacing.xl,
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.medium,
              border: `1px solid ${theme.colors.border.light}`
            }}>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                No articles found
              </Typography>
              <Typography variant="body1" sx={{ color: theme.colors.text.secondary, mb: 3 }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                sx={{
                  color: theme.colors.accent,
                  borderColor: theme.colors.accent,
                  '&:hover': {
                    borderColor: theme.colors.accentLight,
                    backgroundColor: 'rgba(204, 255, 0, 0.1)'
                  }
                }}
              >
                Reset Filters
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default Blog;
