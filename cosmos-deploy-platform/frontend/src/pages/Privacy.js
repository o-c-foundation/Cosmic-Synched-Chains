import React from 'react';
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
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * Privacy Policy page
 * @returns {JSX.Element} Privacy component
 */
const Privacy = () => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = React.useState('section1');
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };
  
  // Last updated date
  const lastUpdated = 'July 1, 2025';
  
  // Privacy Policy sections
  const sections = [
    {
      id: 'section1',
      title: '1. Introduction',
      content: `
        <p>At Open Crypto Foundation, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website or use our Cosmos Deploy Platform ("Platform") and tell you about your privacy rights and how the law protects you.</p>
        
        <p>This Privacy Policy applies to all users of our Platform, including customers, validators, developers, and visitors to our website. Please read this Privacy Policy carefully to understand our practices regarding your personal data.</p>
        
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
      `
    },
    {
      id: 'section2',
      title: '2. Data We Collect',
      content: `
        <p>We collect several different types of information for various purposes to provide and improve our services to you:</p>
        
        <h4>2.1 Personal Data</h4>
        <p>While using our Platform, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
          <li>Cookies and Usage Data</li>
          <li>Payment information (for paid services)</li>
        </ul>
        
        <h4>2.2 Blockchain-Related Data</h4>
        <p>Given the nature of our Platform, we may also collect and process:</p>
        <ul>
          <li>Wallet addresses</li>
          <li>Node identifiers</li>
          <li>Validator public keys</li>
          <li>Network configuration data</li>
          <li>Transaction data that you submit to blockchain networks through our Platform</li>
        </ul>
        <p>Please note that information stored on public blockchains is inherently public and we cannot control access to such information.</p>
        
        <h4>2.3 Usage Data</h4>
        <p>We may also collect information about how the Platform is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Platform that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</p>
        
        <h4>2.4 Tracking & Cookies Data</h4>
        <p>We use cookies and similar tracking technologies to track activity on our Platform and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Platform. See our Cookie Policy for more information.</p>
      `
    },
    {
      id: 'section3',
      title: '3. How We Use Your Data',
      content: `
        <p>We use the collected data for various purposes:</p>
        <ul>
          <li>To provide and maintain our Platform</li>
          <li>To notify you about changes to our Platform</li>
          <li>To allow you to participate in interactive features of our Platform when you choose to do so</li>
          <li>To provide customer support</li>
          <li>To gather analysis or valuable information so that we can improve our Platform</li>
          <li>To monitor the usage of our Platform</li>
          <li>To detect, prevent and address technical issues</li>
          <li>To fulfill any other purpose for which you provide it</li>
          <li>To process payments and prevent fraud</li>
          <li>To comply with legal obligations</li>
        </ul>
        
        <p>We may process your Personal Data because:</p>
        <ul>
          <li>We need to perform a contract with you</li>
          <li>You have given us permission to do so</li>
          <li>The processing is in our legitimate interests and it is not overridden by your rights</li>
          <li>To comply with the law</li>
        </ul>
      `
    },
    {
      id: 'section4',
      title: '4. Data Sharing and Disclosure',
      content: `
        <p>We may disclose your Personal Data in the following situations:</p>
        
        <h4>4.1 Service Providers</h4>
        <p>We may employ third-party companies and individuals to facilitate our Platform ("Service Providers"), provide the Platform on our behalf, perform Platform-related services, or assist us in analyzing how our Platform is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
        
        <h4>4.2 Business Transfers</h4>
        <p>If we are involved in a merger, acquisition, or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
        
        <h4>4.3 Legal Requirements</h4>
        <p>We may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
        <ul>
          <li>Comply with a legal obligation</li>
          <li>Protect and defend the rights or property of the Open Crypto Foundation</li>
          <li>Prevent or investigate possible wrongdoing in connection with the Platform</li>
          <li>Protect the personal safety of users of the Platform or the public</li>
          <li>Protect against legal liability</li>
        </ul>
      `
    },
    {
      id: 'section5',
      title: '5. Data Security',
      content: `
        <p>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
        
        <p>We implement a variety of security measures to maintain the safety of your Personal Data when you use our Platform:</p>
        <ul>
          <li>All sensitive data is transmitted using secure SSL encryption</li>
          <li>We store sensitive data using secure, industry-standard encryption</li>
          <li>Access to personal information is restricted to authorized personnel only</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Implementation of security best practices and frameworks</li>
        </ul>
        
        <p>If you become aware of any security issues or vulnerabilities in our Platform, please contact us immediately at security@opencryptofoundation.org.</p>
      `
    },
    {
      id: 'section6',
      title: '6. Your Data Protection Rights',
      content: `
        <p>Depending on your location and applicable laws, you may have certain rights regarding your Personal Data, including:</p>
        
        <h4>6.1 Right to Access</h4>
        <p>You have the right to request copies of your Personal Data. We may charge you a small fee for this service.</p>
        
        <h4>6.2 Right to Rectification</h4>
        <p>You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete information you believe is incomplete.</p>
        
        <h4>6.3 Right to Erasure</h4>
        <p>You have the right to request that we erase your Personal Data, under certain conditions.</p>
        
        <h4>6.4 Right to Restrict Processing</h4>
        <p>You have the right to request that we restrict the processing of your Personal Data, under certain conditions.</p>
        
        <h4>6.5 Right to Object to Processing</h4>
        <p>You have the right to object to our processing of your Personal Data, under certain conditions.</p>
        
        <h4>6.6 Right to Data Portability</h4>
        <p>You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>
        
        <p>If you wish to exercise any of these rights, please contact us at privacy@opencryptofoundation.org. We will respond to your request within 30 days.</p>
      `
    },
    {
      id: 'section7',
      title: '7. Children\'s Privacy',
      content: `
        <p>Our Platform is not intended for use by children under the age of 16 ("Children"). We do not knowingly collect personally identifiable information from Children. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from Children without verification of parental consent, we take steps to remove that information from our servers.</p>
      `
    },
    {
      id: 'section8',
      title: '8. International Data Transfers',
      content: `
        <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.</p>
        
        <p>If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to the United States and process it there.</p>
        
        <p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
        
        <p>We will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy, and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.</p>
      `
    },
    {
      id: 'section9',
      title: '9. Data Retention',
      content: `
        <p>We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
        
        <p>We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Platform, or we are legally obligated to retain this data for longer periods.</p>
        
        <p>When we no longer need to process your Personal Data, we will securely delete or anonymize it. If this is not possible (for example, because your Personal Data has been stored in backup archives), then we will securely store your Personal Data and isolate it from any further processing until deletion is possible.</p>
      `
    },
    {
      id: 'section10',
      title: '10. Third-Party Services',
      content: `
        <p>Our Platform may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
        
        <p>We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
        
        <p>Our Platform may integrate with third-party services such as analytics providers, payment processors, and cloud service providers. These third parties may collect, store, and process your information. We encourage you to review the privacy policies of these third-party services.</p>
      `
    },
    {
      id: 'section11',
      title: '11. Changes to This Privacy Policy',
      content: `
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
        
        <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        
        <p>If we make material changes to this Privacy Policy, we will notify you either through the email address you have provided us or by placing a prominent notice on our website.</p>
      `
    },
    {
      id: 'section12',
      title: '12. Contact Us',
      content: `
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        
        <p>Open Crypto Foundation<br>
        Privacy Department<br>
        123 Blockchain Avenue<br>
        San Francisco, CA 94105<br>
        Email: privacy@opencryptofoundation.org<br>
        Phone: (888) 555-0123</p>
        
        <p>For data protection matters, you can contact our Data Protection Officer at dpo@opencryptofoundation.org.</p>
      `
    }
  ];

  return (
    <PageLayout title="Privacy Policy">
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
          Privacy Policy
        </Typography>
      </Breadcrumbs>

      {/* Introduction Card */}
      <Card sx={{ 
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.border.light}`,
        mb: theme.spacing.xl
      }}>
        <CardContent sx={{ p: theme.spacing.lg }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
            Cosmos Deploy Platform Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
            This Privacy Policy describes how your personal information is collected, used, and shared when you use the Cosmos Deploy Platform.
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
              href="/cookies"
              sx={{
                color: theme.colors.accent,
                borderColor: theme.colors.accent,
                '&:hover': {
                  borderColor: theme.colors.accentLight,
                  backgroundColor: 'rgba(204, 255, 0, 0.1)'
                }
              }}
            >
              Cookie Policy
            </Button>
          </Box>
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
            {sections.map((section, index) => (
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

      {/* Privacy Policy Content */}
      {sections.map((section, index) => (
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
              '& h4': {
                color: theme.colors.text.accent,
                fontSize: '1rem',
                fontWeight: theme.typography.fontWeight.bold,
                mb: theme.spacing.sm,
                mt: theme.spacing.md
              },
              '& ul': {
                paddingLeft: theme.spacing.lg,
                mb: theme.spacing.md
              },
              '& li': {
                mb: theme.spacing.xs
              }
            }} />
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Contact Information */}
      <Box sx={{ mt: theme.spacing.xl, mb: theme.spacing.xl }}>
        <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
          Questions or Concerns?
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
          If you have any questions or concerns about our Privacy Policy or data practices, please contact our Privacy Team:
        </Typography>
        <Card sx={{ 
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.colors.border.light}`,
        }}>
          <CardContent>
            <List sx={{ p: 0 }}>
              <ListItem>
                <ListItemText 
                  primary="Email" 
                  secondary={<Link href="mailto:privacy@opencryptofoundation.org" sx={{ color: theme.colors.accent }}>privacy@opencryptofoundation.org</Link>}
                  primaryTypographyProps={{ color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.medium }}
                  secondaryTypographyProps={{ color: theme.colors.text.secondary }}
                />
              </ListItem>
              <Divider sx={{ borderColor: theme.colors.border.light }} />
              <ListItem>
                <ListItemText 
                  primary="Phone" 
                  secondary="(888) 555-0123"
                  primaryTypographyProps={{ color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.medium }}
                  secondaryTypographyProps={{ color: theme.colors.text.secondary }}
                />
              </ListItem>
              <Divider sx={{ borderColor: theme.colors.border.light }} />
              <ListItem>
                <ListItemText 
                  primary="Mail" 
                  secondary="Open Crypto Foundation, Privacy Department, 123 Blockchain Avenue, San Francisco, CA 94105"
                  primaryTypographyProps={{ color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.medium }}
                  secondaryTypographyProps={{ color: theme.colors.text.secondary }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  );
};

export default Privacy;
