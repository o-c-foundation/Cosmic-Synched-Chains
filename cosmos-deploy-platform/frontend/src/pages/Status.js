import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * Status page showing system status and incidents
 * @returns {JSX.Element} Status component
 */
const Status = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('current');
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational',
    lastUpdated: new Date().toISOString(),
    components: [
      { 
        name: 'API Services', 
        status: 'operational', 
        uptime: '99.98%',
        responseTime: 187 // ms
      },
      { 
        name: 'Web Interface', 
        status: 'operational', 
        uptime: '99.99%',
        responseTime: 245 // ms
      },
      { 
        name: 'Network Creation', 
        status: 'operational', 
        uptime: '99.95%',
        responseTime: 420 // ms
      },
      { 
        name: 'Monitoring Services', 
        status: 'operational', 
        uptime: '99.97%',
        responseTime: 310 // ms
      },
      { 
        name: 'Validator Management', 
        status: 'operational', 
        uptime: '99.93%',
        responseTime: 356 // ms
      },
      { 
        name: 'Database Cluster', 
        status: 'operational', 
        uptime: '99.999%',
        responseTime: 65 // ms
      }
    ]
  });
  
  // Incident data
  const incidents = [
    {
      id: 'incident-2025-07-01',
      title: 'API Performance Degradation',
      status: 'resolved',
      started: '2025-07-01T14:23:00Z',
      resolved: '2025-07-01T16:47:00Z',
      updates: [
        { 
          timestamp: '2025-07-01T14:23:00Z', 
          message: 'We are investigating reports of API slowdowns affecting some regions.' 
        },
        { 
          timestamp: '2025-07-01T15:15:00Z', 
          message: 'We have identified the issue as increased load on our database cluster due to an inefficient query pattern. Our team is implementing a fix.' 
        },
        { 
          timestamp: '2025-07-01T16:47:00Z', 
          message: 'The issue has been resolved. We have optimized the problematic queries and added additional database capacity to prevent similar issues in the future.' 
        }
      ],
      components: ['API Services', 'Database Cluster'],
      impact: 'moderate'
    },
    {
      id: 'incident-2025-06-22',
      title: 'Network Creation Service Disruption',
      status: 'resolved',
      started: '2025-06-22T08:12:00Z',
      resolved: '2025-06-22T09:45:00Z',
      updates: [
        { 
          timestamp: '2025-06-22T08:12:00Z', 
          message: 'We are investigating issues with the network creation service. Users may experience failures when attempting to create new networks.' 
        },
        { 
          timestamp: '2025-06-22T08:35:00Z', 
          message: 'The issue has been identified as a configuration problem with our provisioning system following a recent update.' 
        },
        { 
          timestamp: '2025-06-22T09:20:00Z', 
          message: 'A fix has been deployed and we are monitoring the service for stability.' 
        },
        { 
          timestamp: '2025-06-22T09:45:00Z', 
          message: 'The network creation service has been fully restored. All systems are operating normally.' 
        }
      ],
      components: ['Network Creation'],
      impact: 'major'
    },
    {
      id: 'incident-2025-06-15',
      title: 'Monitoring Service Data Delay',
      status: 'resolved',
      started: '2025-06-15T19:07:00Z',
      resolved: '2025-06-15T21:30:00Z',
      updates: [
        { 
          timestamp: '2025-06-15T19:07:00Z', 
          message: 'We are experiencing delays in the monitoring data collection and display. Real-time metrics may not be up-to-date.' 
        },
        { 
          timestamp: '2025-06-15T19:45:00Z', 
          message: 'We have identified an issue with our time-series database ingestion pipeline. Our engineers are working to restore normal operation.' 
        },
        { 
          timestamp: '2025-06-15T21:30:00Z', 
          message: 'The monitoring service has been fully restored. All delayed metrics have been backfilled and are now displaying correctly.' 
        }
      ],
      components: ['Monitoring Services'],
      impact: 'minor'
    }
  ];
  
  // Maintenance data
  const scheduledMaintenance = [
    {
      id: 'maintenance-2025-07-15',
      title: 'Database Cluster Upgrade',
      status: 'scheduled',
      scheduled: '2025-07-15T02:00:00Z',
      duration: '2 hours',
      description: 'We will be upgrading our database cluster to the latest version to improve performance and security. During this time, the platform will be in read-only mode.',
      components: ['Database Cluster'],
      impact: 'moderate'
    },
    {
      id: 'maintenance-2025-07-20',
      title: 'API Gateway Updates',
      status: 'scheduled',
      scheduled: '2025-07-20T01:00:00Z',
      duration: '1 hour',
      description: 'We will be deploying updates to our API gateway to enhance request handling and rate limiting capabilities. Brief API interruptions may occur during the deployment.',
      components: ['API Services'],
      impact: 'minor'
    }
  ];
  
  // Performance metrics data (last 30 days)
  const performanceMetrics = {
    uptime: '99.97%',
    responseTime: {
      avg: 245,
      p95: 420,
      p99: 890
    },
    requests: {
      total: 483571249,
      successful: 483468127,
      failed: 103122
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return theme.colors.success;
      case 'degraded':
        return theme.colors.warning;
      case 'partial_outage':
        return theme.colors.error;
      case 'major_outage':
        return theme.colors.error;
      case 'maintenance':
        return theme.colors.info;
      default:
        return theme.colors.text.secondary;
    }
  };
  
  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon sx={{ color: theme.colors.success }} />;
      case 'degraded':
        return <WarningIcon sx={{ color: theme.colors.warning }} />;
      case 'partial_outage':
      case 'major_outage':
        return <ErrorIcon sx={{ color: theme.colors.error }} />;
      case 'maintenance':
        return <AccessTimeIcon sx={{ color: theme.colors.info }} />;
      default:
        return null;
    }
  };
  
  // Helper function to get incident impact chip
  const getImpactChip = (impact) => {
    switch (impact) {
      case 'minor':
        return (
          <Chip 
            label="Minor" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255, 204, 0, 0.2)', 
              color: '#FFCC00',
              borderRadius: '4px'
            }} 
          />
        );
      case 'moderate':
        return (
          <Chip 
            label="Moderate" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255, 153, 0, 0.2)', 
              color: '#FF9900',
              borderRadius: '4px'
            }} 
          />
        );
      case 'major':
        return (
          <Chip 
            label="Major" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255, 51, 0, 0.2)', 
              color: '#FF3300',
              borderRadius: '4px'
            }} 
          />
        );
      default:
        return null;
    }
  };
  
  // Helper function to get incident status chip
  const getIncidentStatusChip = (status) => {
    switch (status) {
      case 'investigating':
        return (
          <Chip 
            label="Investigating" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255, 153, 0, 0.2)', 
              color: '#FF9900',
              borderRadius: '4px'
            }} 
          />
        );
      case 'identified':
        return (
          <Chip 
            label="Identified" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(204, 255, 0, 0.2)', 
              color: theme.colors.accent,
              borderRadius: '4px'
            }} 
          />
        );
      case 'monitoring':
        return (
          <Chip 
            label="Monitoring" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(0, 204, 255, 0.2)', 
              color: '#00CCFF',
              borderRadius: '4px'
            }} 
          />
        );
      case 'resolved':
        return (
          <Chip 
            label="Resolved" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(0, 255, 153, 0.2)', 
              color: '#00FF99',
              borderRadius: '4px'
            }} 
          />
        );
      case 'scheduled':
        return (
          <Chip 
            label="Scheduled" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(153, 102, 255, 0.2)', 
              color: '#9966FF',
              borderRadius: '4px'
            }} 
          />
        );
      default:
        return null;
    }
  };
  
  // Helper function to format date
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
    <PageLayout title="System Status">
      {/* Current Status Overview */}
      <Card sx={{ 
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.border.light}`,
        mb: theme.spacing.xl
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {getStatusIcon('operational')}
            <Typography variant="h5" sx={{ ml: 2, color: theme.colors.text.accent }}>
              All Systems Operational
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                30-day uptime: <strong style={{ color: theme.colors.text.accent }}>{performanceMetrics.uptime}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Component Status */}
      <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Component Status
      </Typography>
      <TableContainer component={Paper} sx={{ 
        mb: theme.spacing.xl,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.border.light}`
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.colors.text.accent, fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: theme.colors.text.accent, fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: theme.colors.text.accent, fontWeight: 'bold' }}>Uptime</TableCell>
              <TableCell sx={{ color: theme.colors.text.accent, fontWeight: 'bold' }}>Response Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {systemStatus.components.map((component, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: theme.colors.text.primary }}>{component.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusIcon(component.status)}
                    <Typography variant="body2" sx={{ ml: 1, color: theme.colors.text.primary }}>
                      {component.status.charAt(0).toUpperCase() + component.status.slice(1).replace('_', ' ')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary }}>{component.uptime}</TableCell>
                <TableCell sx={{ color: theme.colors.text.primary }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>{component.responseTime} ms</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(component.responseTime / 1000) * 100}
                      sx={{ 
                        width: 50, 
                        backgroundColor: theme.colors.background.tertiary,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: component.responseTime > 500 ? theme.colors.warning : 
                                        component.responseTime > 300 ? theme.colors.accent : 
                                        theme.colors.success
                        }
                      }} 
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Recent Incidents */}
      <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Recent Incidents
      </Typography>
      <Box sx={{ mb: theme.spacing.xl }}>
        {incidents.length > 0 ? (
          incidents.map((incident) => (
            <Card key={incident.id} sx={{ 
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.light}`,
              mb: theme.spacing.md
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                    {incident.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {getIncidentStatusChip(incident.status)}
                    {getImpactChip(incident.impact)}
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
                  {formatDate(incident.started)} - {formatDate(incident.resolved)}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ color: theme.colors.text.accent, mb: 1 }}>
                  Affected Components:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {incident.components.map((component, index) => (
                    <Chip 
                      key={index}
                      label={component} 
                      size="small" 
                      sx={{ 
                        backgroundColor: theme.colors.background.tertiary, 
                        color: theme.colors.text.primary,
                        borderRadius: '4px'
                      }} 
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" sx={{ color: theme.colors.text.accent, mb: 1 }}>
                  Updates:
                </Typography>
                <Box>
                  {incident.updates.map((update, index) => (
                    <Box key={index} sx={{ mb: 1, pl: 2, position: 'relative' }}>
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          left: 0, 
                          top: 0, 
                          bottom: 0, 
                          width: '2px', 
                          backgroundColor: theme.colors.border.light 
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: theme.colors.text.secondary, display: 'block', mb: 0.5 }}>
                        {formatDate(update.timestamp)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.colors.text.primary }}>
                        {update.message}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card sx={{ 
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                No incidents reported in the last 30 days
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
      
      {/* Scheduled Maintenance */}
      <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Scheduled Maintenance
      </Typography>
      <Box sx={{ mb: theme.spacing.xl }}>
        {scheduledMaintenance.length > 0 ? (
          scheduledMaintenance.map((maintenance) => (
            <Card key={maintenance.id} sx={{ 
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.light}`,
              mb: theme.spacing.md
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                    {maintenance.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {getIncidentStatusChip(maintenance.status)}
                    {getImpactChip(maintenance.impact)}
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
                  Scheduled for: {formatDate(maintenance.scheduled)} • Duration: {maintenance.duration}
                </Typography>
                
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  {maintenance.description}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ color: theme.colors.text.accent, mb: 1 }}>
                  Affected Components:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {maintenance.components.map((component, index) => (
                    <Chip 
                      key={index}
                      label={component} 
                      size="small" 
                      sx={{ 
                        backgroundColor: theme.colors.background.tertiary, 
                        color: theme.colors.text.primary,
                        borderRadius: '4px'
                      }} 
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card sx={{ 
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                No scheduled maintenance at this time
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
      
      {/* Performance Metrics */}
      <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
        Performance Metrics (Last 30 Days)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Average Response Time
              </Typography>
              <Typography variant="h3" sx={{ color: theme.colors.text.primary }}>
                {performanceMetrics.responseTime.avg} <small style={{ fontSize: '1rem', color: theme.colors.text.secondary }}>ms</small>
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.colors.border.light }} />
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                P95: {performanceMetrics.responseTime.p95} ms
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                P99: {performanceMetrics.responseTime.p99} ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Uptime
              </Typography>
              <Typography variant="h3" sx={{ color: theme.colors.text.primary }}>
                {performanceMetrics.uptime}
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.colors.border.light }} />
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Target SLA: 99.95%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Request Success Rate
              </Typography>
              <Typography variant="h3" sx={{ color: theme.colors.text.primary }}>
                {((performanceMetrics.requests.successful / performanceMetrics.requests.total) * 100).toFixed(2)}%
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.colors.border.light }} />
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Total Requests: {performanceMetrics.requests.total.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Failed: {performanceMetrics.requests.failed.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default Status;
