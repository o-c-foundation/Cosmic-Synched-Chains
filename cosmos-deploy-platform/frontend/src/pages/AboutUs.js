import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';

/**
 * About Us page
 * @returns {JSX.Element} AboutUs component
 */
const AboutUs = () => {
  const theme = useTheme();
  
  // Leadership team data
  const leadershipTeam = [
    {
      name: 'Dr. Sarah Chen',
      title: 'CEO & Founder',
      image: '/assets/images/team/sarah.png',
      bio: 'PhD in Distributed Systems with 15+ years experience in blockchain technology and cryptographic research.'
    },
    {
      name: 'Michael Rodriguez',
      title: 'CTO',
      image: '/assets/images/team/michael.png',
      bio: 'Former lead developer at Ethereum Foundation, specializing in consensus algorithms and network security.'
    },
    {
      name: 'Aisha Patel',
      title: 'Chief Cryptography Officer',
      image: '/assets/images/team/aisha.png',
      bio: 'Expert in zero-knowledge proofs with publications in top cryptography journals and conferences.'
    }
  ];
  
  return (
    <PageLayout title="About Us">
      <Box sx={{ mb: theme.spacing.xl }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.colors.text.accent }}>
          Open Crypto Foundation: A Paradigm Shift in Blockchain Security
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
          Establishing a robust framework for secure, transparent, and interoperable decentralized applications through our subsidiary Syncron.
        </Typography>
        <Typography variant="body1" paragraph>
          Pioneering the Syncron blockchain protocol, a next-generation distributed ledger technology that integrates zero-knowledge proofs, 
          sharding mechanisms, and cross-chain interoperability protocols.
        </Typography>
      </Box>
      
      <Box sx={{ mb: theme.spacing.xl }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.colors.text.accent }}>
          Strategic Objectives
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              backgroundColor: theme.colors.background.secondary,
              p: theme.spacing.lg,
              borderRadius: theme.borderRadius.medium,
              height: '100%'
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Technology Development
              </Typography>
              <ul style={{ paddingLeft: theme.spacing.lg }}>
                <li>Architect and implement the Syncron blockchain infrastructure</li>
                <li>Develop advanced cryptographic primitives and security protocols</li>
                <li>Establish comprehensive auditing frameworks for smart contracts</li>
              </ul>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              backgroundColor: theme.colors.background.secondary,
              p: theme.spacing.lg,
              borderRadius: theme.borderRadius.medium,
              height: '100%'
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Ecosystem Growth
              </Typography>
              <ul style={{ paddingLeft: theme.spacing.lg }}>
                <li>Create decentralized governance mechanisms for protocol evolution</li>
                <li>Implement cross-chain interoperability solutions</li>
                <li>Foster developer adoption through comprehensive tooling and documentation</li>
              </ul>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mb: theme.spacing.xl }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.colors.text.accent }}>
          Our Vision
        </Typography>
        <Typography variant="body1" paragraph>
          At the Open Crypto Foundation, we envision a future where blockchain technology serves as the backbone of a more equitable, 
          transparent, and efficient digital economy. Our commitment to developing cutting-edge solutions stems from a belief that 
          decentralized systems can fundamentally transform how we interact, transact, and collaborate in the digital realm.
        </Typography>
        <Typography variant="body1">
          Through rigorous research, innovative development, and community engagement, we are building the infrastructure 
          that will power the next generation of decentralized applications and services.
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="h4" gutterBottom sx={{ color: theme.colors.text.accent, mb: theme.spacing.lg }}>
          Leadership Team
        </Typography>
        <Grid container spacing={4}>
          {leadershipTeam.map((leader, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.light}`,
                height: '100%',
                '&:hover': {
                  border: `1px solid ${theme.colors.border.accent}`,
                }
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={leader.image}
                    alt={leader.name}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      mb: theme.spacing.md,
                      border: `2px solid ${theme.colors.accent}`
                    }}
                  />
                  <Typography variant="h6" sx={{ color: theme.colors.text.accent }}>
                    {leader.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: theme.spacing.sm, color: theme.colors.text.secondary }}>
                    {leader.title}
                  </Typography>
                  <Typography variant="body2">
                    {leader.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageLayout>
  );
};

export default AboutUs;
