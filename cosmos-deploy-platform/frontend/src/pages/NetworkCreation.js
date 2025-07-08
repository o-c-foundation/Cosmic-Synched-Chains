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
const PlaceholderForm = ({ title, onNext, onBack, formData, setFormData }) => (
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
  const [formErrors, setFormErrors] = useState({});
  
  // Form data state
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    provider: '',
    region: '',
    nodeType: '',
    diskSize: '',
    advancedMode: false,
    
    // Token Economics
    tokenEconomics: {
      name: '',
      symbol: '',
      decimals: 6,
      initialSupply: 100000000,
      maxSupply: null,
      inflationRate: 7,
      inflationRateChange: 0.13,
      inflationMax: 20,
      inflationMin: 2,
      bondedRatioGoal: 67,
      blocksPerYear: 6311520,
      communityTax: 2,
      validatorsAllocation: 40,
      communityPoolAllocation: 30,
      strategicReserveAllocation: 20,
      airdropAllocation: 10
    },
    
    // Validators
    validators: {
      count: 4,
      blockTime: 5,
      unbondingTime: 21,
      maxValidators: 100,
      maxEntries: 7,
      historicalEntries: 10000,
      customValidators: []
    },
    
    // Governance Settings
    governance: {
      minDeposit: 10000,
      maxDepositPeriod: 14,
      votingPeriod: 14,
      quorum: 33.4,
      threshold: 50,
      vetoThreshold: 33.4,
      maxTitleLength: 140,
      maxDescriptionLength: 10000,
      enabledProposalTypes: ['text', 'parameter_change', 'community_pool_spend', 'software_upgrade', 'cancel_software_upgrade']
    },
    
    // Modules
    modules: {
      enabled: ['bank', 'staking', 'distribution', 'gov', 'slashing', 'ibc', 'authz', 'feegrant'],
      params: {}
    }
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
  
  // Validate the form before moving to next step
  const validateForm = () => {
    // Basic validation could be added here
    return true;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      if (activeStep === steps.length - 1) {
        handleCreateNetwork();
      } else {
        setActiveStep(prevStep => prevStep + 1);
      }
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
            setFormData={setFormData}
            errors={formErrors}
            setErrors={setFormErrors}
            validateForm={validateForm}
            onNext={handleNext}
            onBack={activeStep > 0 ? handleBack : null}
          />
        )}
      </Paper>
    </Box>
  );
};

export default NetworkCreation;