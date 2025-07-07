import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Switch,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Collapse,
  TextField,
  Slider,
  InputAdornment,
  Button,
  Chip,
  Alert,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import PaidIcon from '@mui/icons-material/Paid';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StorageIcon from '@mui/icons-material/Storage';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

// Core modules that are required and cannot be disabled
const CORE_MODULES = ['bank', 'staking', 'distribution', 'gov', 'slashing'];

// Optional modules
const OPTIONAL_MODULES = ['ibc', 'authz', 'feegrant', 'group', 'mint', 'nft', 'wasm', 'upgrade', 'evidence', 'params'];

// Module metadata for UI display
const MODULE_METADATA = {
  bank: {
    name: 'Bank',
    description: 'Handles token transfers between accounts',
    icon: <AccountBalanceWalletIcon />,
    params: ['sendEnabled', 'defaultSendEnabled']
  },
  staking: {
    name: 'Staking',
    description: 'Manages proof-of-stake validation and delegation',
    icon: <SecurityIcon />,
    params: ['unbondingTime', 'maxValidators', 'maxEntries', 'historicalEntries', 'bondDenom']
  },
  distribution: {
    name: 'Distribution',
    description: 'Distributes rewards to validators and delegators',
    icon: <PaidIcon />,
    params: ['communityTax', 'baseProposerReward', 'bonusProposerReward', 'withdrawAddrEnabled']
  },
  gov: {
    name: 'Governance',
    description: 'On-chain governance proposals and voting',
    icon: <GavelIcon />,
    params: ['depositParams', 'votingParams', 'tallyParams']
  },
  slashing: {
    name: 'Slashing',
    description: 'Penalties for validator misbehavior',
    icon: <WarningIcon />,
    params: ['signedBlocksWindow', 'minSignedPerWindow', 'downtimeJailDuration', 'slashFractionDoubleSign', 'slashFractionDowntime']
  },
  ibc: {
    name: 'Inter-Blockchain Communication (IBC)',
    description: 'Cross-chain communication and token transfers',
    icon: <SyncAltIcon />,
    params: []
  },
  authz: {
    name: 'Authorization',
    description: 'Allows accounts to authorize others to perform actions on their behalf',
    icon: <VerifiedUserIcon />,
    params: []
  },
  feegrant: {
    name: 'Fee Grant',
    description: 'Allows accounts to pay fees for other accounts',
    icon: <PaidIcon />,
    params: []
  },
  group: {
    name: 'Group',
    description: 'Management of on-chain multisig groups and accounts',
    icon: <AccountTreeIcon />,
    params: []
  },
  mint: {
    name: 'Mint',
    description: 'Token minting and inflation management',
    icon: <PaidIcon />,
    params: ['mintDenom', 'inflationRateChange', 'inflationMax', 'inflationMin', 'goalBonded', 'blocksPerYear']
  },
  nft: {
    name: 'NFT',
    description: 'Non-fungible token management',
    icon: <ReceiptLongIcon />,
    params: []
  },
  wasm: {
    name: 'CosmWasm',
    description: 'Support for WebAssembly smart contracts',
    icon: <CodeIcon />,
    params: ['codeUploadAccess', 'instantiateDefaultPermission']
  },
  upgrade: {
    name: 'Upgrade',
    description: 'Coordinated software upgrades',
    icon: <UpgradeIcon />,
    params: []
  },
  evidence: {
    name: 'Evidence',
    description: 'Handles evidence of validator misbehavior',
    icon: <WarningIcon />,
    params: ['maxEvidenceAge']
  },
  params: {
    name: 'Parameters',
    description: 'Global parameter store',
    icon: <StorageIcon />,
    params: []
  },
  crisis: {
    name: 'Crisis',
    description: 'Invariant checking and halting',
    icon: <WarningIcon />,
    params: ['constantFee']
  },
  vesting: {
    name: 'Vesting',
    description: 'Token vesting accounts',
    icon: <SpeedIcon />,
    params: []
  }
};

