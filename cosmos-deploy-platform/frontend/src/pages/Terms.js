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
  Button
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * Terms of Service page
 * @returns {JSX.Element} Terms component
 */
const Terms = () => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState('section1');
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };
  
  // Last updated date
  const lastUpdated = 'July 1, 2025';
  
  // Terms of Service sections
  const sections = [
    {
      id: 'section1',
      title: '1. Introduction and Acceptance of Terms',
      content: `
        <p>Welcome to the Cosmos Deploy Platform ("Platform"), operated by Open Crypto Foundation ("we," "us," or "our"). By accessing or using our Platform, you agree to comply with and be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using our services.</p>
        
        <p>By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our Platform.</p>
        
        <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on the Platform and updating the "Last Updated" date. Your continued use of the Platform after such modifications will constitute your acknowledgment and acceptance of the modified Terms.</p>
      `
    },
    {
      id: 'section2',
      title: '2. Description of Services',
      content: `
        <p>The Cosmos Deploy Platform provides blockchain network deployment and management services, including but not limited to:</p>
        
        <ul>
          <li>Network creation and configuration</li>
          <li>Validator node deployment and management</li>
          <li>Performance monitoring and analytics</li>
          <li>Governance management tools</li>
          <li>Security monitoring and alerts</li>
          <li>API access to blockchain data</li>
        </ul>
        
        <p>We reserve the right to modify, suspend, or discontinue any part of our services at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of our services.</p>
      `
    },
    {
      id: 'section3',
      title: '3. User Accounts and Registration',
      content: `
        <p>To access certain features of our Platform, you must create an account. When registering for an account, you agree to provide accurate, current, and complete information and to keep this information updated. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        
        <p>You agree to immediately notify us of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with this section.</p>
        
        <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Platform, us, or third parties, or for any other reason.</p>
      `
    },
    {
      id: 'section4',
      title: '4. User Responsibilities and Conduct',
      content: `
        <p>By using our Platform, you agree not to:</p>
        
        <ul>
          <li>Use the Platform in any way that violates any applicable federal, state, local, or international law or regulation</li>
          <li>Use the Platform to engage in any activity that could harm, disable, overburden, or impair our servers or networks</li>
          <li>Attempt to gain unauthorized access to any part of the Platform, other accounts, or computer systems or networks connected to the Platform</li>
          <li>Use any robot, spider, or other automated device to access the Platform</li>
          <li>Introduce any viruses, Trojan horses, worms, or other material which is malicious or technologically harmful</li>
          <li>Use the Platform for illegal activities, including but not limited to money laundering, terrorism financing, or other financial crimes</li>
        </ul>
        
        <p>You are responsible for ensuring that any networks you deploy through our Platform comply with all applicable laws and regulations.</p>
      `
    },
    {
      id: 'section5',
      title: '5. Intellectual Property Rights',
      content: `
        <p>The Platform and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, and the design, selection, and arrangement thereof) are owned by the Open Crypto Foundation, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
        
        <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Platform, except as follows:</p>
        
        <ul>
          <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials</li>
          <li>You may store files that are automatically cached by your web browser for display enhancement purposes</li>
          <li>If we provide social media features with certain content, you may take such actions as are enabled by such features</li>
        </ul>
        
        <p>You must not access or use for any commercial purposes any part of the Platform or any services or materials available through the Platform that are not explicitly provided as part of your service subscription.</p>
      `
    },
    {
      id: 'section6',
      title: '6. Payment Terms',
      content: `
        <p>Some of our services require payment of fees. By selecting a paid service, you agree to pay us the fees as described at the time of your selection. Fees are non-refundable except as required by law or as explicitly stated in these Terms.</p>
        
        <p>We use third-party payment processors to bill you through a payment account linked to your account. The processing of payments will be subject to the terms, conditions, and privacy policies of the payment processors in addition to these Terms.</p>
        
        <p>We reserve the right to change our prices at any time. If we change pricing for a service you're subscribed to, we will notify you at least 30 days before the change takes effect.</p>
        
        <p>If you fail to pay the fees when due, we may suspend or terminate your access to the paid services. You are responsible for all applicable taxes, and we will charge tax when required to do so.</p>
      `
    },
    {
      id: 'section7',
      title: '7. Service Levels and Support',
      content: `
        <p>We strive to maintain high availability of our Platform, but we do not guarantee 100% uptime. Our Service Level Agreement (SLA), which outlines our commitments regarding service availability and support response times, can be found on our website.</p>
        
        <p>The level of support you receive depends on your subscription plan. Details about the support included with each plan are available on our pricing page.</p>
        
        <p>We provide technical support for issues directly related to our Platform. We do not provide support for third-party software or services, or for issues arising from your custom configurations that are not within our recommended parameters.</p>
      `
    },
    {
      id: 'section8',
      title: '8. Limitation of Liability',
      content: `
        <p>To the fullest extent permitted by applicable law, in no event will the Open Crypto Foundation, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Platform, any websites linked to it, any content on the Platform or such other websites, including any direct, indirect, special, incidental, consequential, or punitive damages, including but not limited to, personal injury, pain and suffering, emotional distress, loss of revenue, loss of profits, loss of business or anticipated savings, loss of use, loss of goodwill, loss of data, and whether caused by tort (including negligence), breach of contract, or otherwise, even if foreseeable.</p>
        
        <p>The foregoing does not affect any liability that cannot be excluded or limited under applicable law.</p>
        
        <p>We specifically disclaim all liability for any loss of digital assets, cryptocurrency, or blockchain data due to node operation failures, network attacks, or other technical issues.</p>
      `
    },
    {
      id: 'section9',
      title: '9. Indemnification',
      content: `
        <p>You agree to defend, indemnify, and hold harmless the Open Crypto Foundation, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Platform, including, but not limited to, any use of the Platform's content, services, and products other than as expressly authorized in these Terms or your use of any information obtained from the Platform.</p>
      `
    },
    {
      id: 'section10',
      title: '10. Governing Law and Jurisdiction',
      content: `
        <p>These Terms and your use of the Platform will be governed by and construed in accordance with the laws of the State of California, without giving effect to any choice or conflict of law provision or rule.</p>
        
        <p>Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Platform shall be instituted exclusively in the federal courts of the United States or the courts of the State of California, in each case located in San Francisco County, although we retain the right to bring any suit, action, or proceeding against you for breach of these Terms in your country of residence or any other relevant country.</p>
        
        <p>You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.</p>
      `
    },
    {
      id: 'section11',
      title: '11. Termination',
      content: `
        <p>We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
        
        <p>Upon termination, your right to use the Platform will immediately cease. If you wish to terminate your account, you may simply discontinue using the Platform or contact us to request account deletion.</p>
        
        <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
      `
    },
    {
      id: 'section12',
      title: '12. Changes to Terms',
      content: `
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        
        <p>By continuing to access or use our Platform after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Platform.</p>
      `
    },
    {
      id: 'section13',
      title: '13. Contact Information',
      content: `
        <p>If you have any questions about these Terms, please contact us at:</p>
        
        <p>Open Crypto Foundation<br>
        123 Blockchain Avenue<br>
        San Francisco, CA 94105<br>
        Email: legal@opencryptofoundation.org<br>
        Phone: (888) 555-0123</p>
      `
    }
  ];

  return (
    <PageLayout title="Terms of Service">
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
          Terms of Service
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
            Cosmos Deploy Platform Terms of Service
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
            These Terms of Service govern your use of the Cosmos Deploy Platform. By using our services, you agree to these terms.
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
            Last Updated: {lastUpdated}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
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

      {/* Terms Content */}
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

      {/* Agreement Section */}
      <Box sx={{ mt: theme.spacing.xl, mb: theme.spacing.xl }}>
        <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
          Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: theme.colors.text.primary }}>
          By using the Cosmos Deploy Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
        </Typography>
        <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
          If you have any questions or concerns about these terms, please contact our support team at <Link href="mailto:legal@opencryptofoundation.org" sx={{ color: theme.colors.accent }}>legal@opencryptofoundation.org</Link>.
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default Terms;
