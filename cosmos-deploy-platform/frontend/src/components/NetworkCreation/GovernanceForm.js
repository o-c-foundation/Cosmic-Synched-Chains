import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Slider,
  InputAdornment,
  FormControl,
  FormHelperText,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Collapse,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CodeIcon from '@mui/icons-material/Code';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DescriptionIcon from '@mui/icons-material/Description';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Default proposal types
const PROPOSAL_TYPES = [
  { 
    id: 'text', 
    name: 'Text Proposal',
    description: 'Simple text proposals for general governance decisions',
    icon: <DescriptionIcon />,
    required: true
  },
  { 
    id: 'parameter_change', 
    name: 'Parameter Change',
    description: 'Change parameters of modules without requiring a software upgrade',
    icon: <SettingsIcon />,
    required: true
  },
  { 
    id: 'community_pool_spend', 
    name: 'Community Pool Spend',
    description: 'Propose spending from the community pool',
    icon: <AccountBalanceWalletIcon />,
    required: true
  },
  { 
    id: 'software_upgrade', 
    name: 'Software Upgrade',
    description: 'Coordinate upgrades of the blockchain software',
    icon: <UpgradeIcon />,
    required: false
  },
  { 
    id: 'cancel_software_upgrade', 
    name: 'Cancel Software Upgrade',
    description: 'Cancel a previously approved software upgrade',
    icon: <UpgradeIcon />,
    required: false
  }
];

// For visualization
const governanceProcessData = [
  { name: 'Deposit', phase: 'Deposit', value: 100, description: 'Collecting minimum deposit' },
  { name: 'Voting', phase: 'Voting', value: 100, description: 'Community voting period' },
  { name: 'Processing', phase: 'Processing', value: 100, description: 'Proposal execution if passed' }
];

