import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Chip, 
  Button, 
  CircularProgress,
  Divider,
  Grid,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useNetworks } from '../context/NetworkContext';

import ConfigurationTab from '../components/NetworkDetails/ConfigurationTab';
import ValidatorsTab from '../components/NetworkDetails/ValidatorsTab';
import MonitoringTab from '../components/NetworkDetails/MonitoringTab';
import GovernanceTab from '../components/NetworkDetails/GovernanceTab';
import LogsTab from '../components/NetworkDetails/LogsTab';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BackupIcon from '@mui/icons-material/Backup';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NetworkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNetwork, loading, error, deleteNetwork, deployNetwork, backupNetwork } = useNetworks();
  
  const [network, setNetwork] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [deployEnvironment, setDeployEnvironment] = useState('local');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [backupDescription, setBackupDescription] = useState('');
  
  // Fetch network data
  useEffect(() => {
    const fetchNetworkDetails = async () => {
      const networkData = await getNetwork(id);
      setNetwork(networkData);
    };
    
    fetchNetworkDetails();
  }, [getNetwork, id]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Handle network deployment
  const handleDeploy = async () => {
    await deployNetwork(id, deployEnvironment);
    setDeployDialogOpen(false);
  };
  
  // Handle network deletion
  const handleDelete = async () => {
    await deleteNetwork(id);
    setDeleteDialogOpen(false);
    navigate('/networks');
  };
  
  // Handle network backup
  const handleBackup = async () => {
    await backupNetwork(id, backupDescription);
    setBackupDialogOpen(false);
    setBackupDescription('');
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Created':
        return 'primary';
      case 'Deploying':
      case 'Updating':
      case 'Restoring':
        return 'warning';
      case 'Failed':
      case 'Inactive':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Render action buttons based on network status
  const renderActionButtons = () => {
    if (!network) return null;
    
    const isActive = network.status === 'Active';
    const isCreated = network.status === 'Created';
    const isProcessing = ['Deploying', 'Updating', 'Restoring'].includes(network.status);
    
    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {isCreated && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => setDeployDialogOpen(true)}
          >
            Deploy
          </Button>
        )}
        
        {isActive && (
          <Button
            variant="outlined"
            startIcon={<BackupIcon />}
            onClick={() => setBackupDialogOpen(true)}
          >
            Backup
          </Button>
        )}
        
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isProcessing}
        >
          Delete
        </Button>
      </Box>
    );
  };
  
  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  // Render not found state
  if (!loading && !network) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/networks')}
          sx={{ mb: 2 }}
        >
          Back to Networks
        </Button>
        <Alert severity="warning">
          Network not found. It may have been deleted or you don't have access to it.
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/networks')}
        sx={{ mb: 2 }}
      >
        Back to Networks
      </Button>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mr: 2 }}>
                {network.name}
              </Typography>
              <Chip 
                label={network.status} 
                color={getStatusColor(network.status)} 
                sx={{ fontWeight: 'medium' }}
              />
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {network.description || 'No description provided.'}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Chain ID
                </Typography>
                <Typography variant="body1">
                  {network.chainId}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Token
                </Typography>
                <Typography variant="body1">
                  {network.tokenEconomics.name} ({network.tokenEconomics.symbol})
                </Typography>
              </Box>
              
              {network.deployedEnvironment && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Environment
                  </Typography>
                  <Typography variant="body1">
                    {network.deployedEnvironment}
                  </Typography>
                </Box>
              )}
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">
                  {new Date(network.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            alignItems: 'center'
          }}>
            {renderActionButtons()}
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ width: '100%' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            mb: 3
          }}
        >
          <Tab label="Configuration" />
          <Tab label="Validators" />
          <Tab label="Monitoring" />
          <Tab label="Governance" />
          <Tab label="Logs" />
        </Tabs>
        
        <Box sx={{ py: 2 }}>
          {currentTab === 0 && <ConfigurationTab network={network} />}
          {currentTab === 1 && <ValidatorsTab network={network} />}
          {currentTab === 2 && <MonitoringTab network={network} />}
          {currentTab === 3 && <GovernanceTab network={network} />}
          {currentTab === 4 && <LogsTab network={network} />}
        </Box>
      </Box>
      
      {/* Deploy Dialog */}
      <Dialog
        open={deployDialogOpen}
        onClose={() => setDeployDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Deploy Network</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Choose an environment to deploy "{network?.name}" to:
          </DialogContentText>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['local', 'aws', 'gcp', 'azure'].map((env) => (
              <Paper 
                key={env}
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  border: deployEnvironment === env ? '2px solid' : '1px solid',
                  borderColor: deployEnvironment === env ? 'primary.main' : 'divider',
                  backgroundColor: deployEnvironment === env ? 'primary.light' : 'background.paper',
                  color: deployEnvironment === env ? 'primary.contrastText' : 'text.primary',
                }}
                onClick={() => setDeployEnvironment(env)}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {env === 'local' ? 'Local Machine' : 
                   env === 'aws' ? 'Amazon Web Services' :
                   env === 'gcp' ? 'Google Cloud Platform' : 'Microsoft Azure'}
                </Typography>
                <Typography variant="body2" color={deployEnvironment === env ? 'inherit' : 'text.secondary'}>
                  {env === 'local' 
                    ? 'Deploy on your local machine for development and testing.'
                    : `Deploy on ${env === 'aws' ? 'AWS' : env === 'gcp' ? 'GCP' : 'Azure'} cloud for production use.`}
                </Typography>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeployDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleDeploy}
          >
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Network</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the network "{network?.name}"? 
            This action cannot be undone.
            {network?.status === 'Active' && (
              <Box component="span" sx={{ display: 'block', mt: 2, color: 'error.main', fontWeight: 'bold' }}>
                Warning: This network is currently active. Deleting it will terminate all resources.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Backup Dialog */}
      <Dialog
        open={backupDialogOpen}
        onClose={() => setBackupDialogOpen(false)}
      >
        <DialogTitle>Create Backup</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Create a backup of the network "{network?.name}" at its current state.
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Description (optional)
              </Typography>
              <input
                type="text"
                value={backupDescription}
                onChange={(e) => setBackupDescription(e.target.value)}
                placeholder="E.g., Before governance upgrade"
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleBackup}
          >
            Create Backup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NetworkDetails;