import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Network } from '../../types/network';

interface ConfigurationTabProps {
  network: Network;
}

const ConfigurationTab: React.FC<ConfigurationTabProps> = ({ network }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Network Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        View the current configuration settings for your blockchain network.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Network Name
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Chain ID
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.chainId}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.description || 'No description provided'}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Token Economics */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">Token Economics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Token Name
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.tokenEconomics.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Token Symbol
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.tokenEconomics.symbol}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Decimals
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.tokenEconomics.decimals}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Initial Supply
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.tokenEconomics.initialSupply.toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Maximum Supply
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.tokenEconomics.maxSupply 
                      ? network.tokenEconomics.maxSupply.toLocaleString()
                      : 'Unlimited'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Token Distribution
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                    <Chip 
                      label={`Validators: ${network.tokenEconomics.distribution.validators}%`} 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Community: ${network.tokenEconomics.distribution.community}%`} 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Foundation: ${network.tokenEconomics.distribution.foundation}%`} 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Airdrop: ${network.tokenEconomics.distribution.airdrop}%`} 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Validator Requirements */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">Validator Requirements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Minimum Stake
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.validatorRequirements.minStake.toLocaleString()} {network.tokenEconomics.symbol}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Maximum Validators
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.validatorRequirements.maxValidators
                      ? network.validatorRequirements.maxValidators.toLocaleString()
                      : 'Unlimited'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Unbonding Period
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.validatorRequirements.unbondingPeriod} days
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Modules */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">Modules</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {network.modules.map((module) => (
                  <Grid item xs={12} key={module.id}>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">{module.name}</Typography>
                        <Chip 
                          label={module.enabled ? 'Enabled' : 'Disabled'} 
                          color={module.enabled ? 'success' : 'default'} 
                          size="small"
                        />
                      </Box>
                      
                      {module.enabled && Object.keys(module.config).length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">Configuration:</Typography>
                          <Paper sx={{ p: 1, mt: 1, bgcolor: 'grey.100' }}>
                            <Typography variant="body2" component="pre" sx={{ 
                              fontFamily: 'monospace', 
                              whiteSpace: 'pre-wrap',
                              overflow: 'auto'
                            }}>
                              {JSON.stringify(module.config, null, 2)}
                            </Typography>
                          </Paper>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Governance Settings */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">Governance Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Voting Period
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.governanceSettings.votingPeriod} days
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Quorum
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.governanceSettings.quorum}%
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Threshold
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.governanceSettings.threshold}%
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Veto Threshold
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {network.governanceSettings.vetoThreshold}%
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConfigurationTab;