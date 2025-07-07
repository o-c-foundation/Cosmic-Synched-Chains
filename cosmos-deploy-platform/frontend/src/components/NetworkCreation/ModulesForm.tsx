import React from 'react';
import { Box, Typography, Grid, Paper, Switch, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Button, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { NetworkConfig, Module } from '../../types/network';
import { Editor } from '@monaco-editor/react';

interface ModulesFormProps {
  config: NetworkConfig;
  updateConfig: (updates: Partial<NetworkConfig>) => void;
}

const ModulesForm: React.FC<ModulesFormProps> = ({ config, updateConfig }) => {
  const handleModuleToggle = (moduleId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedModules = config.modules.map(module => 
      module.id === moduleId ? { ...module, enabled: event.target.checked } : module
    );
    
    updateConfig({ modules: updatedModules });
  };
  
  const handleConfigChange = (moduleId: string, value: string | undefined) => {
    if (!value) return;
    
    try {
      const configObject = JSON.parse(value);
      const updatedModules = config.modules.map(module => 
        module.id === moduleId ? { ...module, config: configObject } : module
      );
      
      updateConfig({ modules: updatedModules });
    } catch (error) {
      // Invalid JSON, don't update
      console.error('Invalid JSON configuration', error);
    }
  };
  
  const getModuleDescription = (moduleId: string): string => {
    const descriptions: Record<string, string> = {
      'bank': 'Handles token transfers between accounts and tracks account balances.',
      'staking': 'Enables token holders to delegate their tokens to validators and earn rewards.',
      'gov': 'Implements on-chain governance allowing token holders to vote on proposals.',
      'ibc': 'Inter-Blockchain Communication protocol for transferring tokens and data across different blockchains.',
      'distribution': 'Distributes rewards to validators and delegators.',
      'slashing': 'Penalizes validators for misbehavior like downtime or double-signing.',
      'wasm': 'Enables smart contract functionality using WebAssembly (CosmWasm).',
    };
    
    return descriptions[moduleId] || 'Custom module';
  };
  
  const getCoreModuleConfigOptions = (moduleId: string): string => {
    const configOptions: Record<string, string> = {
      'bank': '{\n  "sendEnabled": true,\n  "defaultSendEnabled": true\n}',
      'staking': '{\n  "minCommissionRate": 5,\n  "maxValidators": 100,\n  "unbondingTime": "1814400s",\n  "historialEntries": 10000\n}',
      'gov': '{\n  "minDeposit": 10000,\n  "maxDepositPeriod": "172800s",\n  "votingPeriod": "172800s",\n  "quorum": "0.334",\n  "threshold": "0.5",\n  "vetoThreshold": "0.334"\n}',
      'ibc': '{\n  "timeoutTimestamp": "600",\n  "transferEnabled": true\n}',
      'distribution': '{\n  "communityTax": "0.02",\n  "baseProposerReward": "0.01",\n  "bonusProposerReward": "0.04",\n  "withdrawAddrEnabled": true\n}',
      'slashing': '{\n  "signedBlocksWindow": 100,\n  "minSignedPerWindow": "0.5",\n  "downtimeJailDuration": "600s",\n  "slashFractionDoubleSign": "0.05",\n  "slashFractionDowntime": "0.01"\n}',
      'wasm': '{\n  "uploadAccess": {\n    "permission": "Everybody"\n  },\n  "instantiateAccess": {\n    "permission": "Everybody"\n  }\n}'
    };
    
    return configOptions[moduleId] || '{}';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Modules Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Enable and configure the modules you want to include in your blockchain.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {config.modules.map((module) => (
          <Grid item xs={12} key={module.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={module.enabled}
                        onChange={handleModuleToggle(module.id)}
                        color="primary"
                      />
                    }
                    label={<Typography variant="subtitle1">{module.name}</Typography>}
                  />
                  <Tooltip title={getModuleDescription(module.id)}>
                    <InfoOutlinedIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                  </Tooltip>
                </Box>
                
                {module.id === 'bank' || module.id === 'staking' ? (
                  <Typography variant="caption" color="primary">
                    Core Module (Required)
                  </Typography>
                ) : null}
              </Box>
              
              {module.enabled && (
                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Advanced Configuration</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      Edit the JSON configuration for this module:
                    </Typography>
                    <Box sx={{ height: 200, border: '1px solid #ddd' }}>
                      <Editor
                        height="200px"
                        defaultLanguage="json"
                        defaultValue={JSON.stringify(module.config, null, 2) || getCoreModuleConfigOptions(module.id)}
                        onChange={(value) => handleConfigChange(module.id, value)}
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          lineNumbers: 'on',
                          tabSize: 2,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Configuration changes will be validated and saved automatically.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* TODO: Add button to add custom modules */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined">
          Add Custom Module
        </Button>
      </Box>
    </Box>
  );
};

export default ModulesForm;