const ModulesForm = ({ formData, setFormData, errors, setErrors, validateForm }) => {
  const [expandedModules, setExpandedModules] = useState({});
  
  // Initialize modules if not present
  useEffect(() => {
    if (!formData.modules) {
      setFormData({
        ...formData,
        modules: {
          enabled: [...CORE_MODULES, 'ibc', 'authz', 'feegrant'],
          params: {}
        }
      });
    }
  }, []);
  
  // Validate modules selection
  const validateModules = () => {
    let fieldErrors = { ...errors };
    
    // Ensure all core modules are enabled
    const enabledModules = formData.modules?.enabled || [];
    const missingCoreModules = CORE_MODULES.filter(module => !enabledModules.includes(module));
    
    if (missingCoreModules.length > 0) {
      fieldErrors['modules.enabled'] = `The following core modules are required: ${missingCoreModules.join(', ')}`;
    } else {
      delete fieldErrors['modules.enabled'];
    }
    
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };
  
  // Toggle module expansion
  const toggleModuleExpanded = (module) => {
    setExpandedModules({
      ...expandedModules,
      [module]: !expandedModules[module]
    });
  };
  
  // Handle module toggle
  const handleModuleToggle = (module) => {
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.modules) {
      updatedFormData.modules = {
        enabled: [...CORE_MODULES],
        params: {}
      };
    }
    
    const isEnabled = updatedFormData.modules.enabled.includes(module);
    
    if (isEnabled) {
      // Don't allow disabling core modules
      if (CORE_MODULES.includes(module)) {
        return;
      }
      
      // Remove module from enabled list
      updatedFormData.modules.enabled = updatedFormData.modules.enabled.filter(m => m !== module);
    } else {
      // Add module to enabled list
      updatedFormData.modules.enabled = [...updatedFormData.modules.enabled, module];
    }
    
    setFormData(updatedFormData);
    validateModules();
  };
  
  // Handle module parameter change
  const handleParamChange = (module, param, value) => {
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.modules) {
      updatedFormData.modules = {
        enabled: [...CORE_MODULES],
        params: {}
      };
    }
    
    if (!updatedFormData.modules.params) {
      updatedFormData.modules.params = {};
    }
    
    if (!updatedFormData.modules.params[module]) {
      updatedFormData.modules.params[module] = {};
    }
    
    updatedFormData.modules.params[module][param] = value;
    setFormData(updatedFormData);
  };
  
  // Reset module parameters to defaults
  const resetModuleParams = (module) => {
    const updatedFormData = { ...formData };
    
    if (updatedFormData.modules?.params) {
      delete updatedFormData.modules.params[module];
      setFormData(updatedFormData);
    }
  };
  
  // Get if module is enabled
  const isModuleEnabled = (module) => {
    return formData.modules?.enabled?.includes(module) || false;
  };
  
  // Get module parameter value
  const getModuleParamValue = (module, param, defaultValue) => {
    return formData.modules?.params?.[module]?.[param] !== undefined
      ? formData.modules.params[module][param]
      : defaultValue;
  };
  
  // Render parameters for a module
  const renderModuleParams = (module) => {
    if (!MODULE_METADATA[module]?.params || MODULE_METADATA[module].params.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          No configurable parameters for this module.
        </Typography>
      );
    }
    
    switch (module) {
      case 'bank':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={getModuleParamValue('bank', 'defaultSendEnabled', true)}
                    onChange={(e) => handleParamChange('bank', 'defaultSendEnabled', e.target.checked)}
                  />
                }
                label="Default Send Enabled"
              />
              <FormHelperText>
                Allow token transfers by default
              </FormHelperText>
            </Grid>
          </Grid>
        );
        
      case 'mint':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mint Denom"
                value={getModuleParamValue('mint', 'mintDenom', formData.tokenEconomics?.symbol?.toLowerCase() || 'stake')}
                onChange={(e) => handleParamChange('mint', 'mintDenom', e.target.value)}
                fullWidth
                helperText="Token denomination to mint"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Inflation Rate Change"
                type="number"
                value={getModuleParamValue('mint', 'inflationRateChange', formData.tokenEconomics?.inflationRateChange || 0.13)}
                onChange={(e) => handleParamChange('mint', 'inflationRateChange', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 10,
                  step: 0.01
                }}
                helperText="Annual inflation rate change"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Maximum Inflation"
                type="number"
                value={getModuleParamValue('mint', 'inflationMax', formData.tokenEconomics?.inflationMax || 20)}
                onChange={(e) => handleParamChange('mint', 'inflationMax', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 0.1
                }}
                helperText="Maximum annual inflation rate"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Minimum Inflation"
                type="number"
                value={getModuleParamValue('mint', 'inflationMin', formData.tokenEconomics?.inflationMin || 2)}
                onChange={(e) => handleParamChange('mint', 'inflationMin', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 0.1
                }}
                helperText="Minimum annual inflation rate"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Goal Bonded"
                type="number"
                value={getModuleParamValue('mint', 'goalBonded', formData.tokenEconomics?.bondedRatioGoal || 67)}
                onChange={(e) => handleParamChange('mint', 'goalBonded', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 1
                }}
                helperText="Target percentage of staked tokens"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Blocks Per Year"
                type="number"
                value={getModuleParamValue('mint', 'blocksPerYear', formData.tokenEconomics?.blocksPerYear || 6311520)}
                onChange={(e) => handleParamChange('mint', 'blocksPerYear', Number(e.target.value))}
                fullWidth
                inputProps={{
                  min: 1,
                  step: 100000
                }}
                helperText="Estimated blocks produced per year"
              />
            </Grid>
          </Grid>
        );
        
      case 'slashing':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Signed Blocks Window"
                type="number"
                value={getModuleParamValue('slashing', 'signedBlocksWindow', 100)}
                onChange={(e) => handleParamChange('slashing', 'signedBlocksWindow', Number(e.target.value))}
                fullWidth
                inputProps={{
                  min: 10,
                  max: 10000,
                  step: 10
                }}
                helperText="Number of blocks for uptime tracking window"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Min Signed Per Window"
                type="number"
                value={getModuleParamValue('slashing', 'minSignedPerWindow', 0.5)}
                onChange={(e) => handleParamChange('slashing', 'minSignedPerWindow', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 1,
                  step: 0.01
                }}
                helperText="Minimum % of signed blocks to avoid downtime slashing"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Downtime Jail Duration"
                type="number"
                value={getModuleParamValue('slashing', 'downtimeJailDuration', 600)}
                onChange={(e) => handleParamChange('slashing', 'downtimeJailDuration', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                inputProps={{
                  min: 1,
                  step: 60
                }}
                helperText="Jail duration for downtime slashing"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Slash Fraction Double Sign"
                type="number"
                value={getModuleParamValue('slashing', 'slashFractionDoubleSign', 0.05)}
                onChange={(e) => handleParamChange('slashing', 'slashFractionDoubleSign', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 1,
                  step: 0.01
                }}
                helperText="% of stake slashed for double-signing"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Slash Fraction Downtime"
                type="number"
                value={getModuleParamValue('slashing', 'slashFractionDowntime', 0.01)}
                onChange={(e) => handleParamChange('slashing', 'slashFractionDowntime', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 1,
                  step: 0.001
                }}
                helperText="% of stake slashed for downtime"
              />
            </Grid>
          </Grid>
        );
        
      case 'wasm':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={getModuleParamValue('wasm', 'allowUpload', true)}
                    onChange={(e) => handleParamChange('wasm', 'allowUpload', e.target.checked)}
                  />
                }
                label="Allow Contract Upload"
              />
              <FormHelperText>
                Enable uploading new WASM smart contracts
              </FormHelperText>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={getModuleParamValue('wasm', 'allowExecuteAnyAddress', false)}
                    onChange={(e) => handleParamChange('wasm', 'allowExecuteAnyAddress', e.target.checked)}
                  />
                }
                label="Allow Execute Any Address"
              />
              <FormHelperText>
                Allow execution of contracts by any address (advanced)
              </FormHelperText>
            </Grid>
          </Grid>
        );
        
      case 'distribution':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Community Tax"
                type="number"
                value={getModuleParamValue('distribution', 'communityTax', formData.tokenEconomics?.communityTax || 2)}
                onChange={(e) => handleParamChange('distribution', 'communityTax', Number(e.target.value))}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 0.1
                }}
                helperText="Percentage of rewards allocated to community pool"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={getModuleParamValue('distribution', 'withdrawAddrEnabled', true)}
                    onChange={(e) => handleParamChange('distribution', 'withdrawAddrEnabled', e.target.checked)}
                  />
                }
                label="Enable Reward Withdrawal Address"
              />
              <FormHelperText>
                Allow setting custom withdrawal addresses for rewards
              </FormHelperText>
            </Grid>
          </Grid>
        );
        
      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Advanced parameters are only configurable in the advanced mode.
          </Typography>
        );
    }
  };
  
  // Group modules by required and optional
  const requiredModules = CORE_MODULES;
  const optionalModules = OPTIONAL_MODULES;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Modules Configuration
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure the modules for your Cosmos blockchain network. Modules add specific functionality to your blockchain.
      </Typography>
      
      {errors['modules.enabled'] && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors['modules.enabled']}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Core Modules
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            These core modules are required and cannot be disabled.
          </Typography>
          
          <Paper variant="outlined" sx={{ mb: 3 }}>
            <List disablePadding>
              {requiredModules.map((module, index) => (
                <React.Fragment key={module}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem
                    secondaryAction={
                      <Box>
                        <Chip 
                          label="Required" 
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <IconButton
                          edge="end"
                          onClick={() => toggleModuleExpanded(module)}
                        >
                          {expandedModules[module] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      {MODULE_METADATA[module]?.icon || <InfoOutlinedIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={MODULE_METADATA[module]?.name || module}
                      secondary={MODULE_METADATA[module]?.description || ''}
                    />
                  </ListItem>
                  <Collapse in={expandedModules[module]} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 3, backgroundColor: 'background.default' }}>
                      {renderModuleParams(module)}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button 
                          size="small" 
                          onClick={() => resetModuleParams(module)}
                          disabled={!formData.modules?.params?.[module]}
                        >
                          Reset to Defaults
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Optional Modules
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            These modules can be enabled or disabled based on your needs.
          </Typography>
          
          <Paper variant="outlined">
            <List disablePadding>
              {optionalModules.map((module, index) => (
                <React.Fragment key={module}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isModuleEnabled(module)}
                              onChange={() => handleModuleToggle(module)}
                            />
                          }
                          label=""
                        />
                        {isModuleEnabled(module) && (
                          <IconButton
                            edge="end"
                            onClick={() => toggleModuleExpanded(module)}
                          >
                            {expandedModules[module] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        )}
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      {MODULE_METADATA[module]?.icon || <InfoOutlinedIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={MODULE_METADATA[module]?.name || module}
                      secondary={MODULE_METADATA[module]?.description || ''}
                    />
                  </ListItem>
                  {isModuleEnabled(module) && (
                    <Collapse in={expandedModules[module]} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 3, backgroundColor: 'background.default' }}>
                        {renderModuleParams(module)}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button 
                            size="small" 
                            onClick={() => resetModuleParams(module)}
                            disabled={!formData.modules?.params?.[module]}
                          >
                            Reset to Defaults
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {!formData.advancedMode && (
        <Alert severity="info" sx={{ mt: 4 }}>
          Enable Advanced Mode in Basic Information to configure additional module parameters.
        </Alert>
      )}
    </Box>
  );
};

export default ModulesForm;