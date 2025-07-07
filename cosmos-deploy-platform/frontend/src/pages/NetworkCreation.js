import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Paper,
  Card,
  CardContent,
  Alert,
  CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNetworks } from '../context/NetworkContext';

// Import step components (will need placeholders if not yet implemented)
import BasicInfoForm from '../components/NetworkCreation/BasicInfoForm';
import TokenEconomicsForm from '../components/NetworkCreation/TokenEconomicsForm';
import ValidatorsForm from '../components/NetworkCreation/ValidatorsForm';
import ModulesForm from '../components/NetworkCreation/ModulesForm';
import GovernanceForm from '../components/NetworkCreation/GovernanceForm';
import ReviewForm from '../components/NetworkCreation/ReviewForm';

// Step component placeholders if needed
const PlaceholderForm = ({ title, onNext, onBack, formData, updateFormData }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title} (Placeholder)
      </Typography>
      <Typography paragraph>
        This is a placeholder for the {title} configuration step.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} disabled={!onBack}>
          Back
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onNext}
        >
          Continue
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const NetworkCreation = () => {
  const navigate = useNavigate();
  const { createNetwork } = useNetworks();
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    chainId: '',
    description: '',
    
    // Token Economics
    tokenEconomics: {
      name: '',
      symbol: '',
      decimals: 6,
      initialSupply: 100000000,
      maxSupply: null,
      distribution: {
        validators: 10,
        community: 40,
        foundation: 30,
        airdrop: 20,
      },
    },
    
    // Validator Requirements
    validatorRequirements: {
      minStake: 1000,
      maxValidators: 100,
      unbondingPeriod: 21,
    },
    
    // Governance Settings
    governanceSettings: {
      votingPeriod: 14,
      quorum: 33.4,
      threshold: 50,
      vetoThreshold: 33.4,
    },
    
    // Modules
    modules: [
      {
        id: 'bank',
        name: 'Bank',
        enabled: true,
        config: {},
      },
      {
        id: 'staking',
        name: 'Staking',
        enabled: true,
        config: {
          minCommissionRate: 5,
        },
      },
      {
        id: 'gov',
        name: 'Governance',
        enabled: true,
        config: {
          minDeposit: 10000,
        },
      },
      {
        id: 'ibc',
        name: 'IBC',
        enabled: true,
        config: {},
      },
      {
        id: 'wasm',
        name: 'CosmWasm',
        enabled: false,
        config: {},
      }
    ],
  });
  
  // Steps configuration
  const steps = [
    {
      label: 'Basic Information',
      component: BasicInfoForm || (props => <PlaceholderForm title="Basic Information" {...props} />)
    },
    {
      label: 'Token Economics',
      component: TokenEconomicsForm || (props => <PlaceholderForm title="Token Economics" {...props} />)
    },
    {
      label: 'Validator Requirements',
      component: ValidatorsForm || (props => <PlaceholderForm title="Validator Requirements" {...props} />)
    },
    {
      label: 'Modules',
      component: ModulesForm || (props => <PlaceholderForm title="Modules" {...props} />)
    },
    {
      label: 'Governance',
      component: GovernanceForm || (props => <PlaceholderForm title="Governance" {...props} />)
    },
    {
      label: 'Review & Create',
      component: ReviewForm || (props => <PlaceholderForm title="Review & Create" {...props} />)
    }
  ];
  
  // Handle form data updates
  const updateFormData = (updates) => {
    setFormData(prevData => ({
      ...prevData,
      ...updates
    }));
  };
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleCreateNetwork();
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Handle network creation
  const handleCreateNetwork = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const network = await createNetwork(formData);
      navigate(`/networks/${network.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create network');
    } finally {
      setLoading(false);
    }
  };
  
  // Render current step
  const CurrentStepComponent = steps[activeStep].component;
  
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Create New Network
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={activeStep > 0 ? handleBack : null}
          />
        )}
      </Paper>
    </Box>
  );
};

export default NetworkCreation;