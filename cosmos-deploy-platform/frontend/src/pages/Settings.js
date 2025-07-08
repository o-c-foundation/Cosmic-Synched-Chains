import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = useState({
    cloudProviders: {
      aws: {
        enabled: true,
        accessKey: '************',
        secretKey: '************',
        regions: ['us-east-1', 'us-west-1', 'eu-central-1']
      },
      gcp: {
        enabled: false,
        projectId: '',
        keyFile: '',
        regions: []
      },
      azure: {
        enabled: false,
        subscriptionId: '',
        tenantId: '',
        clientId: '',
        clientSecret: '',
        regions: []
      }
    },
    monitoring: {
      alertsEnabled: true,
      emailNotifications: true,
      emailAddress: 'admin@example.com',
      slackWebhook: '',
      checkIntervalMinutes: 5
    },
    backups: {
      autoBackupEnabled: true,
      backupIntervalHours: 24,
      retentionPeriodDays: 7,
      storageLocation: 'aws-s3'
    }
  });

  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState('');

  const handleCloudProviderToggle = (provider) => {
    setSettings({
      ...settings,
      cloudProviders: {
        ...settings.cloudProviders,
        [provider]: {
          ...settings.cloudProviders[provider],
          enabled: !settings.cloudProviders[provider].enabled
        }
      }
    });
  };

  const handleMonitoringChange = (field, value) => {
    setSettings({
      ...settings,
      monitoring: {
        ...settings.monitoring,
        [field]: value
      }
    });
  };

  const handleBackupChange = (field, value) => {
    setSettings({
      ...settings,
      backups: {
        ...settings.backups,
        [field]: value
      }
    });
  };

  const handleSave = () => {
    // In a real app, we would save settings to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Snackbar 
        open={saved} 
        autoHideDuration={3000} 
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">Settings saved successfully</Alert>
      </Snackbar>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Cloud Provider Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure your cloud provider credentials for deployment
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant={settings.cloudProviders.aws.enabled ? "outlined" : "elevation"} 
                      sx={{ mb: 2, opacity: settings.cloudProviders.aws.enabled ? 1 : 0.6 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        AWS
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.cloudProviders.aws.enabled}
                            onChange={() => handleCloudProviderToggle('aws')}
                            color="primary"
                          />
                        }
                        label="Enabled"
                      />
                    </Box>
                    
                    {settings.cloudProviders.aws.enabled && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Access Key"
                            type="password"
                            value={settings.cloudProviders.aws.accessKey}
                            fullWidth
                            disabled={editing !== 'aws'}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Secret Key"
                            type="password"
                            value={settings.cloudProviders.aws.secretKey}
                            fullWidth
                            disabled={editing !== 'aws'}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {editing === 'aws' ? (
                              <>
                                <Button sx={{ mr: 1 }} onClick={() => setEditing('')}>
                                  Cancel
                                </Button>
                                <Button variant="contained" onClick={() => setEditing('')}>
                                  Save
                                </Button>
                              </>
                            ) : (
                              <Button onClick={() => setEditing('aws')}>
                                Edit
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant={settings.cloudProviders.gcp.enabled ? "outlined" : "elevation"} 
                      sx={{ mb: 2, opacity: settings.cloudProviders.gcp.enabled ? 1 : 0.6 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        Google Cloud Platform
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.cloudProviders.gcp.enabled}
                            onChange={() => handleCloudProviderToggle('gcp')}
                            color="primary"
                          />
                        }
                        label="Enabled"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant={settings.cloudProviders.azure.enabled ? "outlined" : "elevation"} 
                      sx={{ opacity: settings.cloudProviders.azure.enabled ? 1 : 0.6 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        Microsoft Azure
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.cloudProviders.azure.enabled}
                            onChange={() => handleCloudProviderToggle('azure')}
                            color="primary"
                          />
                        }
                        label="Enabled"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Monitoring Settings
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.monitoring.alertsEnabled}
                      onChange={(e) => handleMonitoringChange('alertsEnabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Alerts"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.monitoring.emailNotifications}
                      onChange={(e) => handleMonitoringChange('emailNotifications', e.target.checked)}
                      color="primary"
                      disabled={!settings.monitoring.alertsEnabled}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              
              {settings.monitoring.emailNotifications && settings.monitoring.alertsEnabled && (
                <Grid item xs={12}>
                  <TextField
                    label="Email Address"
                    value={settings.monitoring.emailAddress}
                    onChange={(e) => handleMonitoringChange('emailAddress', e.target.value)}
                    fullWidth
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Check Interval</InputLabel>
                  <Select
                    value={settings.monitoring.checkIntervalMinutes}
                    onChange={(e) => handleMonitoringChange('checkIntervalMinutes', e.target.value)}
                    label="Check Interval"
                    disabled={!settings.monitoring.alertsEnabled}
                  >
                    <MenuItem value={1}>1 minute</MenuItem>
                    <MenuItem value={5}>5 minutes</MenuItem>
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Backup Settings
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.backups.autoBackupEnabled}
                      onChange={(e) => handleBackupChange('autoBackupEnabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Automatic Backups"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!settings.backups.autoBackupEnabled}>
                  <InputLabel>Backup Interval</InputLabel>
                  <Select
                    value={settings.backups.backupIntervalHours}
                    onChange={(e) => handleBackupChange('backupIntervalHours', e.target.value)}
                    label="Backup Interval"
                  >
                    <MenuItem value={6}>Every 6 hours</MenuItem>
                    <MenuItem value={12}>Every 12 hours</MenuItem>
                    <MenuItem value={24}>Daily</MenuItem>
                    <MenuItem value={168}>Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!settings.backups.autoBackupEnabled}>
                  <InputLabel>Retention Period</InputLabel>
                  <Select
                    value={settings.backups.retentionPeriodDays}
                    onChange={(e) => handleBackupChange('retentionPeriodDays', e.target.value)}
                    label="Retention Period"
                  >
                    <MenuItem value={1}>1 day</MenuItem>
                    <MenuItem value={7}>7 days</MenuItem>
                    <MenuItem value={30}>30 days</MenuItem>
                    <MenuItem value={90}>90 days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!settings.backups.autoBackupEnabled}>
                  <InputLabel>Storage Location</InputLabel>
                  <Select
                    value={settings.backups.storageLocation}
                    onChange={(e) => handleBackupChange('storageLocation', e.target.value)}
                    label="Storage Location"
                  >
                    <MenuItem value="aws-s3">AWS S3</MenuItem>
                    <MenuItem value="gcp-storage">Google Cloud Storage</MenuItem>
                    <MenuItem value="azure-blob">Azure Blob Storage</MenuItem>
                    <MenuItem value="local">Local Storage</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSave}
              size="large"
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;