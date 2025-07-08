import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * Careers page with job listings and company benefits
 * @returns {JSX.Element} Careers component
 */
const Careers = () => {
  const theme = useTheme();
  const [expandedJob, setExpandedJob] = useState(false);
  
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedJob(isExpanded ? panel : false);
  };
  
  const benefits = [
    "Competitive salary with equity options",
    "Remote-first work environment with flexible hours",
    "Annual learning and development stipend",
    "Comprehensive health, dental, and vision insurance",
    "401(k) matching program",
    "Home office setup allowance",
    "Regular team retreats and events",
    "Generous paid time off and parental leave"
  ];
  
  const jobOpenings = [
    {
      id: 'senior-blockchain-developer',
      title: 'Senior Blockchain Developer',
      department: 'Engineering',
      location: 'Remote (US/EU)',
      type: 'Full-time',
      skills: ['Solidity', 'Rust', 'Go', 'Smart Contracts', 'Consensus Algorithms'],
      description: 'We are looking for an experienced blockchain developer to join our core protocol team. In this role, you will be responsible for designing and implementing core components of our blockchain infrastructure, focusing on scalability, security, and interoperability.',
      responsibilities: [
        'Design and implement core blockchain protocol features',
        'Create and optimize smart contract architecture',
        'Develop and maintain consensus algorithms and network protocols',
        'Collaborate with research teams to implement cryptographic primitives',
        'Write well-documented, maintainable, and testable code'
      ],
      requirements: [
        '5+ years of experience in software development',
        '3+ years of experience in blockchain development',
        'Strong understanding of cryptographic principles',
        'Experience with Solidity, Rust, or similar languages',
        'Knowledge of distributed systems concepts and challenges',
        'Excellent problem-solving and communication skills'
      ]
    },
    {
      id: 'cryptography-researcher',
      title: 'Cryptography Researcher',
      department: 'Research',
      location: 'Remote or San Francisco, CA',
      type: 'Full-time',
      skills: ['Zero-knowledge Proofs', 'Cryptography', 'Mathematics', 'Research'],
      description: 'Join our research team to advance the state of the art in applied cryptography for blockchain systems. You will work on developing novel cryptographic protocols, with a focus on zero-knowledge proof systems, multi-party computation, and their applications in blockchain.',
      responsibilities: [
        'Conduct research on cryptographic protocols for blockchain applications',
        'Develop and implement efficient zero-knowledge proof systems',
        'Collaborate with engineering teams to implement theoretical findings',
        'Publish research findings in academic papers and at conferences',
        'Represent the company at academic and industry events'
      ],
      requirements: [
        'PhD or MS in Computer Science, Mathematics, or related field',
        'Strong background in cryptography and security',
        'Experience with zero-knowledge proofs, MPC, or other advanced cryptographic techniques',
        'Research publication record preferred',
        'Programming experience in languages such as Rust, C++, or Python'
      ]
    },
    {
      id: 'product-manager',
      title: 'Product Manager, Blockchain Tooling',
      department: 'Product',
      location: 'Remote (Global)',
      type: 'Full-time',
      skills: ['Product Management', 'Blockchain', 'Developer Experience', 'Agile'],
      description: 'We\'re seeking a product manager to lead our developer tooling initiatives. You will be responsible for defining the product vision, roadmap, and features for our blockchain development toolchain, focusing on developer experience and productivity.',
      responsibilities: [
        'Define product strategy and roadmap for blockchain developer tools',
        'Gather and prioritize requirements from stakeholders and community',
        'Work with engineering teams to deliver high-quality products',
        'Analyze market trends and competitive landscape',
        'Engage with developer community to understand needs and pain points'
      ],
      requirements: [
        '3+ years of product management experience',
        'Experience with developer tools or platforms',
        'Understanding of blockchain technology and ecosystem',
        'Strong analytical and problem-solving skills',
        'Excellent communication and stakeholder management abilities'
      ]
    }
  ];

  return (
    <PageLayout title="Careers at Open Crypto Foundation">
      <Box sx={{ mb: theme.spacing.xl }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.colors.text.accent }}>
          Join Our Mission
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
          We're building the future of decentralized technology, and we need passionate individuals to join us on this journey. 
          At Open Crypto Foundation, you'll work on cutting-edge blockchain technology while collaborating with some of the 
          brightest minds in the industry.
        </Typography>
        <Typography variant="body1" paragraph>
          Our culture values innovation, intellectual curiosity, collaboration, and impact. We believe in empowering our team 
          members to take ownership of their work and contribute meaningfully to our shared vision of a more equitable and 
          decentralized digital infrastructure.
        </Typography>
      </Box>
      
      <Box sx={{ mb: theme.spacing.xl }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.colors.text.accent }}>
          Why Join Us?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.light}`,
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
                  Our Benefits
                </Typography>
                <List>
                  {benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.colors.accent }} />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.light}`,
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
                  Our Values
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
                    Innovation
                  </Typography>
                  <Typography variant="body2" paragraph>
                    We push the boundaries of what's possible in blockchain technology, constantly seeking new solutions to complex challenges.
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
                    Transparency
                  </Typography>
                  <Typography variant="body2" paragraph>
                    We operate with openness in our work, our code, and our communication, both internally and with our community.
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
                    Collaboration
                  </Typography>
                  <Typography variant="body2" paragraph>
                    We believe the best ideas emerge from diverse perspectives working together toward common goals.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
                    Impact
                  </Typography>
                  <Typography variant="body2">
                    We measure our success by the positive change our technology brings to the world.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Box>
        <Typography variant="h4" gutterBottom sx={{ color: theme.colors.text.accent, mb: theme.spacing.lg }}>
          Open Positions
        </Typography>
        
        {jobOpenings.map((job) => (
          <Accordion 
            key={job.id}
            expanded={expandedJob === job.id}
            onChange={handleAccordionChange(job.id)}
            sx={{
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              mb: theme.spacing.md,
              border: `1px solid ${expandedJob === job.id ? theme.colors.accent : theme.colors.border.light}`,
              borderRadius: theme.borderRadius.small,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: `0 0 ${theme.spacing.md}px`,
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: theme.colors.text.primary }} />}
              aria-controls={`${job.id}-content`}
              id={`${job.id}-header`}
              sx={{ borderBottom: expandedJob === job.id ? `1px solid ${theme.colors.border.light}` : 'none' }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="h6" sx={{ color: theme.colors.text.accent, fontWeight: theme.typography.fontWeight.bold }}>
                  {job.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkOutlineIcon sx={{ fontSize: 18, color: theme.colors.text.secondary, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      {job.department}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: theme.colors.text.secondary, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      {job.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: theme.colors.text.secondary, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      {job.type}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="body1" sx={{ mb: theme.spacing.md }}>
                  {job.description}
                </Typography>
                
                <Box sx={{ mb: theme.spacing.md }}>
                  <Typography variant="subtitle1" sx={{ color: theme.colors.text.accent, fontWeight: theme.typography.fontWeight.bold, mb: 1 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.skills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        size="small" 
                        sx={{ 
                          backgroundColor: theme.colors.background.tertiary,
                          color: theme.colors.text.primary,
                          border: `1px solid ${theme.colors.border.light}`
                        }} 
                      />
                    ))}
                  </Box>
                </Box>
                
                <Divider sx={{ my: theme.spacing.md, borderColor: theme.colors.border.light }} />
                
                <Box sx={{ mb: theme.spacing.md }}>
                  <Typography variant="subtitle1" sx={{ color: theme.colors.text.accent, fontWeight: theme.typography.fontWeight.bold, mb: 1 }}>
                    Responsibilities
                  </Typography>
                  <List dense disablePadding>
                    {job.responsibilities.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: '36px' }}>
                          <CheckCircleOutlineIcon sx={{ color: theme.colors.accent }} />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Box sx={{ mb: theme.spacing.md }}>
                  <Typography variant="subtitle1" sx={{ color: theme.colors.text.accent, fontWeight: theme.typography.fontWeight.bold, mb: 1 }}>
                    Requirements
                  </Typography>
                  <List dense disablePadding>
                    {job.requirements.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: '36px' }}>
                          <CheckCircleOutlineIcon sx={{ color: theme.colors.accent }} />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Box sx={{ mt: theme.spacing.lg, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.colors.accent,
                      color: '#000000',
                      fontWeight: theme.typography.fontWeight.bold,
                      '&:hover': {
                        backgroundColor: theme.colors.accentLight
                      },
                      py: theme.spacing.sm,
                      px: theme.spacing.lg
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
        
        <Box sx={{ mt: theme.spacing.lg, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            Don't see a position that matches your skills? We're always looking for talented individuals to join our team.
          </Typography>
          <Button
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
            Send General Application
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default Careers;
