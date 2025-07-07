import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  Button, 
  Chip, 
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import { 
  CloudUploadOutlined, 
  SaveOutlined, 
  RestoreOutlined, 
  DeleteOutlined,
  RefreshOutlined,
  SettingsOutlined,
  MonitorHeartOutlined,
  HowToVoteOutlined,
  ContentCopyOutlined
} from '@mui/icons-material';
import { useNetworks } from '../context/NetworkContext';
import ConfigurationTab from '../components/NetworkDetails/ConfigurationTab';
import ValidatorsTab from '../components/NetworkDetails/ValidatorsTab';
import MonitoringTab from '../components/NetworkDetails/MonitoringTab';
import GovernanceTab from '../components/NetworkDetails/GovernanceTab';
import LogsTab from '../components/NetworkDetails/LogsTab';
import { Network } from '../types/network';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`network-tabpanel-${index}`}
      aria-labelledby={`network-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const NetworkDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNetwork, deployNetwork, updateNetwork, deleteNetwork, backupNetwork, restoreNetwork } = useNetworks();
  const [network, setNetwork] = useState<Network | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Dialog states
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Deploy environment state
  const [deployEnvironment, setDeployEnvironment] = useState('local');
  
  // Load network data
  useEffect(() => {
    const loadNetwork = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getNetwork(id);
        setNetwork(data);
        setError(null);
      } catch (err) {
        setError('Failed to load network details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadNetwork();
  }, [id, getNetwork]);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleDeploymentChange = (event: SelectChangeEvent) => {
    setDeployEnvironment(event.target.value);
  };
  
  const handleDeploy = async () => {
    if (!network) return;
    
    try {
      await deployNetwork(network.id, deployEnvironment);
      setDeployDialogOpen(false);
    } catch (err) {
      console.error('Failed to deploy network', err);
    }
  };
  
  const handleBackup = async () => {
    if (!network) return;
    
    try {
      const backupId = await backupNetwork(network.id);
      setBackupDialogOpen(false);
      // Show success message or handle the backupId
      console.log('Backup created with ID:', backupId);
    } catch (err) {
      console.error('Failed to backup network', err);
    }
  };
  
  const handleRestore = async () => {
    if (!network) return;
    
    try {
      // In a real app, we would have a list of backups to choose from
      const mockBackupId = `backup-${Date.now()}`;
      await restoreNetwork(network.id, mockBackupId);
      setRestoreDialogOpen(false);
    } catch (err) {
      console.error('Failed to restore network', err);
    }
  };
  
  const handleDelete = async () => {
    if (!network) return;
    
    try {
      await deleteNetwork(network.id);
      setDeleteDialogOpen(false);
      navigate('/networks');
    } catch (err) {
      console.error('Failed to delete network', err);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !network) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Network not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/networks')}>
          Back to Networks List
        </Button>
      </Box>
    );
  }
  
  // Status chip color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Deploying':
      case 'Updating':
      case 'Restoring':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {network.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={network.status} 
              color={getStatusColor(network.status) as "success" | "default" | "primary" | "secondary" | "error" | "info" | "warning"} 
            />
            <Typography variant="body2" color="text.secondary">
              Chain ID: {network.chainId}
            </Typography>
            <Tooltip title="Copy Chain ID">
              <IconButton 
                size="small" 
                onClick={() => navigator.clipboard.writeText(network.chainId)}
              >
                <ContentCopyOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {network.status === 'Created' && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<CloudUploadOutlined />}
              onClick={() => setDeployDialogOpen(true)}
            >
              Deploy
            </Button>
          )}
          
          {network.status === 'Active' && (
            <>
              <Button 
                variant="outlined" 
                startIcon={<SaveOutlined />}
                onClick={() => setBackupDialogOpen(true)}
              >
                Backup
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<RestoreOutlined />}
                onClick={() => setRestoreDialogOpen(true)}
              >
                Restore
              </Button>
            </>
          )}
          
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteOutlined />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      {/* Network Info Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Environment
              </Typography>
              <Typography variant="h5">
                {network.deployedEnvironment || 'Not Deployed'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Created
              </Typography>
              <Typography variant="h5">
                {new Date(network.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="h5">
                {new Date(network.updatedAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Last Backup
              </Typography>
              <Typography variant="h5">
                {network.lastBackupAt 
                  ? new Date(network.lastBackupAt).toLocaleDateString() 
                  : 'Never'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Quick Action Buttons */}
      {network.status === 'Active' && (
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            startIcon={<RefreshOutlined />}
            onClick={() => getNetwork(network.id)}
          >
            Refresh
          </Button>
          <Button 
            variant="outlined"
            startIcon={<SettingsOutlined />}
            onClick={() => setTabValue(0)}
          >
            Configuration
          </Button>
          <Button 
            variant="outlined"
            startIcon={<MonitorHeartOutlined />}
            onClick={() => setTabValue(2)}
          >
            Monitoring
          </Button>
          <Button 
            variant="outlined"
            startIcon={<HowToVoteOutlined />}
            onClick={() => setTabValue(3)}
          >
            Governance
          </Button>
        </Box>
      )}
      
      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="network tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Configuration" />
          <Tab label="Validators" />
          <Tab label="Monitoring" />
          <Tab label="Governance" />
          <Tab label="Logs" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <ConfigurationTab network={network} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ValidatorsTab network={network} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <MonitoringTab network={network} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <GovernanceTab network={network} />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <LogsTab network={network} />
        </TabPanel>
      </Paper>
      
      {/* Deploy Dialog */}
      <Dialog open={deployDialogOpen} onClose={() => setDeployDialogOpen(false)}>
        <DialogTitle>Deploy Network</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Select the environment where you want to deploy your blockchain network.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="deploy-environment-label">Environment</InputLabel>
            <Select
              labelId="deploy-environment-label"
              value={deployEnvironment}
              label="Environment"
              onChange={handleDeploymentChange}
            >
              <MenuItem value="local">Local (Development)</MenuItem>
              <MenuItem value="testnet">Testnet</MenuItem>
              <MenuItem value="aws">AWS Cloud</MenuItem>
              <MenuItem value="gcp">Google Cloud</MenuItem>
              <MenuItem value="azure">Azure</MenuItem>
            </Select>
          </FormControl>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            {deployEnvironment === 'local' 
              ? 'Local deployment is for development purposes only and will deploy the network on your local machine.'
              : deployEnvironment === 'testnet'
                ? 'Testnet deployment will create a public testnet for your blockchain accessible to other users.'
                : 'Cloud deployment will provision infrastructure in your cloud account.'
            }
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeployDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeploy} variant="contained">
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Backup Dialog */}
      <Dialog open={backupDialogOpen} onClose={() => setBackupDialogOpen(false)}>
        <DialogTitle>Backup Network</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will create a backup of your blockchain's current state, including account balances,
            validators, and governance proposals. You can use this backup to restore your network later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBackup} variant="contained">
            Create Backup
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Restore Dialog */}
      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
        <DialogTitle>Restore Network</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will restore your blockchain to a previous state. This action cannot be undone.
            Any data created after the backup will be lost.
          </DialogContentText>
          
          {/* In a real app, we would list available backups here */}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Your network will be temporarily unavailable during restoration.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRestore} variant="contained" color="warning">
            Restore
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Network</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this network? This action cannot be undone.
            All data and resources associated with this network will be permanently removed.
          </DialogContentText>
          
          <Alert severity="error" sx={{ mt: 2 }}>
            This will permanently delete your blockchain network. If it's deployed, all nodes and data will be terminated.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NetworkDetails;