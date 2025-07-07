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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Divider,
  Alert,
  Tooltip,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const defaultValidatorConfig = {
  moniker: '',
  power: 100,
  commission: {
    rate: 5,
    maxRate: 20,
    maxChangeRate: 1
  },
  details: '',
  website: '',
  identity: ''
};

const ValidatorsForm = ({ formData, setFormData, errors, setErrors, validateForm }) => {
  const [validatorDialogOpen, setValidatorDialogOpen] = useState(false);
  const [currentValidator, setCurrentValidator] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const [validatorErrors, setValidatorErrors] = useState({});
  const [powerDistributionData, setPowerDistributionData] = useState([]);
  
  // Initialize validators if not present
  useEffect(() => {
    if (!formData.validators) {
      setFormData({
        ...formData,
        validators: {
          count: 4,
          blockTime: 5,
          unbondingTime: 21,
          maxValidators: 100,
          maxEntries: 7,
          historicalEntries: 10000,
          customValidators: []
        }
      });
    }
  }, []);
  
  // Update power distribution chart data
  useEffect(() => {
    if (formData.validators?.customValidators?.length > 0) {
      const data = formData.validators.customValidators.map((validator, index) => ({
        name: validator.moniker || `Validator ${index + 1}`,
        power: validator.power
      }));
      setPowerDistributionData(data);
    } else {
      // Generate even distribution for default validators
      const count = formData.validators?.count || 4;
      const data = Array.from({ length: count }, (_, i) => ({
        name: `Validator ${i + 1}`,
        power: 100 / count
      }));
      setPowerDistributionData(data);
    }
  }, [formData.validators]);
  
  // Validate individual field
  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    const path = `validators.${name}`;
    
    switch (name) {
      case 'count':
        if (!value) {
          fieldErrors[path] = 'Number of validators is required';
        } else if (value < 1) {
          fieldErrors[path] = 'Must have at least 1 validator';
        } else if (value > 50) {
          fieldErrors[path] = 'Maximum 50 validators allowed';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'blockTime':
        if (!value) {
          fieldErrors[path] = 'Block time is required';
        } else if (value < 1) {
          fieldErrors[path] = 'Block time must be at least 1 second';
        } else if (value > 60) {
          fieldErrors[path] = 'Block time must be at most 60 seconds';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'unbondingTime':
        if (!value) {
          fieldErrors[path] = 'Unbonding time is required';
        } else if (value < 1) {
          fieldErrors[path] = 'Unbonding time must be at least 1 day';
        } else if (value > 90) {
          fieldErrors[path] = 'Unbonding time must be at most 90 days';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'maxValidators':
        if (!value) {
          fieldErrors[path] = 'Max validators is required';
        } else if (value < (formData.validators?.count || 4)) {
          fieldErrors[path] = `Max validators must be at least ${formData.validators?.count || 4}`;
        } else if (value > 500) {
          fieldErrors[path] = 'Max validators must be at most 500';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'maxEntries':
        if (value < 1) {
          fieldErrors[path] = 'Max entries must be at least 1';
        } else if (value > 100) {
          fieldErrors[path] = 'Max entries must be at most 100';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'historicalEntries':
        if (value < 0) {
          fieldErrors[path] = 'Historical entries must be non-negative';
        } else if (value > 100000) {
          fieldErrors[path] = 'Historical entries must be at most 100,000';
        } else {
          delete fieldErrors[path];
        }
        break;
      default:
        break;
    }
    
    setErrors(fieldErrors);
  };
  
  // Validate custom validator fields
  const validateValidatorField = (field, value) => {
    const newErrors = { ...validatorErrors };
    
    switch (field) {
      case 'moniker':
        if (!value) {
          newErrors.moniker = 'Validator name is required';
        } else if (value.length < 3) {
          newErrors.moniker = 'Name must be at least 3 characters';
        } else if (value.length > 30) {
          newErrors.moniker = 'Name must be at most 30 characters';
        } else {
          delete newErrors.moniker;
        }
        break;
      case 'power':
        if (value < 1) {
          newErrors.power = 'Power must be at least 1';
        } else if (value > 1000) {
          newErrors.power = 'Power must be at most 1000';
        } else {
          delete newErrors.power;
        }
        break;
      case 'commission.rate':
        if (value < 0) {
          newErrors['commission.rate'] = 'Rate must be non-negative';
        } else if (value > (currentValidator?.commission?.maxRate || 100)) {
          newErrors['commission.rate'] = `Rate must be at most ${currentValidator?.commission?.maxRate || 100}%`;
        } else {
          delete newErrors['commission.rate'];
        }
        break;
      case 'commission.maxRate':
        if (value < (currentValidator?.commission?.rate || 0)) {
          newErrors['commission.maxRate'] = 'Max rate must be at least the commission rate';
        } else if (value > 100) {
          newErrors['commission.maxRate'] = 'Max rate must be at most 100%';
        } else {
          delete newErrors['commission.maxRate'];
        }
        break;
      case 'commission.maxChangeRate':
        if (value < 0) {
          newErrors['commission.maxChangeRate'] = 'Max change rate must be non-negative';
        } else if (value > (currentValidator?.commission?.maxRate || 100)) {
          newErrors['commission.maxChangeRate'] = 'Max change rate must be at most the max rate';
        } else {
          delete newErrors['commission.maxChangeRate'];
        }
        break;
      case 'website':
        if (value && !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(value)) {
          newErrors.website = 'Please enter a valid URL';
        } else {
          delete newErrors.website;
        }
        break;
      case 'identity':
        if (value && !/^[A-F0-9]{16}$/.test(value)) {
          newErrors.identity = 'Identity must be a 16-character hex string';
        } else {
          delete newErrors.identity;
        }
        break;
      default:
        break;
    }
    
    setValidatorErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.validators) {
      updatedFormData.validators = {};
    }
    
    updatedFormData.validators[name] = ['count', 'blockTime', 'unbondingTime', 'maxValidators', 'maxEntries', 'historicalEntries']
      .includes(name) ? Number(value) : value;
    
    setFormData(updatedFormData);
    validateField(name, updatedFormData.validators[name]);
  };
  
  // Handle custom validators toggle
  const handleCustomValidatorsToggle = (e) => {
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.validators) {
      updatedFormData.validators = {};
    }
    
    updatedFormData.validators.useCustomValidators = e.target.checked;
    
    if (e.target.checked && (!updatedFormData.validators.customValidators || updatedFormData.validators.customValidators.length === 0)) {
      // Initialize with default validators
      const count = updatedFormData.validators.count || 4;
      updatedFormData.validators.customValidators = Array.from({ length: count }, (_, i) => ({
        ...defaultValidatorConfig,
        moniker: `Validator ${i + 1}`,
        power: 100 / count
      }));
    }
    
    setFormData(updatedFormData);
  };
  
  // Open dialog to add/edit validator
  const handleAddEditValidator = (index = -1) => {
    if (index >= 0) {
      setCurrentValidator({ 
        ...formData.validators.customValidators[index] 
      });
      setEditIndex(index);
    } else {
      setCurrentValidator({ ...defaultValidatorConfig });
      setEditIndex(-1);
    }
    setValidatorErrors({});
    setValidatorDialogOpen(true);
  };
  
  // Handle validator field changes
  const handleValidatorChange = (field, value) => {
    const updatedValidator = { ...currentValidator };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!updatedValidator[parent]) {
        updatedValidator[parent] = {};
      }
      updatedValidator[parent][child] = ['rate', 'maxRate', 'maxChangeRate'].includes(child) 
        ? Number(value) 
        : value;
    } else {
      updatedValidator[field] = field === 'power' ? Number(value) : value;
    }
    
    setCurrentValidator(updatedValidator);
    validateValidatorField(field, value);
  };
  
  // Save validator
  const handleSaveValidator = () => {
    // Validate all fields
    let isValid = true;
    ['moniker', 'power', 'commission.rate', 'commission.maxRate', 'commission.maxChangeRate'].forEach(field => {
      const value = field.includes('.') 
        ? currentValidator[field.split('.')[0]][field.split('.')[1]]
        : currentValidator[field];
      
      if (!validateValidatorField(field, value)) {
        isValid = false;
      }
    });
    
    if (currentValidator.website) {
      if (!validateValidatorField('website', currentValidator.website)) {
        isValid = false;
      }
    }
    
    if (currentValidator.identity) {
      if (!validateValidatorField('identity', currentValidator.identity)) {
        isValid = false;
      }
    }
    
    if (!isValid) return;
    
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.validators.customValidators) {
      updatedFormData.validators.customValidators = [];
    }
    
    if (editIndex >= 0) {
      updatedFormData.validators.customValidators[editIndex] = currentValidator;
    } else {
      updatedFormData.validators.customValidators.push(currentValidator);
    }
    
    setFormData(updatedFormData);
    setValidatorDialogOpen(false);
  };
  
  // Delete validator
  const handleDeleteValidator = (index) => {
    const updatedFormData = { ...formData };
    updatedFormData.validators.customValidators.splice(index, 1);
    setFormData(updatedFormData);
  };
  
  // Handle slider changes
  const handleSliderChange = (name) => (event, newValue) => {
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.validators) {
      updatedFormData.validators = {};
    }
    
    updatedFormData.validators[name] = newValue;
    setFormData(updatedFormData);
    validateField(name, newValue);
  };

  // Format tooltip values for the chart
  const formatChartValue = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Validators Configuration
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure the validators for your Cosmos blockchain network. These settings define how your network reaches consensus and processes transactions.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Number of Validators"
            name="count"
            type="number"
            value={formData.validators?.count || 4}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['validators.count']}
            helperText={errors['validators.count'] || 'Initial set of validators at genesis'}
            inputProps={{
              min: 1,
              max: 50,
              step: 1
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="The number of validators that will be created at genesis. More validators improve decentralization but may reduce performance.">
                  <InputAdornment position="end">
                    <InfoOutlinedIcon color="action" fontSize="small" />
                  </InputAdornment>
                </Tooltip>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Target Block Time"
            name="blockTime"
            type="number"
            value={formData.validators?.blockTime || 5}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['validators.blockTime']}
            helperText={errors['validators.blockTime'] || 'Target time between blocks in seconds'}
            inputProps={{
              min: 1,
              max: 60,
              step: 1
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">seconds</InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Staking Parameters
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Unbonding Period: {formData.validators?.unbondingTime || 21} days
          </Typography>
          <Slider
            value={formData.validators?.unbondingTime || 21}
            onChange={handleSliderChange('unbondingTime')}
            aria-label="Unbonding Period"
            valueLabelDisplay="auto"
            step={1}
            marks={[
              { value: 7, label: '7d' },
              { value: 14, label: '14d' },
              { value: 21, label: '21d' },
              { value: 28, label: '28d' }
            ]}
            min={1}
            max={90}
          />
          <FormHelperText error={!!errors['validators.unbondingTime']}>
            {errors['validators.unbondingTime'] || 'Time required to unbond tokens (standard: 21 days)'}
          </FormHelperText>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Maximum Validators"
            name="maxValidators"
            type="number"
            value={formData.validators?.maxValidators || 100}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['validators.maxValidators']}
            helperText={errors['validators.maxValidators'] || 'Maximum number of validators allowed'}
            inputProps={{
              min: formData.validators?.count || 4,
              max: 500,
              step: 10
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="The maximum number of validators that can participate in consensus. Must be at least equal to the initial validator count.">
                  <InputAdornment position="end">
                    <InfoOutlinedIcon color="action" fontSize="small" />
                  </InputAdornment>
                </Tooltip>
              )
            }}
          />
        </Grid>
        
        {formData.advancedMode && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Max Entries"
                name="maxEntries"
                type="number"
                value={formData.validators?.maxEntries || 7}
                onChange={handleChange}
                fullWidth
                error={!!errors['validators.maxEntries']}
                helperText={errors['validators.maxEntries'] || 'Maximum unbonding/redelegation entries (default: 7)'}
                inputProps={{
                  min: 1,
                  max: 100,
                  step: 1
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Historical Entries"
                name="historicalEntries"
                type="number"
                value={formData.validators?.historicalEntries || 10000}
                onChange={handleChange}
                fullWidth
                error={!!errors['validators.historicalEntries']}
                helperText={errors['validators.historicalEntries'] || 'Number of historical entries to persist (default: 10000)'}
                inputProps={{
                  min: 0,
                  max: 100000,
                  step: 1000
                }}
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Validator Distribution
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.validators?.useCustomValidators || false}
                  onChange={handleCustomValidatorsToggle}
                  color="primary"
                />
              }
              label="Custom Validators"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {formData.validators?.useCustomValidators 
              ? 'Configure custom validators with specific settings and voting power distribution.'
              : 'By default, validators will be created with equal voting power and standard parameters.'}
          </Typography>
        </Grid>
        
        {formData.validators?.useCustomValidators ? (
          <>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddEditValidator()}
                >
                  Add Validator
                </Button>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Voting Power</TableCell>
                      <TableCell>Commission</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.validators?.customValidators?.map((validator, index) => (
                      <TableRow key={index}>
                        <TableCell>{validator.moniker}</TableCell>
                        <TableCell>
                          {validator.power}
                          <Chip 
                            size="small" 
                            label={`${(validator.power / formData.validators.customValidators.reduce((sum, v) => sum + v.power, 0) * 100).toFixed(1)}%`}
                            color="primary"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        </TableCell>
                        <TableCell>{validator.commission?.rate || 0}%</TableCell>
                        <TableCell>
                          {validator.identity && <Chip size="small" label="Has Identity" sx={{ mr: 0.5 }} />}
                          {validator.website && <Chip size="small" label="Has Website" />}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleAddEditValidator(index)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteValidator(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!formData.validators?.customValidators || formData.validators.customValidators.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No custom validators configured. Click "Add Validator" to create one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            {formData.validators?.customValidators?.length > 0 && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Voting Power Distribution
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={powerDistributionData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <RechartsTooltip formatter={formatChartValue} />
                          <Bar dataKey="power" fill="#8884d8" name="Voting Power" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </>
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              {formData.validators?.count || 4} validators will be created with equal voting power and default parameters. 
              Enable "Custom Validators" to configure specific validator settings.
            </Alert>
          </Grid>
        )}
      </Grid>
      
      {!formData.advancedMode && (
        <Alert severity="info" sx={{ mt: 4 }}>
          Enable Advanced Mode in Basic Information to configure additional validator parameters.
        </Alert>
      )}
    </Box>
  );
};

export default ValidatorsForm;