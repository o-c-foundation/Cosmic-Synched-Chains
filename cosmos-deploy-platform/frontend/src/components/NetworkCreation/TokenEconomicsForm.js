import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  InputAdornment,
  Slider,
  FormControl,
  FormHelperText,
  Alert,
  Paper,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
  Divider,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const TokenEconomicsForm = ({ formData, setFormData, errors, setErrors, validateForm }) => {
  const theme = useTheme();
  const [distributionData, setDistributionData] = useState([]);
  
  // Colors for the distribution chart
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];
  
  // Update distribution data when form values change
  useEffect(() => {
    const economics = formData.tokenEconomics || {};
    
    const data = [
      { name: 'Genesis Validators', value: economics.validatorsAllocation || 40 },
      { name: 'Community Pool', value: economics.communityPoolAllocation || 30 },
      { name: 'Strategic Reserve', value: economics.strategicReserveAllocation || 20 },
      { name: 'Airdrops', value: economics.airdropAllocation || 10 }
    ];
    
    setDistributionData(data);
  }, [formData.tokenEconomics]);
  
  // Validate individual field
  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    const path = `tokenEconomics.${name}`;
    
    switch (name) {
      case 'name':
        if (!value) {
          fieldErrors[path] = 'Token name is required';
        } else if (value.length < 3) {
          fieldErrors[path] = 'Token name must be at least 3 characters';
        } else if (value.length > 30) {
          fieldErrors[path] = 'Token name must be less than 30 characters';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'symbol':
        if (!value) {
          fieldErrors[path] = 'Token symbol is required';
        } else if (value.length < 2) {
          fieldErrors[path] = 'Token symbol must be at least 2 characters';
        } else if (value.length > 10) {
          fieldErrors[path] = 'Token symbol must be less than 10 characters';
        } else if (!/^[A-Z]+$/.test(value)) {
          fieldErrors[path] = 'Token symbol must contain only uppercase letters';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'decimals':
        if (value === undefined || value === null) {
          fieldErrors[path] = 'Decimals is required';
        } else if (value < 0) {
          fieldErrors[path] = 'Decimals must be a non-negative integer';
        } else if (value > 18) {
          fieldErrors[path] = 'Decimals must be at most 18';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'initialSupply':
        if (!value) {
          fieldErrors[path] = 'Initial supply is required';
        } else if (value <= 0) {
          fieldErrors[path] = 'Initial supply must be greater than 0';
        } else if (value > 1000000000000) {
          fieldErrors[path] = 'Initial supply must be less than or equal to 1 trillion';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'inflationRate':
        if (value === undefined || value === null) {
          fieldErrors[path] = 'Inflation rate is required';
        } else if (value < 0) {
          fieldErrors[path] = 'Inflation rate must be non-negative';
        } else if (value > 100) {
          fieldErrors[path] = 'Inflation rate must be less than or equal to 100';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'inflationRateChange':
        if (value < 0) {
          fieldErrors[path] = 'Inflation rate change must be non-negative';
        } else if (value > 10) {
          fieldErrors[path] = 'Inflation rate change must be less than or equal to 10';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'inflationMax':
        if (value < formData.tokenEconomics?.inflationRate || 0) {
          fieldErrors[path] = 'Max inflation must be greater than or equal to inflation rate';
        } else if (value > 100) {
          fieldErrors[path] = 'Max inflation must be less than or equal to 100';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'inflationMin':
        if (value < 0) {
          fieldErrors[path] = 'Min inflation must be non-negative';
        } else if (value > (formData.tokenEconomics?.inflationRate || 0)) {
          fieldErrors[path] = 'Min inflation must be less than or equal to inflation rate';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'bondedRatioGoal':
        if (value < 0) {
          fieldErrors[path] = 'Goal bonded ratio must be non-negative';
        } else if (value > 100) {
          fieldErrors[path] = 'Goal bonded ratio must be less than or equal to 100';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'blocksPerYear':
        if (!value) {
          fieldErrors[path] = 'Blocks per year is required';
        } else if (value < 0) {
          fieldErrors[path] = 'Blocks per year must be non-negative';
        } else if (value > 100000000) {
          fieldErrors[path] = 'Blocks per year is too large';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'communityTax':
        if (value < 0) {
          fieldErrors[path] = 'Community tax must be non-negative';
        } else if (value > 100) {
          fieldErrors[path] = 'Community tax must be less than or equal to 100';
        } else {
          delete fieldErrors[path];
        }
        break;
      case 'validatorsAllocation':
      case 'communityPoolAllocation':
      case 'strategicReserveAllocation':
      case 'airdropAllocation':
        // Check if total allocation is 100%
        const tokenEconomics = formData.tokenEconomics || {};
        const validatorsAllocation = tokenEconomics.validatorsAllocation || 0;
        const communityPoolAllocation = tokenEconomics.communityPoolAllocation || 0;
        const strategicReserveAllocation = tokenEconomics.strategicReserveAllocation || 0;
        const airdropAllocation = tokenEconomics.airdropAllocation || 0;
        
        const total = validatorsAllocation + communityPoolAllocation + 
                     strategicReserveAllocation + airdropAllocation;
        
        if (total !== 100) {
          fieldErrors['tokenEconomics.totalAllocation'] = 'Total allocation must equal 100%';
        } else {
          delete fieldErrors['tokenEconomics.totalAllocation'];
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
    
    if (!updatedFormData.tokenEconomics) {
      updatedFormData.tokenEconomics = {};
    }
    
    updatedFormData.tokenEconomics[name] = name === 'symbol' 
      ? value.toUpperCase() 
      : ['decimals', 'initialSupply', 'inflationRate', 'inflationRateChange', 
         'inflationMax', 'inflationMin', 'bondedRatioGoal', 'blocksPerYear', 
         'communityTax', 'validatorsAllocation', 'communityPoolAllocation',
         'strategicReserveAllocation', 'airdropAllocation'].includes(name)
        ? Number(value)
        : value;
    
    setFormData(updatedFormData);
    validateField(name, updatedFormData.tokenEconomics[name]);
  };
  
  // Handle slider changes
  const handleSliderChange = (name) => (event, newValue) => {
    const updatedFormData = { ...formData };
    
    if (!updatedFormData.tokenEconomics) {
      updatedFormData.tokenEconomics = {};
    }
    
    updatedFormData.tokenEconomics[name] = newValue;
    setFormData(updatedFormData);
    validateField(name, newValue);
  };
  
  // Format value for tooltips in the chart
  const formatChartValue = (value) => {
    return `${value}%`;
  };
  
  // Calculate total token supply based on initial supply
  const formatTokenAmount = (amount) => {
    if (!amount) return '0';
    
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(2)} Billion`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)} Million`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)} Thousand`;
    }
    
    return amount.toString();
  };
  
  // Calculate allocation amounts
  const calculateAllocationAmount = (percentage) => {
    const initialSupply = formData.tokenEconomics?.initialSupply || 0;
    return formatTokenAmount((initialSupply * percentage) / 100);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Token Economics
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure the economic parameters for your blockchain's native token. These settings define how your token will function within the network's economy.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Token Name"
            name="name"
            value={formData.tokenEconomics?.name || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['tokenEconomics.name']}
            helperText={errors['tokenEconomics.name'] || 'Full name of your token (e.g., "Cosmos Hub")'}
            InputProps={{
              endAdornment: (
                <Tooltip title="The full name of your token that will be displayed in wallets and explorers">
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
            label="Token Symbol"
            name="symbol"
            value={formData.tokenEconomics?.symbol || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['tokenEconomics.symbol']}
            helperText={errors['tokenEconomics.symbol'] || 'Short symbol for your token (e.g., "ATOM")'}
            inputProps={{
              style: { textTransform: 'uppercase' },
              maxLength: 10
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="The ticker symbol for your token (uppercase letters only)">
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
            label="Decimals"
            name="decimals"
            type="number"
            value={formData.tokenEconomics?.decimals || 6}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['tokenEconomics.decimals']}
            helperText={errors['tokenEconomics.decimals'] || 'Number of decimal places (default: 6)'}
            inputProps={{
              min: 0,
              max: 18,
              step: 1
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="Number of decimal places your token can be divided into. Most Cosmos chains use 6">
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
            label="Initial Supply"
            name="initialSupply"
            type="number"
            value={formData.tokenEconomics?.initialSupply || 100000000}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['tokenEconomics.initialSupply']}
            helperText={errors['tokenEconomics.initialSupply'] || 'Total token supply at genesis'}
            inputProps={{
              min: 1,
              step: 1000000
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="The total number of tokens that will exist at network genesis">
                  <InputAdornment position="end">
                    <InfoOutlinedIcon color="action" fontSize="small" />
                  </InputAdornment>
                </Tooltip>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Initial Token Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Define how the initial token supply will be distributed at genesis. Total allocation must equal 100%.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Distribution Overview
              </Typography>
              
              <Box sx={{ height: 200, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={formatChartValue} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Allocation</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Genesis Validators</TableCell>
                  <TableCell align="right">{formData.tokenEconomics?.validatorsAllocation || 40}%</TableCell>
                  <TableCell align="right">{calculateAllocationAmount(formData.tokenEconomics?.validatorsAllocation || 40)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Community Pool</TableCell>
                  <TableCell align="right">{formData.tokenEconomics?.communityPoolAllocation || 30}%</TableCell>
                  <TableCell align="right">{calculateAllocationAmount(formData.tokenEconomics?.communityPoolAllocation || 30)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Strategic Reserve</TableCell>
                  <TableCell align="right">{formData.tokenEconomics?.strategicReserveAllocation || 20}%</TableCell>
                  <TableCell align="right">{calculateAllocationAmount(formData.tokenEconomics?.strategicReserveAllocation || 20)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Airdrops</TableCell>
                  <TableCell align="right">{formData.tokenEconomics?.airdropAllocation || 10}%</TableCell>
                  <TableCell align="right">{calculateAllocationAmount(formData.tokenEconomics?.airdropAllocation || 10)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {((formData.tokenEconomics?.validatorsAllocation || 40) +
                      (formData.tokenEconomics?.communityPoolAllocation || 30) +
                      (formData.tokenEconomics?.strategicReserveAllocation || 20) +
                      (formData.tokenEconomics?.airdropAllocation || 10))}%
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatTokenAmount(formData.tokenEconomics?.initialSupply || 100000000)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          {errors['tokenEconomics.totalAllocation'] && (
            <FormHelperText error>
              {errors['tokenEconomics.totalAllocation']}
            </FormHelperText>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Genesis Validators ({formData.tokenEconomics?.validatorsAllocation || 40}%)
          </Typography>
          <Slider
            value={formData.tokenEconomics?.validatorsAllocation || 40}
            onChange={handleSliderChange('validatorsAllocation')}
            aria-label="Validators Allocation"
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={100}
          />
          <FormHelperText>
            Allocation for initial validator set
          </FormHelperText>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Community Pool ({formData.tokenEconomics?.communityPoolAllocation || 30}%)
          </Typography>
          <Slider
            value={formData.tokenEconomics?.communityPoolAllocation || 30}
            onChange={handleSliderChange('communityPoolAllocation')}
            aria-label="Community Pool Allocation"
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={100}
          />
          <FormHelperText>
            Allocation for community-governed funding
          </FormHelperText>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Strategic Reserve ({formData.tokenEconomics?.strategicReserveAllocation || 20}%)
          </Typography>
          <Slider
            value={formData.tokenEconomics?.strategicReserveAllocation || 20}
            onChange={handleSliderChange('strategicReserveAllocation')}
            aria-label="Strategic Reserve Allocation"
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={100}
          />
          <FormHelperText>
            Allocation for future development and partnerships
          </FormHelperText>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Airdrops ({formData.tokenEconomics?.airdropAllocation || 10}%)
          </Typography>
          <Slider
            value={formData.tokenEconomics?.airdropAllocation || 10}
            onChange={handleSliderChange('airdropAllocation')}
            aria-label="Airdrops Allocation"
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={100}
          />
          <FormHelperText>
            Allocation for community airdrops
          </FormHelperText>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Inflation Parameters
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure how new tokens will be minted over time through inflation.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Annual Inflation Rate (%)"
            name="inflationRate"
            type="number"
            value={formData.tokenEconomics?.inflationRate ?? 7}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['tokenEconomics.inflationRate']}
            helperText={errors['tokenEconomics.inflationRate'] || 'Initial annual inflation rate (%)'}
            inputProps={{
              min: 0,
              max: 100,
              step: 0.1
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">%</InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Blocks Per Year"
            name="blocksPerYear"
            type="number"
            value={formData.tokenEconomics?.blocksPerYear || 6311520}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors['tokenEconomics.blocksPerYear']}
            helperText={errors['tokenEconomics.blocksPerYear'] || 'Estimated blocks produced per year (default: ~5s blocks)'}
            inputProps={{
              min: 1,
              step: 100000
            }}
          />
        </Grid>
        
        {formData.advancedMode && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Annual Inflation Change Rate (%)"
                name="inflationRateChange"
                type="number"
                value={formData.tokenEconomics?.inflationRateChange ?? 0.13}
                onChange={handleChange}
                fullWidth
                error={!!errors['tokenEconomics.inflationRateChange']}
                helperText={errors['tokenEconomics.inflationRateChange'] || 'Rate at which inflation changes when bonded ratio diverges from goal'}
                inputProps={{
                  min: 0,
                  max: 10,
                  step: 0.01
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Goal Bonded Ratio (%)"
                name="bondedRatioGoal"
                type="number"
                value={formData.tokenEconomics?.bondedRatioGoal ?? 67}
                onChange={handleChange}
                fullWidth
                error={!!errors['tokenEconomics.bondedRatioGoal']}
                helperText={errors['tokenEconomics.bondedRatioGoal'] || 'Target percentage of tokens bonded by validators'}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 1
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Maximum Inflation (%)"
                name="inflationMax"
                type="number"
                value={formData.tokenEconomics?.inflationMax ?? 20}
                onChange={handleChange}
                fullWidth
                error={!!errors['tokenEconomics.inflationMax']}
                helperText={errors['tokenEconomics.inflationMax'] || 'Maximum allowed inflation rate'}
                inputProps={{
                  min: (formData.tokenEconomics?.inflationRate || 0),
                  max: 100,
                  step: 0.1
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Minimum Inflation (%)"
                name="inflationMin"
                type="number"
                value={formData.tokenEconomics?.inflationMin ?? 2}
                onChange={handleChange}
                fullWidth
                error={!!errors['tokenEconomics.inflationMin']}
                helperText={errors['tokenEconomics.inflationMin'] || 'Minimum allowed inflation rate'}
                inputProps={{
                  min: 0,
                  max: (formData.tokenEconomics?.inflationRate || 100),
                  step: 0.1
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Community Tax (%)"
                name="communityTax"
                type="number"
                value={formData.tokenEconomics?.communityTax ?? 2}
                onChange={handleChange}
                fullWidth
                error={!!errors['tokenEconomics.communityTax']}
                helperText={errors['tokenEconomics.communityTax'] || 'Percentage of rewards allocated to community pool'}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 0.1
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  )
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      
      {!formData.advancedMode && (
        <Alert severity="info" sx={{ mt: 4 }}>
          Enable Advanced Mode in Basic Information to configure additional token economics parameters such as inflation bounds, community tax, and bonded ratio goals.
        </Alert>
      )}
    </Box>
  );
};

export default TokenEconomicsForm;