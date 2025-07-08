import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Divider 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const About = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box mb={6} textAlign="center">
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#CCFF00',
            mb: 2
          }}
        >
          Open Crypto Foundation
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
        >
          A Paradigm Shift in Blockchain Security
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
        >
          Establishing a robust framework for secure, transparent, and interoperable decentralized applications
        </Typography>
        <Divider sx={{ maxWidth: '50%', mx: 'auto', mb: 4 }} />
      </Box>
      
      {/* Mission Statement */}
      <Box mb={8} sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#CCFF00' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          The Open Crypto Foundation exists to create a safer cryptocurrency ecosystem where users can participate with confidence. 
          We believe the promise of decentralized finance can only be realized when users have the tools and knowledge to 
          protect themselves from scams and exploitative projects.
        </Typography>
        <Typography variant="body1" paragraph>
          "Our vision is a future where cryptocurrency is truly accessible to everyone because the risks are understood, 
          transparent, and manageable."
        </Typography>
        <Typography variant="body1" paragraph>
          The cryptocurrency industry has created unprecedented opportunities for financial inclusion, innovation, and wealth creation. 
          However, for many, these opportunities have been overshadowed by catastrophic losses due to scams, fraud, and exploitation. 
          We are creating an independent foundation dedicated to making crypto safer for everyone through education, open-source tools, 
          and establishing clear standards for projects.
        </Typography>
      </Box>
      
      {/* Syncron Section */}
      <Box mb={8}>
        <Typography variant="h4" gutterBottom sx={{ color: '#CCFF00' }}>
          Syncron: Our Technology Initiative
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              Through our subsidiary Syncron, we are pioneering the Syncron blockchain protocol, a next-generation 
              distributed ledger technology that integrates zero-knowledge proofs, sharding mechanisms, and 
              cross-chain interoperability protocols.
            </Typography>
            <Typography variant="body1" paragraph>
              The Syncron platform represents the culmination of our research and development efforts, designed to 
              address the fundamental challenges of blockchain scalability, security, and accessibility.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              Our comprehensive deployment platform enables organizations to leverage the power of blockchain 
              technology without the traditional barriers to entry, making advanced cryptographic security 
              accessible to a broader range of applications and use cases.
            </Typography>
            <Typography variant="body1" paragraph>
              By simplifying the deployment and management of blockchain infrastructure, we're empowering 
              developers and businesses to focus on building innovative applications rather than managing 
              complex technical infrastructure.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      {/* Strategic Objectives */}
      <Box mb={8}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#CCFF00' }}>
          Strategic Objectives
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2,
              mb: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Blockchain Infrastructure
                </Typography>
                <Typography variant="body2">
                  Architect and implement the Syncron blockchain infrastructure with advanced security features
                  and performance optimizations for enterprise-grade applications.
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2,
              mb: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Cryptographic Primitives
                </Typography>
                <Typography variant="body2">
                  Develop advanced cryptographic primitives and security protocols that enhance 
                  privacy while maintaining compliance with regulatory requirements.
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Smart Contract Auditing
                </Typography>
                <Typography variant="body2">
                  Establish comprehensive auditing frameworks for smart contracts to identify 
                  vulnerabilities before deployment and ensure robust security.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2,
              mb: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Decentralized Governance
                </Typography>
                <Typography variant="body2">
                  Create decentralized governance mechanisms for protocol evolution that balance 
                  efficiency with broad stakeholder participation.
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2,
              mb: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Interoperability Solutions
                </Typography>
                <Typography variant="body2">
                  Implement cross-chain interoperability solutions that enable seamless asset 
                  transfers and communication between disparate blockchain networks.
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Education & Accessibility
                </Typography>
                <Typography variant="body2">
                  Provide educational resources and tools that make blockchain technology 
                  accessible to developers, businesses, and end-users alike.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Values Section */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ color: '#CCFF00' }}>
          Our Values
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Accessibility
                </Typography>
                <Typography variant="body2">
                  We believe blockchain technology should be accessible to everyone, 
                  regardless of their technical background or resources.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Innovation
                </Typography>
                <Typography variant="body2">
                  We continuously push the boundaries of what's possible, finding 
                  creative solutions to complex technical challenges.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: 'background.paper',
              borderLeft: `4px solid #CCFF00`,
              borderRadius: 2
            }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Community
                </Typography>
                <Typography variant="body2">
                  We value our users and contributors, fostering an open, 
                  collaborative ecosystem that benefits everyone involved.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About;
