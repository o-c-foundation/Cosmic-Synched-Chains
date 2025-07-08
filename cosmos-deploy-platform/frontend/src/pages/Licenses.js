import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CodeIcon from '@mui/icons-material/Code';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

/**
 * Licenses page displaying third-party software licenses
 * @returns {JSX.Element} Licenses component
 */
const Licenses = () => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState(false);
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  // License categories
  const categories = [
    { name: 'Frontend Dependencies', count: 15 },
    { name: 'Backend Dependencies', count: 12 },
    { name: 'Infrastructure Tools', count: 8 },
    { name: 'Blockchain Dependencies', count: 10 },
    { name: 'Development Tools', count: 6 }
  ];
  
  // Major licenses with descriptions
  const majorLicenses = [
    {
      id: 'mit',
      name: 'MIT License',
      description: 'A permissive license that is short and to the point. It lets people do anything with your code with proper attribution and without warranty.',
      link: 'https://opensource.org/licenses/MIT'
    },
    {
      id: 'apache',
      name: 'Apache License 2.0',
      description: 'A permissive license that also provides an express grant of patent rights from contributors to users.',
      link: 'https://opensource.org/licenses/Apache-2.0'
    },
    {
      id: 'bsd',
      name: 'BSD 3-Clause License',
      description: 'A permissive license similar to the MIT License, but with a clause prohibiting others from using the name of the project or its contributors to promote derived products without written consent.',
      link: 'https://opensource.org/licenses/BSD-3-Clause'
    },
    {
      id: 'gpl',
      name: 'GNU General Public License v3.0',
      description: 'A copyleft license that requires anyone who distributes your code or a derivative work to make the source available under the same terms.',
      link: 'https://opensource.org/licenses/GPL-3.0'
    },
    {
      id: 'isc',
      name: 'ISC License',
      description: 'A permissive license functionally equivalent to the MIT license but with simpler language.',
      link: 'https://opensource.org/licenses/ISC'
    }
  ];
  
  // Sample list of third-party dependencies
  const dependencies = [
    {
      name: 'React',
      version: '18.2.0',
      license: 'MIT',
      category: 'Frontend Dependencies'
    },
    {
      name: 'Material-UI',
      version: '5.14.5',
      license: 'MIT',
      category: 'Frontend Dependencies'
    },
    {
      name: 'Express',
      version: '4.18.2',
      license: 'MIT',
      category: 'Backend Dependencies'
    },
    {
      name: 'Node.js',
      version: '18.16.1',
      license: 'MIT',
      category: 'Backend Dependencies'
    },
    {
      name: 'MongoDB',
      version: '6.0.6',
      license: 'Server Side Public License (SSPL)',
      category: 'Backend Dependencies'
    },
    {
      name: 'Cosmos SDK',
      version: '0.46.10',
      license: 'Apache 2.0',
      category: 'Blockchain Dependencies'
    },
    {
      name: 'Tendermint Core',
      version: '0.38.0',
      license: 'Apache 2.0',
      category: 'Blockchain Dependencies'
    },
    {
      name: 'Docker',
      version: '24.0.5',
      license: 'Apache 2.0',
      category: 'Infrastructure Tools'
    },
    {
      name: 'Kubernetes',
      version: '1.28.0',
      license: 'Apache 2.0',
      category: 'Infrastructure Tools'
    },
    {
      name: 'Webpack',
      version: '5.88.2',
      license: 'MIT',
      category: 'Development Tools'
    }
  ];

  return (
    <PageLayout title="Third-Party Licenses">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ 
          mb: theme.spacing.lg,
          '& .MuiBreadcrumbs-ol': {
            color: theme.colors.text.secondary
          },
          '& .MuiBreadcrumbs-li': {
            color: theme.colors.text.secondary
          },
          '& .MuiBreadcrumbs-separator': {
            color: theme.colors.text.secondary
          }
        }}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          href="/"
          sx={{ color: theme.colors.text.secondary }}
        >
          Home
        </Link>
        <Typography color="text.primary" sx={{ color: theme.colors.text.accent }}>
          Licenses
        </Typography>
      </Breadcrumbs>

      {/* Introduction Card */}
      <Card sx={{ 
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.border.light}`,
        mb: theme.spacing.xl
      }}>
        <CardContent sx={{ p: theme.spacing.lg }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LibraryBooksIcon sx={{ fontSize: 36, color: theme.colors.accent, mr: 2 }} />
            <Typography variant="h5" sx={{ color: theme.colors.text.accent }}>
              Third-Party Software Licenses
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
            The Cosmos Deploy Platform incorporates numerous third-party open-source software components. 
            We are grateful to the developers who created these resources and make them available under various open-source licenses.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
            This page lists the third-party components used in our platform and their respective licenses. 
            We are committed to complying with all license requirements and supporting the open-source ecosystem.
          </Typography>
        </CardContent>
      </Card>

      {/* License Categories */}
      <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
        License Categories
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          mb: theme.spacing.xl
        }}
      >
        {categories.map((category) => (
          <Card 
            key={category.name}
            sx={{
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.light}`,
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
                {category.name}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
                {category.count} dependencies
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => document.getElementById(category.name.replace(/\s+/g, '_')).scrollIntoView({ behavior: 'smooth' })}
                sx={{
                  color: theme.colors.accent,
                  borderColor: theme.colors.accent,
                  '&:hover': {
                    borderColor: theme.colors.accentLight,
                    backgroundColor: 'rgba(204, 255, 0, 0.1)'
                  }
                }}
              >
                View Dependencies
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Major License Types */}
      <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Major License Types
      </Typography>
      <Box sx={{ mb: theme.spacing.xl }}>
        {majorLicenses.map((license) => (
          <Accordion 
            key={license.id}
            expanded={expandedSection === license.id}
            onChange={handleChange(license.id)}
            sx={{
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              mb: theme.spacing.sm,
              border: `1px solid ${expandedSection === license.id ? theme.colors.accent : theme.colors.border.light}`,
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
              aria-controls={`${license.id}-content`}
              id={`${license.id}-header`}
            >
              <Typography sx={{ fontWeight: theme.typography.fontWeight.medium, color: expandedSection === license.id ? theme.colors.text.accent : theme.colors.text.primary }}>
                {license.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: `1px solid ${theme.colors.border.light}` }}>
              <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
                {license.description}
              </Typography>
              <Button 
                variant="text" 
                href={license.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.colors.accent,
                  '&:hover': {
                    backgroundColor: 'rgba(204, 255, 0, 0.1)'
                  }
                }}
              >
                View Full License Text
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* List of Dependencies */}
      <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Third-Party Dependencies
      </Typography>
      
      {/* Group dependencies by category */}
      {categories.map((category) => {
        const categoryDeps = dependencies.filter(dep => dep.category === category.name);
        return (
          <Box key={category.name} sx={{ mb: theme.spacing.xl }} id={category.name.replace(/\s+/g, '_')}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary, display: 'flex', alignItems: 'center' }}>
              <CodeIcon sx={{ mr: 1, color: theme.colors.accent }} />
              {category.name}
            </Typography>
            <Card sx={{ 
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.light}`
            }}>
              <List disablePadding>
                {categoryDeps.map((dependency, index) => (
                  <React.Fragment key={dependency.name}>
                    <ListItem
                      sx={{
                        py: 2,
                        backgroundColor: index % 2 === 0 ? theme.colors.background.tertiary : 'transparent'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.medium }}>
                              {dependency.name}
                            </Typography>
                            <Chip 
                              label={dependency.license} 
                              size="small" 
                              sx={{ 
                                backgroundColor: theme.colors.background.accent,
                                color: '#000000',
                                fontWeight: theme.typography.fontWeight.medium
                              }} 
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                            Version: {dependency.version}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < categoryDeps.length - 1 && <Divider sx={{ borderColor: theme.colors.border.light }} />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Box>
        );
      })}

      {/* Compliance Notice */}
      <Card sx={{ 
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.border.light}`,
        mb: theme.spacing.xl
      }}>
        <CardContent sx={{ p: theme.spacing.lg }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
            License Compliance
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
            Open Crypto Foundation is committed to open-source license compliance. 
            If you believe we have missed attributing a license or have any other license-related concerns, 
            please contact our legal team at legal@opencryptofoundation.org.
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
            This is not a comprehensive list of all dependencies. 
            For a complete list with full license texts, please refer to the dependency files in our code repository or contact us directly.
          </Typography>
        </CardContent>
      </Card>
      
      {/* Additional Resources */}
      <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Additional Resources
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2,
          mb: theme.spacing.xl
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          href="https://opensource.org/licenses"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: theme.colors.accent,
            borderColor: theme.colors.accent,
            py: 1.5,
            '&:hover': {
              borderColor: theme.colors.accentLight,
              backgroundColor: 'rgba(204, 255, 0, 0.1)'
            }
          }}
        >
          Open Source Initiative
        </Button>
        <Button
          variant="outlined"
          fullWidth
          href="https://choosealicense.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: theme.colors.accent,
            borderColor: theme.colors.accent,
            py: 1.5,
            '&:hover': {
              borderColor: theme.colors.accentLight,
              backgroundColor: 'rgba(204, 255, 0, 0.1)'
            }
          }}
        >
          Choose a License Guide
        </Button>
        <Button
          variant="outlined"
          fullWidth
          href="https://github.com/open-crypto-foundation/cosmos-deploy-platform/blob/main/LICENSE.md"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: theme.colors.accent,
            borderColor: theme.colors.accent,
            py: 1.5,
            '&:hover': {
              borderColor: theme.colors.accentLight,
              backgroundColor: 'rgba(204, 255, 0, 0.1)'
            }
          }}
        >
          Our License
        </Button>
      </Box>
    </PageLayout>
  );
};

export default Licenses;
