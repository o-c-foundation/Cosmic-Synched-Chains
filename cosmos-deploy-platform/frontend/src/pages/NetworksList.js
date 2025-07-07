import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Alert,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNetworks } from '../context/NetworkContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BackupIcon from '@mui/icons-material/Backup';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const NetworksList = () => {
  const { networks, loading, error, deleteNetwork, deployNetwork } = useNetworks();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredNetworks, setFilteredNetworks] = useState([]);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [deployEnvironment, setDeployEnvironment] = useState('local');
  
  // Filter networks based on search term and status filter
  useEffect(() => {
    if (!networks) return;
    
    let filtered = [...networks];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(network => 
        network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        network.chainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        network.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(network => network.status === statusFilter);
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredNetworks(filtered);
  }, [networks, searchTerm, statusFilter]);

  // Handle opening the actions menu
  const handleMenuOpen = (event, network) => {
    setAnchorEl(event.currentTarget);
    setSelectedNetwork(network);
  };

  // Handle closing the actions menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle network deletion
  const handleDeleteNetwork = async () => {
    if (selectedNetwork) {
      await deleteNetwork(selectedNetwork.id);
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };
  
  // Handle network deployment
  const handleDeployNetwork = async () => {
    if (selectedNetwork) {
      await deployNetwork(selectedNetwork.id, deployEnvironment);
      setDeployDialogOpen(false);
      handleMenuClose();
    }
  };
  
  // Get appropriate chip color based on network status
  const getStatusChipColor = (status) => {
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

  // Render each network card
  const renderNetworkCard = (network) => {
    const isActionable = network.status !== 'Deploying' && network.status !== 'Updating' && network.status !== 'Restoring';
    
    return (
      <Grid item xs={12} md={6} lg={4} key={network.id}>
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" component="h2" gutterBottom noWrap>
                  {network.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'block',
                    mb: 1
                  }}
                >
                  Chain ID: {network.chainId}
                </Typography>
                <Chip 
                  label={network.status} 
                  color={getStatusChipColor(network.status)} 
                  size="small"
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
              
              <IconButton 
                aria-label="network actions" 
                onClick={(e) => handleMenuOpen(e, network)}
                disabled={!isActionable}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                height: '40px'
              }}
            >
              {network.description || 'No description provided.'}
            </Typography>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Token: {network.tokenEconomics.symbol}
                </Typography>
                {network.deployedEnvironment && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Environment: {network.deployedEnvironment}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Created: {new Date(network.createdAt).toLocaleDateString()}
                </Typography>
                {network.lastBackupAt && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last backup: {new Date(network.lastBackupAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
          
          <Box sx={{ p: 2, pt: 0 }}>
            <Button 
              variant="contained" 
              fullWidth
              color="primary"
              onClick={() => navigate(`/networks/${network.id}`)}
            >
              {network.status === 'Created' ? 'Configure' : 'Manage'}
            </Button>
          </Box>
        </Card>
      </Grid>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          My Networks
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddCircleOutlineIcon />} 
          onClick={() => navigate('/create-network')}
        >
          Create Network
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search networks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: '50%' } }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: 'action.active' }} />
          <Box component="span" sx={{ mr: 1 }}>Status:</Box>
          {['All', 'Created', 'Deploying', 'Active', 'Failed', 'Inactive'].map((status) => (
            <Chip
              key={status}
              label={status}
              size="small"
              color={statusFilter === status ? 'primary' : 'default'}
              onClick={() => setStatusFilter(status)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredNetworks.length > 0 ? (
        <Grid container spacing={3}>
          {filteredNetworks.map(renderNetworkCard)}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#f7f9fc', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            {searchTerm || statusFilter !== 'All' 
              ? 'No networks match your search criteria' 
              : 'You haven\'t created any networks yet'}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filters to find what you\'re looking for'
              : 'Get started by creating your first blockchain network'}
          </Typography>
          {!searchTerm && statusFilter === 'All' && (
            <Button 
              variant="contained" 
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate('/create-network')}
            >
              Create Network
            </Button>
          )}
        </Box>
      )}
      
      {/* Network Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => navigate(`/networks/${selectedNetwork?.id}`)}
        >
          View Details
        </MenuItem>
        {selectedNetwork?.status === 'Created' && (
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              setDeployDialogOpen(true);
            }}
          >
            <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
            Deploy Network
          </MenuItem>
        )}
        {selectedNetwork?.status === 'Active' && (
          <MenuItem 
            onClick={() => navigate(`/networks/${selectedNetwork?.id}/backup`)}
          >
            <BackupIcon fontSize="small" sx={{ mr: 1 }} />
            Create Backup
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            setDeleteDialogOpen(true);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Network
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Network</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the network "{selectedNetwork?.name}"? 
            This action cannot be undone.
            {selectedNetwork?.status === 'Active' && (
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
            onClick={handleDeleteNetwork} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Deploy Dialog */}
      <Dialog
        open={deployDialogOpen}
        onClose={() => setDeployDialogOpen(false)}
      >
        <DialogTitle>Deploy Network</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select an environment to deploy "{selectedNetwork?.name}".
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['local', 'aws', 'gcp', 'azure'].map((env) => (
              <Card 
                key={env}
                sx={{ 
                  cursor: 'pointer',
                  border: deployEnvironment === env ? '2px solid' : '1px solid',
                  borderColor: deployEnvironment === env ? 'primary.main' : 'divider',
                  backgroundColor: deployEnvironment === env ? 'primary.light' : 'background.paper',
                  color: deployEnvironment === env ? 'primary.contrastText' : 'text.primary',
                }}
                onClick={() => setDeployEnvironment(env)}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {env === 'local' ? 'Local' : 
                     env === 'aws' ? 'Amazon Web Services' :
                     env === 'gcp' ? 'Google Cloud Platform' : 'Microsoft Azure'}
                  </Typography>
                  <Typography variant="body2" color={deployEnvironment === env ? 'inherit' : 'text.secondary'}>
                    {env === 'local' 
                      ? 'Deploy to your local machine for development and testing.'
                      : `Deploy to ${env === 'aws' ? 'AWS' : env === 'gcp' ? 'GCP' : 'Azure'} cloud for production use.`}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeployDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeployNetwork} 
            color="primary"
            variant="contained"
          >
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NetworksList;