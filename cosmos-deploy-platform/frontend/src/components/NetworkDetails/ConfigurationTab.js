import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNetworks } from '../../context/NetworkContext';

const ConfigurationTab = ({ network }) => {
  const { updateNetwork } = useNetworks();
  
  // Editable states
  const [isEditing, setIsEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Handle edit button click
  const handleEdit = () => {
    setEditedConfig({
      name: network.name,
      description: network.description || '',
      tokenEconomics: { ...network.tokenEconomics },
      validatorRequirements: { ...network.validatorRequirements },
      governanceSettings: { ...network.governanceSettings },
      modules: [...network.modules]
    });
    setIsEditing(true);
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedConfig(null);
    setError(null);
  };
  
  // Handle save configuration
  const handleSaveConfig = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await updateNetwork(network.id, editedConfig);
      setIsEditing(false);
      setEditedConfig(null);
    } catch (err) {
      setError(err.message || 'Failed to update network configuration');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input change for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., tokenEconomics.name)
      const [section, field] = name.split('.');
      setEditedConfig({
        ...editedConfig,
        [section]: {
          ...editedConfig[section],
          [field]: value
        }
      });
    } else {
      // Handle top-level properties
      setEditedConfig({
        ...editedConfig,
        [name]: value
      });
    }
  };
  
  // Handle numeric input change
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : parseFloat(value);
    
    if (name.includes('.')) {
      // Handle nested numeric properties
      const [section, field] = name.split('.');
      setEditedConfig({
        ...editedConfig,
        [section]: {
          ...editedConfig[section],
          [field]: numericValue
        }
      });
    } else {
      // Handle top-level numeric properties
      setEditedConfig({
        ...editedConfig,
        [name]: numericValue
      });
    }
  };
  
  // Handle distribution change
  const handleDistributionChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : parseFloat(value);
    
    setEditedConfig({
      ...editedConfig,
      tokenEconomics: {
        ...editedConfig.tokenEconomics,
        distribution: {
          ...editedConfig.tokenEconomics.distribution,
          [name]: numericValue
        }
      }
    });
  };
  
  // Handle module toggle
  const handleModuleToggle = (moduleId) => {
    setEditedConfig({
      ...editedConfig,
      modules: editedConfig.modules.map(module => 
        module.id === moduleId 
          ? { ...module, enabled: !module.enabled }
          : module
      )
    });
  };
  
  // Determine if configuration can be edited
  const canEditConfig = network.status === 'Created' || network.status === 'Active';
  
  // Determine if updating would require restart
  const requiresRestart = network.status === 'Active';
  
  // Render the confirmation dialog
  const renderConfirmDialog = () => (
    <Dialog
      open={confirmDialogOpen}
      onClose={() => setConfirmDialogOpen(false)}
    >
      <DialogTitle>Confirm Configuration Update</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {requiresRestart ? (
            <>
              <strong>Warning:</strong> Updating the configuration of an active network will require restarting the network nodes.
              This may cause temporary service interruption.
            </>
          ) : (
            'Are you sure you want to update the network configuration?'
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDialogOpen(false)}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            setConfirmDialogOpen(false);
            handleSaveConfig();
          }}
        >
          Update Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
  
  // Render token economics section
  const renderTokenEconomics = () => {
    const { tokenEconomics } = isEditing ? editedConfig : network;
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Token Economics" 
          sx={{ 
            backgroundColor: 'primary.light', 
            color: 'primary.contrastText' 
          }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Token Name
              </Typography>
              {isEditing ? (
                <TextField
                  name="tokenEconomics.name"
                  value={tokenEconomics.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              ) : (
                <Typography variant="body1">{tokenEconomics.name}</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Token Symbol
              </Typography>
              {isEditing ? (
                <TextField
                  name="tokenEconomics.symbol"
                  value={tokenEconomics.symbol}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              ) : (
                <Typography variant="body1">{tokenEconomics.symbol}</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Decimals
              </Typography>
              {isEditing ? (
                <TextField
                  name="tokenEconomics.decimals"
                  value={tokenEconomics.decimals}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, max: 18 } }}
                />
              ) : (
                <Typography variant="body1">{tokenEconomics.decimals}</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Initial Supply
              </Typography>
              {isEditing ? (
                <TextField
                  name="tokenEconomics.initialSupply"
                  value={tokenEconomics.initialSupply}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                />
              ) : (
                <Typography variant="body1">{tokenEconomics.initialSupply.toLocaleString()}</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Maximum Supply
              </Typography>
              {isEditing ? (
                <TextField
                  name="tokenEconomics.maxSupply"
                  value={tokenEconomics.maxSupply === null ? '' : tokenEconomics.maxSupply}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="No maximum (leave blank for infinite)"
                  InputProps={{ inputProps: { min: tokenEconomics.initialSupply } }}
                />
              ) : (
                <Typography variant="body1">
                  {tokenEconomics.maxSupply === null ? 'No maximum (infinite)' : tokenEconomics.maxSupply.toLocaleString()}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Token Distribution (%)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Validators
                  </Typography>
                  {isEditing ? (
                    <TextField
                      name="validators"
                      value={tokenEconomics.distribution.validators}
                      onChange={handleDistributionChange}
                      variant="outlined"
                      size="small"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  ) : (
                    <Typography variant="body2">{tokenEconomics.distribution.validators}%</Typography>
                  )}
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Community
                  </Typography>
                  {isEditing ? (
                    <TextField
                      name="community"
                      value={tokenEconomics.distribution.community}
                      onChange={handleDistributionChange}
                      variant="outlined"
                      size="small"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  ) : (
                    <Typography variant="body2">{tokenEconomics.distribution.community}%</Typography>
                  )}
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Foundation
                  </Typography>
                  {isEditing ? (
                    <TextField
                      name="foundation"
                      value={tokenEconomics.distribution.foundation}
                      onChange={handleDistributionChange}
                      variant="outlined"
                      size="small"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  ) : (
                    <Typography variant="body2">{tokenEconomics.distribution.foundation}%</Typography>
                  )}
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Airdrop
                  </Typography>
                  {isEditing ? (
                    <TextField
                      name="airdrop"
                      value={tokenEconomics.distribution.airdrop}
                      onChange={handleDistributionChange}
                      variant="outlined"
                      size="small"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  ) : (
                    <Typography variant="body2">{tokenEconomics.distribution.airdrop}%</Typography>
                  )}
                </Grid>
              </Grid>
              
              {isEditing && (
                <Alert 
                  severity={
                    Object.values(tokenEconomics.distribution).reduce((a, b) => a + b, 0) === 100 
                      ? 'success' 
                      : 'warning'
                  }
                  sx={{ mt: 2 }}
                >
                  Total distribution: {Object.values(tokenEconomics.distribution).reduce((a, b) => a + b, 0)}%
                  {Object.values(tokenEconomics.distribution).reduce((a, b) => a + b, 0) !== 100 && 
                    ' (should equal 100%)'}
                </Alert>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  // Render validator requirements section
  const renderValidatorRequirements = () => {
    const { validatorRequirements } = isEditing ? editedConfig : network;
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Validator Requirements" 
          sx={{ 
            backgroundColor: 'primary.light', 
            color: 'primary.contrastText' 
          }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Minimum Stake
              </Typography>
              {isEditing ? (
                <TextField
                  name="validatorRequirements.minStake"
                  value={validatorRequirements.minStake}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                />
              ) : (
                <Typography variant="body1">{validatorRequirements.minStake.toLocaleString()} {network.tokenEconomics.symbol}</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Maximum Validators
              </Typography>
              {isEditing ? (
                <TextField
                  name="validatorRequirements.maxValidators"
                  value={validatorRequirements.maxValidators === null ? '' : validatorRequirements.maxValidators}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="No maximum (leave blank for unlimited)"
                  InputProps={{ inputProps: { min: 1 } }}
                />
              ) : (
                <Typography variant="body1">
                  {validatorRequirements.maxValidators === null ? 'Unlimited' : validatorRequirements.maxValidators}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Unbonding Period (days)
              </Typography>
              {isEditing ? (
                <TextField
                  name="validatorRequirements.unbondingPeriod"
                  value={validatorRequirements.unbondingPeriod}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                />
              ) : (
                <Typography variant="body1">{validatorRequirements.unbondingPeriod} days</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  // Render governance settings section
  const renderGovernanceSettings = () => {
    const { governanceSettings } = isEditing ? editedConfig : network;
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Governance Settings" 
          sx={{ 
            backgroundColor: 'primary.light', 
            color: 'primary.contrastText' 
          }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Voting Period (days)
              </Typography>
              {isEditing ? (
                <TextField
                  name="governanceSettings.votingPeriod"
                  value={governanceSettings.votingPeriod}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                />
              ) : (
                <Typography variant="body1">{governanceSettings.votingPeriod} days</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Quorum (%)
              </Typography>
              {isEditing ? (
                <TextField
                  name="governanceSettings.quorum"
                  value={governanceSettings.quorum}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              ) : (
                <Typography variant="body1">{governanceSettings.quorum}%</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Threshold (%)
              </Typography>
              {isEditing ? (
                <TextField
                  name="governanceSettings.threshold"
                  value={governanceSettings.threshold}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              ) : (
                <Typography variant="body1">{governanceSettings.threshold}%</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Veto Threshold (%)
              </Typography>
              {isEditing ? (
                <TextField
                  name="governanceSettings.vetoThreshold"
                  value={governanceSettings.vetoThreshold}
                  onChange={handleNumericChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              ) : (
                <Typography variant="body1">{governanceSettings.vetoThreshold}%</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  // Render modules section
  const renderModules = () => {
    const { modules } = isEditing ? editedConfig : network;
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Modules" 
          sx={{ 
            backgroundColor: 'primary.light', 
            color: 'primary.contrastText' 
          }}
        />
        <CardContent>
          <Grid container spacing={2}>
            {modules.map((module) => (
              <Grid item xs={12} sm={6} md={4} key={module.id}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: module.enabled ? 'background.paper' : 'action.disabledBackground',
                    opacity: module.enabled ? 1 : 0.7
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1">{module.name}</Typography>
                    {isEditing ? (
                      <Switch
                        checked={module.enabled}
                        onChange={() => handleModuleToggle(module.id)}
                        color="primary"
                      />
                    ) : (
                      <Chip 
                        label={module.enabled ? 'Enabled' : 'Disabled'} 
                        color={module.enabled ? 'success' : 'default'}
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {getModuleDescription(module.id)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  // Helper function to get module descriptions
  const getModuleDescription = (moduleId) => {
    const descriptions = {
      bank: 'Handles token transfers and account balances',
      staking: 'Manages the proof-of-stake system and validators',
      gov: 'Enables on-chain governance and proposal voting',
      ibc: 'Provides Inter-Blockchain Communication for cross-chain transfers',
      wasm: 'Supports WebAssembly smart contracts',
      nft: 'Enables non-fungible token functionality',
      authz: 'Provides authorization capabilities for accounts',
      feegrant: 'Allows paying fees on behalf of other accounts'
    };
    
    return descriptions[moduleId] || 'No description available';
  };
  
  // Render action buttons
  const renderActionButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
      {isEditing ? (
        <>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<CancelIcon />}
            onClick={handleCancelEdit}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
            onClick={() => setConfirmDialogOpen(true)}
            disabled={loading}
          >
            Save Changes
          </Button>
        </>
      ) : (
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<EditIcon />}
          onClick={handleEdit}
          disabled={!canEditConfig}
        >
          Edit Configuration
        </Button>
      )}
    </Box>
  );
  
  if (!network) {
    return <Typography>Loading network configuration...</Typography>;
  }
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {!canEditConfig && !isEditing && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Configuration cannot be edited in the current network state: {network.status}
        </Alert>
      )}
      
      {renderTokenEconomics()}
      {renderValidatorRequirements()}
      {renderGovernanceSettings()}
      {renderModules()}
      
      {renderActionButtons()}
      {renderConfirmDialog()}
    </Box>
  );
};

export default ConfigurationTab;