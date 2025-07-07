import React from 'react';
import { Box, TextField, Typography, Slider, InputAdornment, Grid, FormControlLabel, Switch, Tooltip, Paper } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { NetworkConfig } from '../../types/network';

interface ValidatorsFormProps {
  config: NetworkConfig;
  updateConfig: (updates: Partial<NetworkConfig>) => void;
}

const ValidatorsForm: React.FC<ValidatorsFormProps> = ({ config, updateConfig }) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'validatorRequirements') {
        updateConfig({
          validatorRequirements: {
            ...config.validatorRequirements,
            [child]: value === '' ? 0 : Number(value),
          }
        });
      }
    }
  };

  const handleMaxValidatorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    updateConfig({
      validatorRequirements: {
        ...config.validatorRequirements,
        maxValidators: value === '' ? null : Number(value),
      }
    });
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Validator Requirements
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure the requirements and restrictions for validators on your network.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Minimum Stake"
              name="validatorRequirements.minStake"
              type="number"
              inputProps={{ min: 1 }}
              value={config.validatorRequirements.minStake}
              onChange={handleNumberChange}
              helperText={`Minimum tokens required to become a validator (in ${config.tokenEconomics.symbol || 'tokens'})`}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="The minimum amount of tokens a validator must stake to join the network">
                      <HelpOutlineIcon fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Maximum Validators"
              name="validatorRequirements.maxValidators"
              type="number"
              inputProps={{ min: 1 }}
              value={config.validatorRequirements.maxValidators === null ? '' : config.validatorRequirements.maxValidators}
              onChange={handleMaxValidatorsChange}
              helperText="Maximum number of active validators (leave empty for unlimited)"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="The maximum number of active validators allowed in the validator set. Leave empty for no limit">
                      <HelpOutlineIcon fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box>
              <Typography gutterBottom>
                Unbonding Period (days): {config.validatorRequirements.unbondingPeriod}
              </Typography>
              <Slider
                value={config.validatorRequirements.unbondingPeriod}
                onChange={(_, value) => {
                  updateConfig({
                    validatorRequirements: {
                      ...config.validatorRequirements,
                      unbondingPeriod: value as number,
                    }
                  });
                }}
                step={1}
                min={1}
                max={30}
                valueLabelDisplay="auto"
                marks={[
                  { value: 1, label: '1d' },
                  { value: 7, label: '7d' },
                  { value: 14, label: '14d' },
                  { value: 21, label: '21d' },
                  { value: 30, label: '30d' },
                ]}
              />
              <Typography variant="body2" color="text.secondary">
                Time required for unstaked tokens to become liquid again
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Validator Configuration Tips
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" paragraph>
                <strong>Recommended settings:</strong>
              </Typography>
              
              <Typography variant="body2" component="div">
                <ul>
                  <li>
                    <strong>Public networks:</strong> Set maximum validators between 50-150 to balance
                    decentralization and performance
                  </li>
                  <li>
                    <strong>Private/Enterprise networks:</strong> A smaller set of 5-20 trusted validators
                    is typically sufficient
                  </li>
                  <li>
                    <strong>Minimum stake:</strong> Should be high enough to prevent spam but low enough to allow
                    participation (typically 0.1-1% of initial token supply)
                  </li>
                  <li>
                    <strong>Unbonding period:</strong> 14-21 days is standard for public networks, while private networks
                    can use shorter periods like 1-7 days
                  </li>
                </ul>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                These settings help ensure network security while balancing accessibility for validators.
                Longer unbonding periods improve security by preventing quick withdrawal of stake after
                malicious actions, but reduce liquidity for validators.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ValidatorsForm;