import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  InputAdornment,
  MenuItem,
  FormControl,
  FormHelperText,
  Alert,
  Chip,
  Paper,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
  Button
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const cloudProviders = [
  { value: 'aws', label: 'Amazon Web Services (AWS)' },
  { value: 'gcp', label: 'Google Cloud Platform (GCP)' },
  { value: 'azure', label: 'Microsoft Azure' },
  { value: 'digital_ocean', label: 'Digital Ocean' },
  { value: 'custom', label: 'Custom (Self-Hosted)' }
];

const regions = {
  aws: [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-east-2', label: 'US East (Ohio)' },
    { value: 'us-west-1', label: 'US West (N. California)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'EU (Ireland)' },
    { value: 'eu-central-1', label: 'EU (Frankfurt)' },
    { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' }
  ],
  gcp: [
    { value: 'us-central1', label: 'Iowa (us-central1)' },
    { value: 'us-east1', label: 'South Carolina (us-east1)' },
    { value: 'us-east4', label: 'Northern Virginia (us-east4)' },
    { value: 'us-west1', label: 'Oregon (us-west1)' },
    { value: 'europe-west1', label: 'Belgium (europe-west1)' },
    { value: 'europe-west3', label: 'Frankfurt (europe-west3)' },
    { value: 'asia-east1', label: 'Taiwan (asia-east1)' },
    { value: 'asia-southeast1', label: 'Singapore (asia-southeast1)' }
  ],
  azure: [
    { value: 'eastus', label: 'East US (Virginia)' },
    { value: 'eastus2', label: 'East US 2 (Virginia)' },
    { value: 'westus', label: 'West US (California)' },
    { value: 'westus2', label: 'West US 2 (Washington)' },
    { value: 'northeurope', label: 'North Europe (Ireland)' },
    { value: 'westeurope', label: 'West Europe (Netherlands)' },
    { value: 'eastasia', label: 'East Asia (Hong Kong)' },
    { value: 'southeastasia', label: 'Southeast Asia (Singapore)' }
  ],
  digital_ocean: [
    { value: 'nyc1', label: 'New York 1' },
    { value: 'nyc3', label: 'New York 3' },
    { value: 'sfo2', label: 'San Francisco 2' },
    { value: 'sfo3', label: 'San Francisco 3' },
    { value: 'ams3', label: 'Amsterdam 3' },
    { value: 'lon1', label: 'London 1' },
    { value: 'sgp1', label: 'Singapore 1' },
    { value: 'fra1', label: 'Frankfurt 1' }
  ],
  custom: [
    { value: 'custom', label: 'Custom Environment' }
  ]
};

const nodeTypes = {
  aws: [
    { value: 't3.small', label: 't3.small (2 vCPU, 2 GiB RAM)' },
    { value: 't3.medium', label: 't3.medium (2 vCPU, 4 GiB RAM)' },
    { value: 't3.large', label: 't3.large (2 vCPU, 8 GiB RAM)' },
    { value: 'm5.large', label: 'm5.large (2 vCPU, 8 GiB RAM)' },
    { value: 'm5.xlarge', label: 'm5.xlarge (4 vCPU, 16 GiB RAM)' },
    { value: 'm5.2xlarge', label: 'm5.2xlarge (8 vCPU, 32 GiB RAM)' }
  ],
  gcp: [
    { value: 'e2-standard-2', label: 'e2-standard-2 (2 vCPU, 8 GiB RAM)' },
    { value: 'e2-standard-4', label: 'e2-standard-4 (4 vCPU, 16 GiB RAM)' },
    { value: 'e2-standard-8', label: 'e2-standard-8 (8 vCPU, 32 GiB RAM)' },
    { value: 'n2-standard-2', label: 'n2-standard-2 (2 vCPU, 8 GiB RAM)' },
    { value: 'n2-standard-4', label: 'n2-standard-4 (4 vCPU, 16 GiB RAM)' },
    { value: 'n2-standard-8', label: 'n2-standard-8 (8 vCPU, 32 GiB RAM)' }
  ],
  azure: [
    { value: 'Standard_B2s', label: 'Standard_B2s (2 vCPU, 4 GiB RAM)' },
    { value: 'Standard_B2ms', label: 'Standard_B2ms (2 vCPU, 8 GiB RAM)' },
    { value: 'Standard_B4ms', label: 'Standard_B4ms (4 vCPU, 16 GiB RAM)' },
    { value: 'Standard_D2s_v3', label: 'Standard_D2s_v3 (2 vCPU, 8 GiB RAM)' },
    { value: 'Standard_D4s_v3', label: 'Standard_D4s_v3 (4 vCPU, 16 GiB RAM)' },
    { value: 'Standard_D8s_v3', label: 'Standard_D8s_v3 (8 vCPU, 32 GiB RAM)' }
  ],
  digital_ocean: [
    { value: 's-2vcpu-2gb', label: 'Basic (2 vCPU, 2 GB RAM)' },
    { value: 's-2vcpu-4gb', label: 'Standard (2 vCPU, 4 GB RAM)' },
    { value: 's-4vcpu-8gb', label: 'Premium (4 vCPU, 8 GB RAM)' },
    { value: 'c-4', label: 'CPU-Optimized (4 vCPU, 8 GB RAM)' },
    { value: 'g-2vcpu-8gb', label: 'General Purpose (2 vCPU, 8 GB RAM)' },
    { value: 'm-2vcpu-16gb', label: 'Memory-Optimized (2 vCPU, 16 GB RAM)' }
  ],
  custom: [
    { value: 'custom-small', label: 'Small (2 CPU, 4 GB RAM)' },
    { value: 'custom-medium', label: 'Medium (4 CPU, 8 GB RAM)' },
    { value: 'custom-large', label: 'Large (8 CPU, 16 GB RAM)' },
    { value: 'custom-xlarge', label: 'X-Large (16 CPU, 32 GB RAM)' }
  ]
};

const diskSizes = [
  { value: 100, label: '100 GB' },
  { value: 200, label: '200 GB' },
  { value: 500, label: '500 GB' },
  { value: 1000, label: '1 TB' },
  { value: 2000, label: '2 TB' }
];

const BasicInfoForm = ({ formData, setFormData, errors, setErrors, validateForm, onNext, onBack }) => {
  const [availableRegions, setAvailableRegions] = useState([]);
  const [availableNodeTypes, setAvailableNodeTypes] = useState([]);
  
  // Update available regions when cloud provider changes
  useEffect(() => {
    if (formData.provider) {
      setAvailableRegions(regions[formData.provider] || []);
      setAvailableNodeTypes(nodeTypes[formData.provider] || []);
      
      // If current region is not available in the new provider, reset it
      if (formData.region && !regions[formData.provider]?.some(r => r.value === formData.region)) {
        setFormData({
          ...formData,
          region: ''
        });
      }
      
      // If current node type is not available in the new provider, reset it
      if (formData.nodeType && !nodeTypes[formData.provider]?.some(n => n.value === formData.nodeType)) {
        setFormData({
          ...formData,
          nodeType: ''
        });
      }
    }
  }, [formData.provider, setFormData]);
  
  // Validate individual field
  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value) {
          fieldErrors.name = 'Network name is required';
        } else if (value.length < 3) {
          fieldErrors.name = 'Network name must be at least 3 characters';
        } else if (value.length > 30) {
          fieldErrors.name = 'Network name must be less than 30 characters';
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          fieldErrors.name = 'Network name can only contain lowercase letters, numbers, and hyphens';
        } else {
          delete fieldErrors.name;
        }
        break;
      case 'provider':
        if (!value) {
          fieldErrors.provider = 'Cloud provider is required';
        } else {
          delete fieldErrors.provider;
        }
        break;
      case 'region':
        if (!value) {
          fieldErrors.region = 'Region is required';
        } else {
          delete fieldErrors.region;
        }
        break;
      case 'nodeType':
        if (!value) {
          fieldErrors.nodeType = 'Node type is required';
        } else {
          delete fieldErrors.nodeType;
        }
        break;
      case 'diskSize':
        if (!value) {
          fieldErrors.diskSize = 'Disk size is required';
        } else {
          delete fieldErrors.diskSize;
        }
        break;
      case 'description':
        if (value && value.length > 500) {
          fieldErrors.description = 'Description must be less than 500 characters';
        } else {
          delete fieldErrors.description;
        }
        break;
      default:
        break;
    }
    
    setErrors(fieldErrors);
  };
  
  // Check if form is valid before proceeding
  const isFormValid = () => {
    const requiredFields = ['name', 'provider', 'region', 'nodeType', 'diskSize'];
    const hasRequiredFields = requiredFields.every(field => formData[field]);
    
    // Check for errors
    const hasErrors = Object.keys(errors).length > 0;
    
    return hasRequiredFields && !hasErrors;
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    validateField(name, value);
  };
  
  // Handle toggle for advanced mode
  const handleAdvancedModeToggle = (e) => {
    setFormData({
      ...formData,
      advancedMode: e.target.checked
    });
  };
  
  // Handle continuing to next step
  const handleNext = () => {
    // Validate all required fields
    const requiredFields = ['name', 'provider', 'region', 'nodeType', 'diskSize'];
    let newErrors = { ...errors };
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    setErrors(newErrors);
    
    if (isFormValid()) {
      onNext();
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Provide the basic details for your Cosmos blockchain network. These settings define your network's identity and infrastructure configuration.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TextField
            label="Network Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name || 'This will be used as your chain-id (e.g., "my-cosmos-chain")'}
            inputProps={{
              pattern: '[a-z0-9-]+',
              maxLength: 30
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="Network name must be lowercase alphanumeric with hyphens. It will be used as your chain ID and cannot be changed later.">
                  <InputAdornment position="end">
                    <InfoOutlinedIcon color="action" fontSize="small" />
                  </InputAdornment>
                </Tooltip>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.advancedMode || false}
                onChange={handleAdvancedModeToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Advanced Mode</Typography>
                <Tooltip title="Enable advanced configuration options for experienced users">
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description || 'Brief description of your network (optional)'}
            inputProps={{
              maxLength: 500
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color="text.secondary">
                    {`${formData.description?.length || 0}/500`}
                  </Typography>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Infrastructure Configuration
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Cloud Provider"
            name="provider"
            value={formData.provider || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.provider}
            helperText={errors.provider || 'Select the cloud provider for your network'}
          >
            {cloudProviders.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Region"
            name="region"
            value={formData.region || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.region}
            helperText={errors.region || 'Select the region to deploy your network'}
            disabled={!formData.provider}
          >
            {availableRegions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Node Type"
            name="nodeType"
            value={formData.nodeType || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.nodeType}
            helperText={errors.nodeType || 'Select the compute resources for your validators'}
            disabled={!formData.provider}
          >
            {availableNodeTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Disk Size"
            name="diskSize"
            value={formData.diskSize || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.diskSize}
            helperText={errors.diskSize || 'Select the disk size for your validators'}
          >
            {diskSizes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        {formData.advancedMode && (
          <>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                Advanced mode enabled. Additional configuration options will be available in subsequent steps.
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Advanced Features Available:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Custom Genesis Parameters" size="small" color="primary" variant="outlined" />
                  <Chip label="Advanced Token Economics" size="small" color="primary" variant="outlined" />
                  <Chip label="Custom Module Configuration" size="small" color="primary" variant="outlined" />
                  <Chip label="Advanced Validator Setup" size="small" color="primary" variant="outlined" />
                  <Chip label="Custom Governance Parameters" size="small" color="primary" variant="outlined" />
                </Box>
              </Paper>
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleNext}
            >
              Continue
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfoForm;