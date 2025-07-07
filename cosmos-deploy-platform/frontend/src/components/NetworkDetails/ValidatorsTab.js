import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNetworks } from '../../context/NetworkContext';

// Mock validators if network doesn't have them
const mockValidators = [
  {
    address: 'cosmosvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuursrrzf',
    moniker: 'Validator One',
    identity: '1234ABCD',
    website: 'https://validator-one.example',
    details: 'Professional validator service with 99.9% uptime',
    commission: 5,
    uptime: 99.98,
    stake: 5000000,
    status: 'Active',
  },
  {
    address: 'cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0',
    moniker: 'Validator Two',
    identity: '5678EFGH',
    website: 'https://validator-two.example',
    details: 'Community validator run by enthusiasts',
    commission: 3,
    uptime: 99.75,
    stake: 2500000,
    status: 'Active',
  }
];

const ValidatorsTab = ({ network }) => {
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentValidator, setCurrentValidator] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for adding/editing validators
  const [formData, setFormData] = useState({
    moniker: '',
    identity: '',
    website: '',
    details: '',
    commission: 5,
    stake: 1000
  });
  
  const { updateNetwork } = useNetworks();
  
  // Load validators on mount
  useEffect(() => {
    if (network && network.validators && network.validators.length > 0) {
      setValidators(network.validators);
    } else {
      // Use mock data if no validators exist
      setValidators(mockValidators);
    }
  }, [network]);
  
  // Handle opening dialog for adding a new validator
  const handleAddValidator = () => {
    setIsEditing(false);
    setCurrentValidator(null);
    setFormData({
      moniker: '',
      identity: '',
      website: '',
      details: '',
      commission: 5,
      stake: 1000
    });
    setDialogOpen(true);
  };
  
  // Handle opening dialog for editing a validator
  const handleEditValidator = (validator) => {
    setIsEditing(true);
    setCurrentValidator(validator);
    setFormData({
      moniker: validator.moniker,
      identity: validator.identity || '',
      website: validator.website || '',
      details: validator.details || '',
      commission: validator.commission,
      stake: validator.stake
    });
    setDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'commission' || name === 'stake' ? Number(value) : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing && currentValidator) {
        // Update existing validator
        const updatedValidators = validators.map(v => 
          v.address === currentValidator.address ? { ...v, ...formData } : v
        );
        
        // In a real app, this would call an API
        // await updateValidator(network.id, currentValidator.address, formData);
        
        setValidators(updatedValidators);
      } else {
        // Add new validator (in a real app this would call the API)
        const newValidator = {
          address: `cosmosvaloper${Math.random().toString(36).substring(2, 15)}`,
          status: 'Active',
          uptime: 100,
          ...formData
        };
        
        setValidators([...validators, newValidator]);
      }
      
      setDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to save validator');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle deleting a validator
  const handleDeleteValidator = (validator) => {
    // In a real app, this would call an API
    const updatedValidators = validators.filter(v => v.address !== validator.address);
    setValidators(updatedValidators);
  };
  
  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Jailed':
        return 'error';
      case 'Tombstoned':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Validators
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddValidator}
          disabled={network.status !== 'Active'}
        >
          Add Validator
        </Button>
      </Box>
      
      {network.status !== 'Active' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Validators can only be managed when the network is active. 
          {network.status === 'Created' ? ' Deploy the network first.' : 
           ` Current status: ${network.status}`}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : validators.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Moniker</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Commission</TableCell>
                <TableCell>Stake</TableCell>
                <TableCell>Uptime</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validators.map((validator) => (
                <TableRow key={validator.address}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {validator.moniker}
                    </Typography>
                    {validator.website && (
                      <Typography variant="caption" color="text.secondary" component="div">
                        {validator.website}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {validator.address.substring(0, 12)}...
                    </Typography>
                  </TableCell>
                  <TableCell>{validator.commission}%</TableCell>
                  <TableCell>{validator.stake.toLocaleString()} {network.tokenEconomics.symbol}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={validator.uptime} 
                          color={validator.uptime > 99 ? "success" : 
                                validator.uptime > 95 ? "warning" : "error"}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {validator.uptime.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={validator.status} 
                      color={getStatusColor(validator.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditValidator(validator)}
                        disabled={network.status !== 'Active'}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteValidator(validator)}
                        disabled={network.status !== 'Active'}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No validators found. Add your first validator to get started.
          </Typography>
        </Paper>
      )}
      
      {/* Add/Edit Validator Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Validator' : 'Add Validator'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Moniker (Name)"
              name="moniker"
              value={formData.moniker}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <TextField
              label="Identity (Optional)"
              name="identity"
              value={formData.identity}
              onChange={handleInputChange}
              fullWidth
              placeholder="Keybase ID or other identity service"
            />
            
            <TextField
              label="Website (Optional)"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              fullWidth
              placeholder="https://example.com"
            />
            
            <TextField
              label="Details (Optional)"
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              placeholder="Description of your validator"
            />
            
            <TextField
              label="Commission (%)"
              name="commission"
              type="number"
              value={formData.commission}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
            />
            
            <TextField
              label="Stake Amount"
              name="stake"
              type="number"
              value={formData.stake}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{ 
                inputProps: { min: network.validatorRequirements.minStake },
                endAdornment: network.tokenEconomics.symbol
              }}
              helperText={`Minimum stake: ${network.validatorRequirements.minStake} ${network.tokenEconomics.symbol}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !formData.moniker}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ValidatorsTab;