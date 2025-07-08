import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Account Details', 'Personal Information', 'Terms & Conditions'];
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    jobTitle: '',
    phoneNumber: '',
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'acceptTerms' ? checked : value
    });
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };
  
  // Validate step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    } 
    else if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
    }
    else if (step === 2) {
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) return;
    
    try {
      // Submit registration data
      await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        phoneNumber: formData.phoneNumber
      });
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth context
      console.error('Signup error:', err);
    }
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={loading}
            />
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="companyName"
              label="Company Name"
              name="companyName"
              autoComplete="organization"
              value={formData.companyName}
              onChange={handleChange}
              error={!!formErrors.companyName}
              helperText={formErrors.companyName}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="jobTitle"
              label="Job Title"
              name="jobTitle"
              autoComplete="organization-title"
              value={formData.jobTitle}
              onChange={handleChange}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={loading}
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="body1" paragraph>
              By creating an account, you agree to our Terms of Service and Privacy Policy. 
              Please read these documents carefully before proceeding.
            </Typography>
            
            <Typography variant="body2" paragraph>
              • We will collect and process your personal data as described in our Privacy Policy.
            </Typography>
            
            <Typography variant="body2" paragraph>
              • You are responsible for maintaining the security of your account credentials.
            </Typography>
            
            <Typography variant="body2" paragraph>
              • The Cosmos Deploy Platform is provided "as is" without warranties of any kind.
            </Typography>
            
            <Typography variant="body2" paragraph>
              • We reserve the right to modify or terminate the service for any reason, without notice.
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="I agree to the terms and conditions"
            />
            {formErrors.acceptTerms && (
              <Typography color="error" variant="caption">
                {formErrors.acceptTerms}
              </Typography>
            )}
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 8,
        px: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Create Account
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Join Cosmos Deploy Platform
          </Typography>
        </Box>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext} noValidate>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
            >
              Back
            </Button>
            
            <Button
              type={activeStep === steps.length - 1 ? "submit" : "button"}
              variant="contained"
              color="primary"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 
               activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Link component={RouterLink} to="/" variant="body2">
          Back to Home
        </Link>
      </Box>
    </Box>
  );
};

export default Signup;