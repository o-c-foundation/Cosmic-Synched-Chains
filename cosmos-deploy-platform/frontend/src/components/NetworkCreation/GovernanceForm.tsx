import React from 'react';
import { Box, TextField, Typography, Slider, InputAdornment, Grid, Paper, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { NetworkConfig } from '../../types/network';

interface GovernanceFormProps {
  config: NetworkConfig;
  updateConfig: (updates: Partial<NetworkConfig>) => void;
}

const GovernanceForm: React.FC<GovernanceFormProps> = ({ config, updateConfig }) => {
  const handleNumberChange = (field: keyof typeof config.governanceSettings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    updateConfig({
      governanceSettings: {
        ...config.governanceSettings,
        [field]: value,
      },
    });
  };

  const handleSliderChange = (field: keyof typeof config.governanceSettings) => (
    _: Event,
    value: number | number[]
  ) => {
    if (typeof value !== 'number') return;
    
    updateConfig({
      governanceSettings: {
        ...config.governanceSettings,
        [field]: value,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Governance Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure how decisions are made and proposals are voted on within your blockchain.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography gutterBottom>
                Voting Period (days): {config.governanceSettings.votingPeriod}
              </Typography>
              <Slider
                value={config.governanceSettings.votingPeriod}
                onChange={handleSliderChange('votingPeriod')}
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
                Duration that proposals remain open for voting
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Quorum"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              value={config.governanceSettings.quorum}
              onChange={handleNumberChange('quorum')}
              helperText="Minimum percentage of voting power that must vote for a proposal to be valid"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" sx={{ mr: 1 }}>%</Typography>
                    <Tooltip title="The minimum participation required for a vote to be valid. Standard is 33.4% in Cosmos">
                      <HelpOutlineIcon fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Threshold"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              value={config.governanceSettings.threshold}
              onChange={handleNumberChange('threshold')}
              helperText="Percentage of voting power that must vote Yes for a proposal to pass"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" sx={{ mr: 1 }}>%</Typography>
                    <Tooltip title="The minimum YES votes required for a proposal to pass, as a percentage. Standard is 50% in Cosmos">
                      <HelpOutlineIcon fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Veto Threshold"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              value={config.governanceSettings.vetoThreshold}
              onChange={handleNumberChange('vetoThreshold')}
              helperText="Percentage of voting power that must vote NoWithVeto to reject a proposal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" sx={{ mr: 1 }}>%</Typography>
                    <Tooltip title="The minimum NoWithVeto votes required to reject a proposal regardless of Yes votes. Standard is 33.4% in Cosmos">
                      <HelpOutlineIcon fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Governance Parameters Explained
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" paragraph>
                <strong>Voting Period:</strong> The time window during which token holders can vote on a proposal.
                Longer periods give more time for deliberation but slow down decision-making.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Quorum:</strong> The minimum participation threshold required for a proposal to be valid.
                If fewer than this percentage of tokens vote, the proposal fails regardless of vote distribution.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Threshold:</strong> The minimum percentage of YES votes (among votes cast) required for
                a proposal to pass. Higher thresholds require stronger consensus but make changes harder to approve.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Veto Threshold:</strong> If this percentage of voting power votes "NoWithVeto", the 
                proposal is rejected regardless of other votes. This provides protection against proposals
                that might be harmful to the network.
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                <strong>Recommended values:</strong>
                <ul>
                  <li>Public networks: Quorum 33.4%, Threshold 50%, Veto 33.4%</li>
                  <li>Private networks: Quorum 50%, Threshold 66.7%, Veto 0-33.4%</li>
                </ul>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GovernanceForm;