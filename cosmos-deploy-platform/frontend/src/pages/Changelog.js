import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Card,
  CardContent,
  Chip,
  Link
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import Layout from '../components/Layout/Layout';

const ChangelogItem = ({ version, date, description, changes, current }) => (
  <TimelineItem>
    <TimelineOppositeContent sx={{ m: 'auto 0' }}>
      <Typography variant="h6" component="span" color={current ? 'primary' : 'textPrimary'}>
        v{version}
        {current && (
          <Chip 
            label="Current" 
            size="small" 
            color="primary" 
            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
          />
        )}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {date}
      </Typography>
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot color={current ? "primary" : "grey"} variant={current ? "filled" : "outlined"} />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent sx={{ py: '12px', px: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" paragraph>
            {description}
          </Typography>
          {changes.map((change, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              {change.type === 'feature' && <NewReleasesIcon color="primary" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />}
              {change.type === 'bugfix' && <BugReportIcon color="error" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />}
              {change.type === 'improvement' && <SettingsIcon color="success" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />}
              {change.type === 'security' && <SecurityIcon color="warning" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />}
              {change.type === 'performance' && <SpeedIcon color="info" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />}
              <Typography variant="body2">
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  {change.type.charAt(0).toUpperCase() + change.type.slice(1)}:
                </Box> {change.description}
              </Typography>
            </Box>
          ))}
          {version !== '0.1.0' && (
            <Box sx={{ mt: 2 }}>
              <Link 
                href="#" 
                variant="body2" 
                onClick={(e) => e.preventDefault()}
                color="primary"
              >
                View detailed release notes
              </Link>
            </Box>
          )}
        </CardContent>
      </Card>
    </TimelineContent>
  </TimelineItem>
);

const Changelog = () => {
  const releases = [
    {
      version: '2.5.0',
      date: 'July 5, 2025',
      description: 'Major platform update with multi-cloud deployment integration and improved security',
      current: true,
      changes: [
        { type: 'feature', description: 'Added support for multi-cloud deployment across AWS, GCP, Azure, and Digital Ocean' },
        { type: 'feature', description: 'Implemented validator set rotation with automatic transition handling' },
        { type: 'improvement', description: 'Enhanced monitoring dashboard with real-time metrics and customizable alerts' },
        { type: 'security', description: 'Improved key management system with hardware security module integration' },
        { type: 'performance', description: 'Optimized database queries for faster network listing and details loading' }
      ]
    },
    {
      version: '2.1.2',
      date: 'May 28, 2025',
      description: 'Maintenance release with bug fixes and performance improvements',
      current: false,
      changes: [
        { type: 'bugfix', description: 'Fixed issues with validator commission updates not being applied correctly' },
        { type: 'bugfix', description: 'Resolved UI rendering problem in the governance voting interface' },
        { type: 'performance', description: 'Improved loading time for network details page by 40%' },
        { type: 'security', description: 'Updated dependencies to address potential security vulnerabilities' }
      ]
    },
    {
      version: '2.0.0',
      date: 'April 12, 2025',
      description: 'Major release with rebranding to Cosmic Synched Chains and new governance features',
      current: false,
      changes: [
        { type: 'feature', description: 'Platform rebranded to Cosmic Synched Chains by Syncron Labs' },
        { type: 'feature', description: 'Added comprehensive governance module with proposal simulation' },
        { type: 'feature', description: 'Implemented CosmWasm smart contract integration and management' },
        { type: 'improvement', description: 'Redesigned user interface with improved navigation and accessibility' },
        { type: 'improvement', description: 'Enhanced documentation with interactive guides and tutorials' }
      ]
    },
    {
      version: '1.5.0',
      date: 'February 3, 2025',
      description: 'Added Kubernetes deployment support and enhanced security features',
      current: false,
      changes: [
        { type: 'feature', description: 'Added Kubernetes deployment option for production environments' },
        { type: 'feature', description: 'Implemented advanced security features including key rotation' },
        { type: 'improvement', description: 'Enhanced validator monitoring with performance metrics' },
        { type: 'bugfix', description: 'Fixed issues with IBC configuration in network creation wizard' }
      ]
    },
    {
      version: '1.2.1',
      date: 'December 15, 2024',
      description: 'Maintenance release with bug fixes and UI improvements',
      current: false,
      changes: [
        { type: 'bugfix', description: 'Fixed token distribution calculations in genesis generation' },
        { type: 'improvement', description: 'Enhanced user interface for mobile devices' },
        { type: 'performance', description: 'Optimized network creation process for faster deployment' }
      ]
    },
    {
      version: '1.0.0',
      date: 'October 30, 2024',
      description: 'First stable release with production-ready features',
      current: false,
      changes: [
        { type: 'feature', description: 'Complete network creation wizard with all Cosmos SDK modules' },
        { type: 'feature', description: 'Docker-based deployment system for local and cloud environments' },
        { type: 'feature', description: 'Basic monitoring and management interface for blockchain networks' },
        { type: 'feature', description: 'User management system with role-based access control' }
      ]
    },
    {
      version: '0.5.0',
      date: 'August 18, 2024',
      description: 'Beta release with core functionality',
      current: false,
      changes: [
        { type: 'feature', description: 'Implemented network creation wizard with basic configuration options' },
        { type: 'feature', description: 'Added support for Cosmos SDK core modules' },
        { type: 'feature', description: 'Basic monitoring interface for validator status' },
        { type: 'improvement', description: 'Enhanced network deployment system' }
      ]
    },
    {
      version: '0.1.0',
      date: 'June 5, 2024',
      description: 'Initial alpha release',
      current: false,
      changes: [
        { type: 'feature', description: 'Basic framework for blockchain network deployment' },
        { type: 'feature', description: 'Simple validator configuration interface' },
        { type: 'feature', description: 'Initial Docker-based deployment system' }
      ]
    }
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Changelog
          </Typography>
          <Typography variant="body1">
            Track the evolution of Cosmic Synched Chains platform with our detailed release history.
          </Typography>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NewReleasesIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Feature:</strong> New functionality
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BugReportIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Bugfix:</strong> Issue resolution
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SettingsIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Improvement:</strong> Enhancement to existing functionality
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Security:</strong> Security-related updates
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SpeedIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Performance:</strong> Performance improvements
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Timeline position="alternate">
          {releases.map((release, index) => (
            <ChangelogItem 
              key={index}
              version={release.version}
              date={release.date}
              description={release.description}
              changes={release.changes}
              current={release.current}
            />
          ))}
        </Timeline>
      </Container>
    </Layout>
  );
};

export default Changelog;