const GovernanceForm = ({ formData, setFormData, errors, setErrors, validateForm }) => {
  const [expandedTypes, setExpandedTypes] = useState({});
  const [visualizationData, setVisualizationData] = useState([]);
  
  // Initialize governance if not present
  useEffect(() => {
    if (!formData.governance) {
      setFormData({
        ...formData,
        governance: {
          minDeposit: 10000,
          maxDepositPeriod: 14,
          votingPeriod: 14,
          quorum: 33.4,
          threshold: 50,
          vetoThreshold: 33.4,
          maxTitleLength: 140,
          maxDescriptionLength: 10000,
          enabledProposalTypes: ['text', 'parameter_change', 'community_pool_spend', 'software_upgrade', 'cancel_software_upgrade']
        }
      });
    }
  }, []);
  
  // Update visualization data when governance parameters change
  useEffect(() => {
    if (formData.governance) {
      // Days in each phase for visualization
      const depositPeriod = formData.governance.maxDepositPeriod || 14;
      const votingPeriod = formData.governance.votingPeriod || 14;
      const processingPeriod = 1; // Fixed at 1 day for visualization purposes
      
      const data = [
        { name: 'Deposit', phase: 'Deposit', value: depositPeriod, description: 'Collecting minimum deposit' },
        { name: 'Voting', phase: 'Voting', value: votingPeriod, description: 'Community voting period' },
        { name: 'Processing', phase: 'Processing', value: processingPeriod, description: 'Proposal execution if passed' }
      ];
      
      setVisualizationData(data);
    }
  }, [formData.governance]);
  
  // Validate individual field
  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    const path = `governance.${name}`;
    
    switch (name) {
      case 'minDeposit':
        if (!value) {
          fieldErrors[path] = 'Minimum deposit is required';
        } else if (value <= 0) {
          fieldErrors[path] = 'Minimum deposit must be greater than 0';
        } else if (value > 1000000000) {
          fieldErrors[path] = 'Minimum deposit is too large';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'maxDepositPeriod':
        if (!value) {
          fieldErrors[path] = 'Maximum deposit period is required';
        } else if (value < 1) {
          fieldErrors[path] = 'Maximum deposit period must be at least 1 day';
        } else if (value > 90) {
          fieldErrors[path] = 'Maximum deposit period must be at most 90 days';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'votingPeriod':
        if (!value) {
          fieldErrors[path] = 'Voting period is required';
        } else if (value < 1) {
          fieldErrors[path] = 'Voting period must be at least 1 day';
        } else if (value > 90) {
          fieldErrors[path] = 'Voting period must be at most 90 days';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'quorum':
        if (value === undefined || value === null) {
          fieldErrors[path] = 'Quorum is required';
        } else if (value < 0) {
          fieldErrors[path] = 'Quorum must be non-negative';
        } else if (value > 100) {
          fieldErrors[path] = 'Quorum must be at most 100%';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'threshold':
        if (value === undefined || value === null) {
          fieldErrors[path] = 'Threshold is required';
        } else if (value <= 0) {
          fieldErrors[path] = 'Threshold must be greater than 0';
        } else if (value > 100) {
          fieldErrors[path] = 'Threshold must be at most 100%';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'vetoThreshold':
        if (value === undefined || value === null) {
          fieldErrors[path] = 'Veto threshold is required';
        } else if (value < 0) {
          fieldErrors[path] = 'Veto threshold must be non-negative';
        } else if (value > 100) {
          fieldErrors[path] = 'Veto threshold must be at most 100%';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'maxTitleLength':
        if (!value) {
          fieldErrors[path] = 'Maximum title length is required';
        } else if (value < 10) {
          fieldErrors[path] = 'Maximum title length must be at least 10 characters';
        } else if (value > 500) {
          fieldErrors[path] = 'Maximum title length must be at most 500 characters';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'maxDescriptionLength':
        if (!value) {
          fieldErrors[path] = 'Maximum description length is required';
        } else if (value < 100) {
          fieldErrors[path] = 'Maximum description length must be at least 100 characters';
        } else if (value > 50000) {
          fieldErrors[path] = 'Maximum description length must be at most 50,000 characters';
        } else {
          delete fieldErrors[path];
        }
        break;
      default:
        break;
    }
    
    setErrors(fieldErrors);
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.governance) {
      updatedFormData.governance = {};
    }
    
    updatedFormData.governance[name] = ['minDeposit', 'maxDepositPeriod', 'votingPeriod', 
      'quorum', 'threshold', 'vetoThreshold', 'maxTitleLength', 'maxDescriptionLength']
      .includes(name) ? Number(value) : value;
    
    setFormData(updatedFormData);
    validateField(name, updatedFormData.governance[name]);
  };
  
  // Handle slider changes
  const handleSliderChange = (name) => (event, newValue) => {
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.governance) {
      updatedFormData.governance = {};
    }
    
    updatedFormData.governance[name] = newValue;
    setFormData(updatedFormData);
    validateField(name, newValue);
  };
  
  // Toggle proposal type expansion
  const toggleTypeExpanded = (typeId) => {
    setExpandedTypes({
      ...expandedTypes,
      [typeId]: !expandedTypes[typeId]
    });
  };
  
  // Handle proposal type toggle
  const handleProposalTypeToggle = (typeId) => {
    const type = PROPOSAL_TYPES.find(t => t.id === typeId);
    if (type?.required) return; // Cannot disable required types
    
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.governance) {
      updatedFormData.governance = {};
    }
    
    if (!updatedFormData.governance.enabledProposalTypes) {
      updatedFormData.governance.enabledProposalTypes = 
        PROPOSAL_TYPES.filter(t => t.required).map(t => t.id);
    }
    
    const isEnabled = updatedFormData.governance.enabledProposalTypes.includes(typeId);
    
    if (isEnabled) {
      // Remove type from enabled list
      updatedFormData.governance.enabledProposalTypes = 
        updatedFormData.governance.enabledProposalTypes.filter(id => id !== typeId);
    } else {
      // Add type to enabled list
      updatedFormData.governance.enabledProposalTypes = 
        [...updatedFormData.governance.enabledProposalTypes, typeId];
    }
    
    setFormData(updatedFormData);
  };
  
  // Check if proposal type is enabled
  const isProposalTypeEnabled = (typeId) => {
    return formData.governance?.enabledProposalTypes?.includes(typeId) || false;
  };
  
  // Format tooltip value
  const formatPercentage = (value) => {
    return `${value}%`;
  };
  
  // Format days for tooltip
  const formatDays = (value) => {
    return `${value} days`;
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Governance Configuration
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure the governance parameters for your Cosmos blockchain network. These settings define how on-chain governance works.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Minimum Deposit"
            name="minDeposit"
            type="number"
            value={formData.governance?.minDeposit || 10000}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['governance.minDeposit']}
            helperText={errors['governance.minDeposit'] || 'Minimum deposit required for proposals to enter voting phase'}
            inputProps={{
              min: 1,
              step: 100
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {formData.tokenEconomics?.symbol || 'tokens'}
                </InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Maximum Deposit Period"
            name="maxDepositPeriod"
            type="number"
            value={formData.governance?.maxDepositPeriod || 14}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['governance.maxDepositPeriod']}
            helperText={errors['governance.maxDepositPeriod'] || 'Maximum time to collect the minimum deposit'}
            inputProps={{
              min: 1,
              max: 90,
              step: 1
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">days</InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Voting Period"
            name="votingPeriod"
            type="number"
            value={formData.governance?.votingPeriod || 14}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['governance.votingPeriod']}
            helperText={errors['governance.votingPeriod'] || 'Duration of the voting period'}
            inputProps={{
              min: 1,
              max: 90,
              step: 1
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">days</InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Maximum Title Length"
            name="maxTitleLength"
            type="number"
            value={formData.governance?.maxTitleLength || 140}
            onChange={handleChange}
            fullWidth
            error={!!errors['governance.maxTitleLength']}
            helperText={errors['governance.maxTitleLength'] || 'Maximum length of proposal titles'}
            inputProps={{
              min: 10,
              max: 500,
              step: 10
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">characters</InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Quorum: {formData.governance?.quorum || 33.4}%
          </Typography>
          <Slider
            value={formData.governance?.quorum || 33.4}
            onChange={handleSliderChange('quorum')}
            aria-label="Quorum"
            valueLabelDisplay="auto"
            step={0.1}
            marks={[
              { value: 0, label: '0%' },
              { value: 33.4, label: '33.4%' },
              { value: 50, label: '50%' },
              { value: 66.7, label: '66.7%' },
              { value: 100, label: '100%' }
            ]}
            min={0}
            max={100}
          />
          <FormHelperText error={!!errors['governance.quorum']}>
            {errors['governance.quorum'] || 'Minimum percentage of voting power that needs to vote for a proposal to be valid'}
          </FormHelperText>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Threshold: {formData.governance?.threshold || 50}%
          </Typography>
          <Slider
            value={formData.governance?.threshold || 50}
            onChange={handleSliderChange('threshold')}
            aria-label="Threshold"
            valueLabelDisplay="auto"
            step={0.1}
            marks={[
              { value: 0, label: '0%' },
              { value: 50, label: '50%' },
              { value: 66.7, label: '66.7%' },
              { value: 100, label: '100%' }
            ]}
            min={0}
            max={100}
          />
          <FormHelperText error={!!errors['governance.threshold']}>
            {errors['governance.threshold'] || 'Minimum proportion of Yes votes for a proposal to pass'}
          </FormHelperText>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Veto Threshold: {formData.governance?.vetoThreshold || 33.4}%
          </Typography>
          <Slider
            value={formData.governance?.vetoThreshold || 33.4}
            onChange={handleSliderChange('vetoThreshold')}
            aria-label="Veto Threshold"
            valueLabelDisplay="auto"
            step={0.1}
            marks={[
              { value: 0, label: '0%' },
              { value: 33.4, label: '33.4%' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' }
            ]}
            min={0}
            max={100}
          />
          <FormHelperText error={!!errors['governance.vetoThreshold']}>
            {errors['governance.vetoThreshold'] || 'Minimum proportion of NoWithVeto votes to reject a proposal and burn the deposit'}
          </FormHelperText>
        </Grid>
        
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Governance Process Timeline
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={visualizationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip 
                      formatter={(value, name, props) => [`${value} days`, props.payload.phase]}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div style={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #ccc',
                              padding: '10px',
                              borderRadius: '4px'
                            }}>
                              <p><strong>{payload[0].payload.phase}</strong></p>
                              <p>{payload[0].payload.description}</p>
                              <p>Duration: {payload[0].value} days</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Duration (days)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Proposal Types
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure which types of governance proposals are enabled on your network.
          </Typography>
          
          <Paper variant="outlined">
            <List disablePadding>
              {PROPOSAL_TYPES.map((type, index) => (
                <React.Fragment key={type.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {type.required && (
                          <Chip 
                            label="Required" 
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                        )}
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isProposalTypeEnabled(type.id)}
                              onChange={() => handleProposalTypeToggle(type.id)}
                              disabled={type.required}
                            />
                          }
                          label=""
                        />
                        {formData.advancedMode && isProposalTypeEnabled(type.id) && (
                          <IconButton
                            edge="end"
                            onClick={() => toggleTypeExpanded(type.id)}
                          >
                            {expandedTypes[type.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        )}
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      {type.icon || <GavelIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={type.name}
                      secondary={type.description}
                    />
                  </ListItem>
                  {formData.advancedMode && isProposalTypeEnabled(type.id) && (
                    <Collapse in={expandedTypes[type.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 3, backgroundColor: 'background.default' }}>
                        <Typography variant="body2" color="text.secondary">
                          Advanced configuration for this proposal type is not available in the current version.
                        </Typography>
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
          Enable Advanced Mode in Basic Information to configure additional governance parameters and custom proposal types.
        </Alert>
      )}
    </Box>
  );
};

export default GovernanceForm;