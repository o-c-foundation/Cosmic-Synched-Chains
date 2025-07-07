import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const ReviewForm = ({ formData, setActiveStep, onSubmit, isSubmitting, errors, validateForm }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deploymentSteps, setDeploymentSteps] = useState([
    { label: 'Validating configuration', status: 'pending' },
    { label: 'Creating infrastructure', status: 'pending' },
    { label: 'Configuring nodes', status: 'pending' },
    { label: 'Setting up validators', status: 'pending' },
    { label: 'Initializing blockchain', status: 'pending' }
  ]);
  const [currentDeploymentStep, setCurrentDeploymentStep] = useState(0);
  
  // Check if we have any validation errors
  const hasErrors = Object.keys(errors).length > 0;
  
  // Distribution colors for the chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Format token amounts
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
  
  // Handle going back to specific step
  const handleEditSection = (step) => {
    setActiveStep(step);
  };
  
  // Open confirmation dialog
  const handleDeployClick = () => {
    const isValid = validateForm();
    if (isValid) {
      setConfirmDialogOpen(true);
    }
  };
  
  // Submit the form
  const handleConfirmDeploy = () => {
    setConfirmDialogOpen(false);
    onSubmit();
  };
  
  // Calculate allocation amounts
  const calculateAllocationAmount = (percentage) => {
    const initialSupply = formData.tokenEconomics?.initialSupply || 0;
    return (initialSupply * percentage) / 100;
  };
  
  // Prepare token distribution data for chart
  const distributionData = [
    { name: 'Genesis Validators', value: formData.tokenEconomics?.validatorsAllocation || 40 },
    { name: 'Community Pool', value: formData.tokenEconomics?.communityPoolAllocation || 30 },
    { name: 'Strategic Reserve', value: formData.tokenEconomics?.strategicReserveAllocation || 20 },
    { name: 'Airdrops', value: formData.tokenEconomics?.airdropAllocation || 10 }
  ];
  
  // Format chart tooltip
  const formatChartValue = (value) => {
    return `${value}%`;
  };
  
  // Get estimated monthly cost
  const getEstimatedCost = () => {
    const provider = formData.provider || 'aws';
    const nodeType = formData.nodeType;
    const validatorCount = formData.validators?.count || 4;
    
    // Very rough cost estimation
    let nodeCost = 0;
    
    switch (provider) {
      case 'aws':
        if (nodeType?.includes('t3.small')) nodeCost = 20;
        else if (nodeType?.includes('t3.medium')) nodeCost = 40;
        else if (nodeType?.includes('t3.large')) nodeCost = 80;
        else if (nodeType?.includes('m5.large')) nodeCost = 90;
        else if (nodeType?.includes('m5.xlarge')) nodeCost = 180;
        else if (nodeType?.includes('m5.2xlarge')) nodeCost = 360;
        else nodeCost = 50; // default
        break;
      case 'gcp':
        if (nodeType?.includes('e2-standard-2')) nodeCost = 70;
        else if (nodeType?.includes('e2-standard-4')) nodeCost = 140;
        else if (nodeType?.includes('e2-standard-8')) nodeCost = 280;
        else nodeCost = 90; // default
        break;
      case 'azure':
        if (nodeType?.includes('Standard_B2s')) nodeCost = 30;
        else if (nodeType?.includes('Standard_B2ms')) nodeCost = 60;
        else if (nodeType?.includes('Standard_B4ms')) nodeCost = 120;
        else nodeCost = 70; // default
        break;
      case 'digital_ocean':
        if (nodeType?.includes('s-2vcpu-2gb')) nodeCost = 15;
        else if (nodeType?.includes('s-2vcpu-4gb')) nodeCost = 25;
        else if (nodeType?.includes('s-4vcpu-8gb')) nodeCost = 50;
        else nodeCost = 30; // default
        break;
      default:
        nodeCost = 50;
    }
    
    // Add storage costs
    const diskSize = formData.diskSize || 100;
    const storageCost = (diskSize / 100) * 10; // $10 per 100GB
    
    // Add monitoring costs
    const monitoringCost = 20;
    
    // Calculate total monthly cost
    return (nodeCost + storageCost) * validatorCount + monitoringCost;
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Network Configuration
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Review your network configuration before deployment. You can go back to any section to make changes if needed.
      </Typography>
      
      {hasErrors && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => validateForm(true)}>
              Show All Errors
            </Button>
          }
        >
          There are validation errors that need to be fixed before deployment.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Basic Information Section */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="basic-info-content"
              id="basic-info-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Basic Information
              </Typography>
              {errors.name || errors.provider || errors.region || errors.nodeType || errors.diskSize ? (
                <Chip 
                  label="Has Errors" 
                  color="error" 
                  size="small" 
                  icon={<WarningAmberIcon />}
                  sx={{ ml: 2 }}
                />
              ) : (
                <Chip 
                  label="Complete" 
                  color="success" 
                  size="small" 
                  icon={<CheckCircleOutlineIcon />}
                  sx={{ ml: 2 }}
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Network Name"
                          secondary={formData.name || 'Not specified'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ color: formData.name ? 'text.secondary' : 'error' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Description"
                          secondary={formData.description || 'No description provided'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Advanced Mode"
                          secondary={formData.advancedMode ? 'Enabled' : 'Disabled'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Cloud Provider"
                          secondary={formData.provider ? formData.provider.toUpperCase() : 'Not specified'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ color: formData.provider ? 'text.secondary' : 'error' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Region"
                          secondary={formData.region || 'Not specified'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ color: formData.region ? 'text.secondary' : 'error' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Node Type"
                          secondary={formData.nodeType || 'Not specified'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ color: formData.nodeType ? 'text.secondary' : 'error' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Disk Size"
                          secondary={formData.diskSize ? `${formData.diskSize} GB` : 'Not specified'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ color: formData.diskSize ? 'text.secondary' : 'error' }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleEditSection(0)}
                    >
                      Edit Basic Info
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Token Economics Section */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="token-economics-content"
              id="token-economics-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Token Economics
              </Typography>
              {Object.keys(errors).some(key => key.startsWith('tokenEconomics.')) ? (
                <Chip 
                  label="Has Errors" 
                  color="error" 
                  size="small" 
                  icon={<WarningAmberIcon />}
                  sx={{ ml: 2 }}
                />
              ) : (
                <Chip 
                  label="Complete" 
                  color="success" 
                  size="small" 
                  icon={<CheckCircleOutlineIcon />}
                  sx={{ ml: 2 }}
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Token Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Token Name"
                          secondary={formData.tokenEconomics?.name || 'Not specified'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ 
                            color: formData.tokenEconomics?.name ? 'text.secondary' : 'error' 
                          }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Token Symbol"
                          secondary={formData.tokenEconomics?.symbol || 'Not specified'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ 
                            color: formData.tokenEconomics?.symbol ? 'text.secondary' : 'error' 
                          }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Decimals"
                          secondary={formData.tokenEconomics?.decimals ?? 6}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Initial Supply"
                          secondary={formatTokenAmount(formData.tokenEconomics?.initialSupply || 0)}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ 
                            color: formData.tokenEconomics?.initialSupply ? 'text.secondary' : 'error' 
                          }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Token Distribution
                    </Typography>
                    
                    <Box sx={{ height: 200 }}>
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
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
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
                          <TableCell align="right">
                            {formatTokenAmount(calculateAllocationAmount(formData.tokenEconomics?.validatorsAllocation || 40))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Community Pool</TableCell>
                          <TableCell align="right">{formData.tokenEconomics?.communityPoolAllocation || 30}%</TableCell>
                          <TableCell align="right">
                            {formatTokenAmount(calculateAllocationAmount(formData.tokenEconomics?.communityPoolAllocation || 30))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Strategic Reserve</TableCell>
                          <TableCell align="right">{formData.tokenEconomics?.strategicReserveAllocation || 20}%</TableCell>
                          <TableCell align="right">
                            {formatTokenAmount(calculateAllocationAmount(formData.tokenEconomics?.strategicReserveAllocation || 20))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Airdrops</TableCell>
                          <TableCell align="right">{formData.tokenEconomics?.airdropAllocation || 10}%</TableCell>
                          <TableCell align="right">
                            {formatTokenAmount(calculateAllocationAmount(formData.tokenEconomics?.airdropAllocation || 10))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Inflation Parameters
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Annual Inflation Rate"
                          secondary={`${formData.tokenEconomics?.inflationRate ?? 7}%`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Blocks Per Year"
                          secondary={formData.tokenEconomics?.blocksPerYear?.toLocaleString() || '6,311,520'}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      {formData.advancedMode && (
                        <>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText 
                              primary="Inflation Bounds"
                              secondary={`Min: ${formData.tokenEconomics?.inflationMin ?? 2}%, Max: ${formData.tokenEconomics?.inflationMax ?? 20}%`}
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText 
                              primary="Community Tax"
                              secondary={`${formData.tokenEconomics?.communityTax ?? 2}%`}
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                          </ListItem>
                        </>
                      )}
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Estimated First Year Inflation
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                      <Typography variant="h5" align="center" gutterBottom>
                        {formatTokenAmount(
                          Math.round((formData.tokenEconomics?.initialSupply || 100000000) * 
                          (formData.tokenEconomics?.inflationRate ?? 7) / 100)
                        )}
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary">
                        new tokens in first year
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleEditSection(1)}
                    >
                      Edit Token Economics
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Validators Section */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="validators-content"
              id="validators-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Validators Configuration
              </Typography>
              {Object.keys(errors).some(key => key.startsWith('validators.')) ? (
                <Chip 
                  label="Has Errors" 
                  color="error" 
                  size="small" 
                  icon={<WarningAmberIcon />}
                  sx={{ ml: 2 }}
                />
              ) : (
                <Chip 
                  label="Complete" 
                  color="success" 
                  size="small" 
                  icon={<CheckCircleOutlineIcon />}
                  sx={{ ml: 2 }}
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Validator Settings
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Number of Validators"
                          secondary={formData.validators?.count || 4}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Block Time Target"
                          secondary={`${formData.validators?.blockTime || 5} seconds`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Max Validators"
                          secondary={formData.validators?.maxValidators || 100}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Staking Parameters
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Unbonding Period"
                          secondary={`${formData.validators?.unbondingTime || 21} days`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Max Entries"
                          secondary={formData.validators?.maxEntries || 7}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Historical Entries"
                          secondary={formData.validators?.historicalEntries || 10000}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleEditSection(2)}
                    >
                      Edit Validators Config
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Modules & Governance Section */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="modules-governance-content"
              id="modules-governance-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Modules & Governance
              </Typography>
              {Object.keys(errors).some(key => key.startsWith('modules.') || key.startsWith('governance.')) ? (
                <Chip 
                  label="Has Errors" 
                  color="error" 
                  size="small" 
                  icon={<WarningAmberIcon />}
                  sx={{ ml: 2 }}
                />
              ) : (
                <Chip 
                  label="Complete" 
                  color="success" 
                  size="small" 
                  icon={<CheckCircleOutlineIcon />}
                  sx={{ ml: 2 }}
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Enabled Modules
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                      {(formData.modules?.enabled || [
                        'bank', 'staking', 'distribution', 'gov', 'slashing', 'ibc'
                      ]).map(module => (
                        <Chip 
                          key={module} 
                          label={module} 
                          color="primary" 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Governance Parameters
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Minimum Deposit"
                          secondary={`${formData.governance?.minDeposit || 10000} ${formData.tokenEconomics?.symbol || 'tokens'}`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Voting Period"
                          secondary={`${formData.governance?.votingPeriod || 14} days`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Quorum"
                          secondary={`${formData.governance?.quorum || 33.4}%`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Threshold"
                          secondary={`${formData.governance?.threshold || 50}%`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleEditSection(3)}
                      sx={{ mr: 1 }}
                    >
                      Edit Modules
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleEditSection(4)}
                    >
                      Edit Governance
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Cost Estimate */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Estimated Monthly Cost
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    This is an estimate based on your current configuration. Actual costs may vary depending on usage, data transfer, and additional services.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      ${getEstimatedCost().toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      per month
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          onClick={() => setActiveStep(4)}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleDeployClick}
          disabled={isSubmitting || hasErrors}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Deploying...
            </>
          ) : (
            'Deploy Network'
          )}
        </Button>
      </Box>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Network Deployment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to deploy a new Cosmos blockchain network with the name 
            <strong> {formData.name}</strong> on <strong>{formData.provider?.toUpperCase()}</strong>.
            This will provision infrastructure and deploy a fully functional blockchain network.
            <br /><br />
            Estimated monthly cost: <strong>${getEstimatedCost().toFixed(2)}</strong>
            <br /><br />
            Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDeploy} 
            color="primary" 
            variant="contained"
            autoFocus
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Deploying...
              </>
            ) : (
              'Deploy Network'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Deployment Progress Dialog */}
      <Dialog
        open={isSubmitting}
        aria-labelledby="deployment-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="deployment-dialog-title">
          Deploying {formData.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Your Cosmos blockchain network is being deployed. This process may take several minutes.
          </DialogContentText>
          
          <Stepper activeStep={currentDeploymentStep} orientation="vertical" sx={{ mt: 3 }}>
            {deploymentSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  {step.label}
                  {index === currentDeploymentStep && (
                    <CircularProgress size={16} sx={{ ml: 1 }} />
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ReviewForm;