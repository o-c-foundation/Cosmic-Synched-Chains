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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CookieIcon from '@mui/icons-material/Cookie';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * Cookie Policy page
 * @returns {JSX.Element} Cookies component
 */
const Cookies = () => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState('section1');
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false
  });
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const handleCookieSettingChange = (setting) => (event) => {
    if (setting === 'essential') return; // Essential cookies can't be disabled
    setCookieSettings({
      ...cookieSettings,
      [setting]: event.target.checked
    });
  };

  // Save cookie preferences (this would connect to a real cookie management system)
  const handleSavePreferences = () => {
    console.log('Saved cookie preferences:', cookieSettings);
    // In a real implementation, this would update cookies and local storage
    alert('Your cookie preferences have been saved.');
  };
  
  // Last updated date
  const lastUpdated = 'July 1, 2025';
  
  // Cookie types and details
  const cookieTypes = [
    {
      type: 'Essential',
      description: 'Essential cookies enable core functionality such as security, network management, and account access. You may disable these by changing your browser settings, but this may affect how the website functions.',
      setting: 'essential',
      examples: [
        {
          name: 'session_id',
          purpose: 'Maintains your authenticated session',
          duration: 'Session'
        },
        {
          name: 'csrf_token',
          purpose: 'Security token that prevents cross-site request forgery',
          duration: 'Session'
        },
        {
          name: 'auth_token',
          purpose: 'Keeps you logged in to the platform',
          duration: '30 days'
        }
      ]
    },
    {
      type: 'Functional',
      description: 'Functional cookies help us to provide enhanced functionality and personalization, such as remembering your preferences and settings. They may be set by us or by third party providers whose services we have added to our pages.',
      setting: 'functional',
      examples: [
        {
          name: 'language_pref',
          purpose: 'Remembers your preferred language setting',
          duration: '1 year'
        },
        {
          name: 'theme_pref',
          purpose: 'Stores your interface theme preferences',
          duration: '1 year'
        },
        {
          name: 'ui_settings',
          purpose: 'Remembers your customized dashboard layout',
          duration: '6 months'
        }
      ]
    },
    {
      type: 'Analytics',
      description: 'Analytics cookies help us to improve our website by collecting and reporting information on how you use it. These cookies collect information in a way that does not directly identify anyone.',
      setting: 'analytics',
      examples: [
        {
          name: '_ga',
          purpose: 'Google Analytics cookie used to distinguish users',
          duration: '2 years'
        },
        {
          name: '_gid',
          purpose: 'Google Analytics cookie used to distinguish users',
          duration: '24 hours'
        },
        {
          name: 'amplitude_id',
          purpose: 'Tracks user behavior to improve user experience',
          duration: '2 years'
        }
      ]
    },
    {
      type: 'Marketing',
      description: 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.',
      setting: 'marketing',
      examples: [
        {
          name: '_fbp',
          purpose: 'Facebook pixel tracking for advertising',
          duration: '3 months'
        },
        {
          name: 'ads_prefs',
          purpose: 'Stores ad personalization preferences',
          duration: '6 months'
        }
      ]
    }
  ];
  
  // Policy sections
  const sections = [
    {
      id: 'section1',
      title: '1. Introduction',
      content: `
        <p>This Cookie Policy explains how the Open Crypto Foundation ("we", "us", or "our") uses cookies and similar technologies when you visit our Cosmos Deploy Platform ("Platform"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
        
        <p>Please read this Cookie Policy carefully to understand our policies and practices regarding cookies and similar technologies. By using or accessing our Platform, you agree to this Cookie Policy. This policy may change from time to time, and your continued use of the Platform after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.</p>
      `
    },
    {
      id: 'section2',
      title: '2. What Are Cookies',
      content: `
        <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
        
        <p>Cookies set by the website owner (in this case, Open Crypto Foundation) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.</p>
        
        <p>We may also use other similar technologies like web beacons (sometimes called "tracking pixels" or "clear gifs") or local storage. Web beacons are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Platform. This allows us, for example, to monitor the traffic patterns of users from one page within our Platform to another, to deliver or communicate with cookies, to understand whether you have come to our Platform from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns.</p>
      `
    },
    {
      id: 'section3',
      title: '3. Why We Use Cookies',
      content: `
        <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Platform. Third parties serve cookies through our Platform for analytics, personalization, and other purposes.</p>
        
        <p>The specific types of cookies served through our Platform and the purposes they perform are described in the table below.</p>
      `
    },
    {
      id: 'section4',
      title: '4. How to Control Cookies',
      content: `
        <p>You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Platform though your access to some functionality and areas of our Platform may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.</p>
        
        <p>In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" style="color: ${theme.colors.accent};">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" style="color: ${theme.colors.accent};">http://www.youronlinechoices.com</a>.</p>
        
        <p>You can also use the cookie settings panel on our Platform to control which optional cookies you allow.</p>
      `
    },
    {
      id: 'section5',
      title: '5. Cookie Lifespan',
      content: `
        <p>The lifespan of a cookie varies significantly, depending on its purpose. Cookies can be classified by their lifespan:</p>
        
        <p><strong>Session Cookies</strong>: These cookies are temporary and expire once you close your browser (or once your session ends).</p>
        
        <p><strong>Persistent Cookies</strong>: These cookies remain on your hard drive until you erase them or they expire. How long a persistent cookie remains on your browser depends on how long the visited website has programmed the cookie to last.</p>
        
        <p>The specific expiration times for each cookie we use are detailed in the table above under each cookie type.</p>
      `
    },
    {
      id: 'section6',
      title: '6. Changes to This Cookie Policy',
      content: `
        <p>We may update this Cookie Policy from time to time to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
        
        <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>
      `
    },
    {
      id: 'section7',
      title: '7. Contact Us',
      content: `
        <p>If you have any questions about our use of cookies or other technologies, please contact us at:</p>
        
        <p>Open Crypto Foundation<br>
        Privacy Department<br>
        123 Blockchain Avenue<br>
        San Francisco, CA 94105<br>
        Email: privacy@opencryptofoundation.org<br>
        Phone: (888) 555-0123</p>
      `
    }
  ];

  return (
    <PageLayout title="Cookie Policy">
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
          Cookie Policy
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
            <CookieIcon sx={{ fontSize: 36, color: theme.colors.accent, mr: 2 }} />
            <Typography variant="h5" sx={{ color: theme.colors.text.accent }}>
              Cosmos Deploy Platform Cookie Policy
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
            This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our platform.
            It explains what these technologies are and why we use them, as well as your rights to control them.
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
            Last Updated: {lastUpdated}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              href="/terms"
              sx={{
                color: theme.colors.accent,
                borderColor: theme.colors.accent,
                '&:hover': {
                  borderColor: theme.colors.accentLight,
                  backgroundColor: 'rgba(204, 255, 0, 0.1)'
                }
              }}
            >
              Terms of Service
            </Button>
            <Button
              variant="outlined"
              href="/privacy"
              sx={{
                color: theme.colors.accent,
                borderColor: theme.colors.accent,
                '&:hover': {
                  borderColor: theme.colors.accentLight,
                  backgroundColor: 'rgba(204, 255, 0, 0.1)'
                }
              }}
            >
              Privacy Policy
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Cookie Settings Card */}
      <Card sx={{ 
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.accent}`,
        mb: theme.spacing.xl
      }}>
        <CardContent sx={{ p: theme.spacing.lg }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SettingsIcon sx={{ fontSize: 28, color: theme.colors.accent, mr: 2 }} />
            <Typography variant="h6" sx={{ color: theme.colors.text.accent }}>
              Your Cookie Preferences
            </Typography>
          </Box>
          <Typography variant="body2" paragraph sx={{ color: theme.colors.text.primary }}>
            You can customize your cookie preferences below. Essential cookies cannot be disabled as they are necessary for the website to function properly.
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            {cookieTypes.map((cookieType) => (
              <FormControlLabel
                key={cookieType.setting}
                control={
                  <Switch 
                    checked={cookieSettings[cookieType.setting]} 
                    onChange={handleCookieSettingChange(cookieType.setting)}
                    disabled={cookieType.setting === 'essential'}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.colors.accent,
                        '&:hover': {
                          backgroundColor: 'rgba(204, 255, 0, 0.1)'
                        }
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: theme.colors.accent
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: theme.colors.text.primary }}>
                    {cookieType.type} Cookies
                  </Typography>
                }
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%', 
                  marginLeft: 0,
                  mb: 1,
                  px: 2,
                  py: 1,
                  borderRadius: theme.borderRadius.small,
                  backgroundColor: theme.colors.background.tertiary,
                  '& .MuiFormControlLabel-label': {
                    flex: 1
                  }
                }}
              />
            ))}
          </Box>
          
          <Button
            variant="contained"
            onClick={handleSavePreferences}
            sx={{
              backgroundColor: theme.colors.accent,
              color: '#000000',
              fontWeight: theme.typography.fontWeight.bold,
              '&:hover': {
                backgroundColor: theme.colors.accentLight
              }
            }}
          >
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Table of Contents
      </Typography>
      <Card sx={{ 
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.border.light}`,
        mb: theme.spacing.xl
      }}>
        <CardContent>
          <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {sections.map((section) => (
              <Box 
                key={section.id}
                component="a" 
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setExpandedSection(section.id);
                  document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  color: theme.colors.text.primary,
                  textDecoration: 'none',
                  padding: theme.spacing.xs,
                  borderRadius: theme.borderRadius.small,
                  '&:hover': {
                    backgroundColor: theme.colors.background.tertiary,
                    color: theme.colors.text.accent
                  }
                }}
              >
                {section.title}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Cookie Types */}
      <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Types of Cookies We Use
      </Typography>
      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: theme.spacing.xl,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.colors.border.light}`
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.colors.text.accent, fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: theme.colors.text.accent, fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: theme.colors.text.accent, fontWeight: 'bold' }}>Examples</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cookieTypes.map((cookieType) => (
              <TableRow key={cookieType.type} sx={{ 
                '&:nth-of-type(odd)': { 
                  backgroundColor: theme.colors.background.tertiary 
                }
              }}>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 'medium', verticalAlign: 'top' }}>
                  {cookieType.type}
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, verticalAlign: 'top' }}>
                  {cookieType.description}
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, verticalAlign: 'top' }}>
                  <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                    {cookieType.examples.map((example, index) => (
                      <Box component="li" key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: theme.colors.text.primary }}>
                          {example.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                          Purpose: {example.purpose}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                          Duration: {example.duration}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Policy Content Sections */}
      {sections.map((section) => (
        <Accordion 
          key={section.id}
          expanded={expandedSection === section.id}
          onChange={handleChange(section.id)}
          id={section.id}
          sx={{
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            mb: theme.spacing.sm,
            border: `1px solid ${expandedSection === section.id ? theme.colors.accent : theme.colors.border.light}`,
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
            aria-controls={`${section.id}-content`}
            id={`${section.id}-header`}
          >
            <Typography sx={{ fontWeight: theme.typography.fontWeight.medium, color: expandedSection === section.id ? theme.colors.text.accent : theme.colors.text.primary }}>
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: `1px solid ${theme.colors.border.light}` }}>
            <Box dangerouslySetInnerHTML={{ __html: section.content }} sx={{
              color: theme.colors.text.primary,
              '& p': {
                mb: theme.spacing.md
              },
              '& a': {
                color: theme.colors.accent,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              },
              '& strong': {
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.accent
              }
            }} />
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Security Note */}
      <Box sx={{ mt: theme.spacing.xl, mb: theme.spacing.xl }}>
        <Card sx={{ 
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.colors.border.light}`
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 28, color: theme.colors.accent, mr: 2 }} />
              <Typography variant="h6" sx={{ color: theme.colors.text.accent }}>
                Your Data Security
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
              We prioritize the security of your data. All cookies containing sensitive information are encrypted, and we regularly audit our cookie usage to ensure compliance with data protection regulations.
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
              For more information about how we protect your data, please review our <Link href="/privacy" sx={{ color: theme.colors.accent }}>Privacy Policy</Link>.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  );
};

export default Cookies;
