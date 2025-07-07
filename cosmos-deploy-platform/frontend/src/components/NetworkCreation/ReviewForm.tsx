import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { NetworkConfig } from '../../types/network';

interface ReviewFormProps {
  config: NetworkConfig;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ config }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Network Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Review your blockchain configuration before creation. You can go back to previous steps to make changes.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Network Name
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.name || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Chain ID
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.chainId || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.description 
                    ? (config.description.length > 100 
                        ? `${config.description.substring(0, 100)}...` 
                        : config.description)
                    : 'No description provided'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Token Economics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Token Economics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Token Name
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.tokenEconomics.name || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Token Symbol
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.tokenEconomics.symbol || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Decimals
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.tokenEconomics.decimals}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Initial Supply
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.tokenEconomics.initialSupply.toLocaleString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Maximum Supply
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.tokenEconomics.maxSupply 
                    ? config.tokenEconomics.maxSupply.toLocaleString()
                    : 'Unlimited'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Token Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  <Chip 
                    label={`Validators: ${config.tokenEconomics.distribution.validators}%`} 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`Community: ${config.tokenEconomics.distribution.community}%`} 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`Foundation: ${config.tokenEconomics.distribution.foundation}%`} 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`Airdrop: ${config.tokenEconomics.distribution.airdrop}%`} 
                    color="primary" 
                    variant="outlined" 
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Validator Requirements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Validator Requirements
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Minimum Stake
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.validatorRequirements.minStake.toLocaleString()} {config.tokenEconomics.symbol}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Maximum Validators
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.validatorRequirements.maxValidators
                    ? config.validatorRequirements.maxValidators.toLocaleString()
                    : 'Unlimited'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Unbonding Period
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.validatorRequirements.unbondingPeriod} days
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Modules */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Modules
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {config.modules.map((module) => (
                <Grid item xs={6} sm={4} md={3} key={module.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {module.enabled ? (
                      <CheckCircleOutlineIcon color="success" fontSize="small" />
                    ) : (
                      <CancelOutlinedIcon color="error" fontSize="small" />
                    )}
                    <Typography variant="body1">
                      {module.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        {/* Governance Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Governance Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Voting Period
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.governanceSettings.votingPeriod} days
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Quorum
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.governanceSettings.quorum}%
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Threshold
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.governanceSettings.threshold}%
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Veto Threshold
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {config.governanceSettings.vetoThreshold}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewForm;