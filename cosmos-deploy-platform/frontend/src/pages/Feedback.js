import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField,
  Button,
  Card,
  CardContent,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import FeedbackIcon from '@mui/icons-material/Feedback';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

/**
 * Feedback page for collecting user feedback, bug reports, and feature requests
 * @returns {JSX.Element} Feedback component
 */
const Feedback = () => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    impact: 'moderate',
    component: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [errors, setErrors] = useState({});

  const handleFeedbackTypeChange = (event) => {
    setFeedbackType(event.target.value);
  };
  
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    if (feedbackType === 'bug' && !formData.component) {
      newErrors.component = 'Component is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSnackbarMessage('Please fix the errors in the form');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    // Here would be the code to submit the feedback to a backend API
    console.log('Form submitted:', { feedbackType, rating, ...formData });
    
    // Show success message
    setSnackbarMessage('Thank you for your feedback! We will review it shortly.');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    
    // Reset form
    setFeedbackType('general');
    setRating(0);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
      impact: 'moderate',
      component: ''
    });
    setErrors({});
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  
  const feedbackTypes = [
    { 
      value: 'general', 
      label: 'General Feedback', 
      icon: <FeedbackIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      description: 'Share your thoughts about your overall experience with our platform'
    },
    { 
      value: 'bug', 
      label: 'Report a Bug', 
      icon: <BugReportIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      description: 'Let us know about any issues or errors you encountered'
    },
    { 
      value: 'feature', 
      label: 'Feature Request', 
      icon: <LightbulbIcon sx={{ color: theme.colors.accent, fontSize: 36 }}/>,
      description: 'Suggest new features or improvements to our platform'
    }
  ];

  const platformComponents = [
    'Network Creation',
    'Validator Management',
    'Monitoring Dashboard',
    'API Services',
    'Web Interface',
    'Documentation',
    'Authentication System',
    'Governance Module',
    'Other'
  ];

  return (
    <PageLayout title="Feedback">
      <Grid container spacing={4}>
        {/* Left side - Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`,
            mb: theme.spacing.xl
          }}>
            <CardContent sx={{ p: theme.spacing.lg }}>
              <form onSubmit={handleSubmit}>
                {/* Feedback Type Selection */}
                <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                  What kind of feedback do you have?
                </Typography>
                <Grid container spacing={2} sx={{ mb: theme.spacing.lg }}>
                  {feedbackTypes.map((type) => (
                    <Grid item xs={12} sm={4} key={type.value}>
                      <Card 
                        onClick={() => setFeedbackType(type.value)}
                        sx={{ 
                          p: theme.spacing.md,
                          backgroundColor: feedbackType === type.value ? 
                            'rgba(204, 255, 0, 0.1)' : theme.colors.background.tertiary,
                          border: `1px solid ${feedbackType === type.value ? 
                            theme.colors.accent : theme.colors.border.light}`,
                          cursor: 'pointer',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          '&:hover': {
                            borderColor: theme.colors.accent,
                            backgroundColor: 'rgba(204, 255, 0, 0.05)'
                          }
                        }}
                      >
                        {type.icon}
                        <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5, color: theme.colors.text.primary }}>
                          {type.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                          {type.description}
                        </Typography>
                        <Radio
                          checked={feedbackType === type.value}
                          onChange={handleFeedbackTypeChange}
                          value={type.value}
                          name="feedback-type-radio"
                          sx={{
                            color: theme.colors.text.secondary,
                            '&.Mui-checked': {
                              color: theme.colors.accent,
                            },
                          }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Rating (for general feedback) */}
                {feedbackType === 'general' && (
                  <Box sx={{ mb: theme.spacing.lg }}>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                      How would you rate your experience?
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: theme.spacing.md
                    }}>
                      <Rating
                        name="experience-rating"
                        value={rating}
                        onChange={handleRatingChange}
                        size="large"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: theme.colors.accent,
                          },
                          '& .MuiRating-iconEmpty': {
                            color: theme.colors.text.secondary,
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {rating === 0 ? (
                          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                            Select a rating
                          </Typography>
                        ) : rating <= 2 ? (
                          <>
                            <SentimentVeryDissatisfiedIcon sx={{ color: theme.colors.error, mr: 1 }} />
                            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                              Not satisfied
                            </Typography>
                          </>
                        ) : rating === 3 ? (
                          <>
                            <SentimentSatisfiedIcon sx={{ color: theme.colors.warning, mr: 1 }} />
                            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                              Neutral
                            </Typography>
                          </>
                        ) : (
                          <>
                            <SentimentVerySatisfiedIcon sx={{ color: theme.colors.success, mr: 1 }} />
                            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                              Very satisfied
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Contact Info */}
                <Grid container spacing={2} sx={{ mb: theme.spacing.md }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name (Optional)"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: theme.colors.border.light },
                          '&:hover fieldset': { borderColor: theme.colors.border.medium },
                          '&.Mui-focused fieldset': { borderColor: theme.colors.accent },
                          backgroundColor: theme.colors.background.tertiary
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.colors.text.secondary
                        },
                        '& .MuiOutlinedInput-input': {
                          color: theme.colors.text.primary
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: theme.colors.border.light },
                          '&:hover fieldset': { borderColor: theme.colors.border.medium },
                          '&.Mui-focused fieldset': { borderColor: theme.colors.accent },
                          backgroundColor: theme.colors.background.tertiary
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.colors.text.secondary
                        },
                        '& .MuiOutlinedInput-input': {
                          color: theme.colors.text.primary
                        },
                        '& .MuiFormHelperText-root': {
                          color: theme.colors.error
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Subject */}
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  error={!!errors.subject}
                  helperText={errors.subject}
                  sx={{
                    mb: theme.spacing.md,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: theme.colors.border.light },
                      '&:hover fieldset': { borderColor: theme.colors.border.medium },
                      '&.Mui-focused fieldset': { borderColor: theme.colors.accent },
                      backgroundColor: theme.colors.background.tertiary
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.colors.text.secondary
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.colors.text.primary
                    },
                    '& .MuiFormHelperText-root': {
                      color: theme.colors.error
                    }
                  }}
                />

                {/* Message */}
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  multiline
                  rows={6}
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={{
                    mb: theme.spacing.md,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: theme.colors.border.light },
                      '&:hover fieldset': { borderColor: theme.colors.border.medium },
                      '&.Mui-focused fieldset': { borderColor: theme.colors.accent },
                      backgroundColor: theme.colors.background.tertiary
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.colors.text.secondary
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.colors.text.primary
                    },
                    '& .MuiFormHelperText-root': {
                      color: theme.colors.error
                    }
                  }}
                />

                {/* Bug-specific fields */}
                {feedbackType === 'bug' && (
                  <Grid container spacing={2} sx={{ mb: theme.spacing.md }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <FormLabel id="priority-label" sx={{ color: theme.colors.text.accent, mb: 1 }}>
                          Priority
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="priority-label"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          row
                        >
                          <FormControlLabel 
                            value="low" 
                            control={
                              <Radio 
                                sx={{
                                  color: theme.colors.text.secondary,
                                  '&.Mui-checked': {
                                    color: theme.colors.accent,
                                  }
                                }}
                              />
                            } 
                            label="Low" 
                            sx={{ color: theme.colors.text.primary }}
                          />
                          <FormControlLabel 
                            value="medium" 
                            control={
                              <Radio 
                                sx={{
                                  color: theme.colors.text.secondary,
                                  '&.Mui-checked': {
                                    color: theme.colors.accent,
                                  }
                                }}
                              />
                            } 
                            label="Medium" 
                            sx={{ color: theme.colors.text.primary }}
                          />
                          <FormControlLabel 
                            value="high" 
                            control={
                              <Radio 
                                sx={{
                                  color: theme.colors.text.secondary,
                                  '&.Mui-checked': {
                                    color: theme.colors.accent,
                                  }
                                }}
                              />
                            } 
                            label="High" 
                            sx={{ color: theme.colors.text.primary }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <FormLabel id="impact-label" sx={{ color: theme.colors.text.accent, mb: 1 }}>
                          Impact
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="impact-label"
                          name="impact"
                          value={formData.impact}
                          onChange={handleInputChange}
                          row
                        >
                          <FormControlLabel 
                            value="minor" 
                            control={
                              <Radio 
                                sx={{
                                  color: theme.colors.text.secondary,
                                  '&.Mui-checked': {
                                    color: theme.colors.accent,
                                  }
                                }}
                              />
                            } 
                            label="Minor" 
                            sx={{ color: theme.colors.text.primary }}
                          />
                          <FormControlLabel 
                            value="moderate" 
                            control={
                              <Radio 
                                sx={{
                                  color: theme.colors.text.secondary,
                                  '&.Mui-checked': {
                                    color: theme.colors.accent,
                                  }
                                }}
                              />
                            } 
                            label="Moderate" 
                            sx={{ color: theme.colors.text.primary }}
                          />
                          <FormControlLabel 
                            value="major" 
                            control={
                              <Radio 
                                sx={{
                                  color: theme.colors.text.secondary,
                                  '&.Mui-checked': {
                                    color: theme.colors.accent,
                                  }
                                }}
                              />
                            } 
                            label="Major" 
                            sx={{ color: theme.colors.text.primary }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Component"
                        name="component"
                        value={formData.component}
                        onChange={handleInputChange}
                        SelectProps={{
                          native: true
                        }}
                        variant="outlined"
                        required
                        error={!!errors.component}
                        helperText={errors.component}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: theme.colors.border.light },
                            '&:hover fieldset': { borderColor: theme.colors.border.medium },
                            '&.Mui-focused fieldset': { borderColor: theme.colors.accent },
                            backgroundColor: theme.colors.background.tertiary
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.colors.text.secondary
                          },
                          '& .MuiOutlinedInput-input': {
                            color: theme.colors.text.primary
                          },
                          '& .MuiFormHelperText-root': {
                            color: theme.colors.error
                          }
                        }}
                      >
                        <option value="">Select a component</option>
                        {platformComponents.map((component) => (
                          <option key={component} value={component}>{component}</option>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                )}

                {/* Feature-specific fields */}
                {feedbackType === 'feature' && (
                  <Box sx={{ mb: theme.spacing.md, p: theme.spacing.md, backgroundColor: theme.colors.background.tertiary, borderRadius: theme.borderRadius.medium }}>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.colors.text.primary }}>
                      Thank you for helping us improve! When suggesting features, consider:
                    </Typography>
                    <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                      <li>
                        <Typography variant="body2" sx={{ color: theme.colors.text.primary }}>
                          What problem does this feature solve?
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" sx={{ color: theme.colors.text.primary }}>
                          How would this feature benefit you and other users?
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" sx={{ color: theme.colors.text.primary }}>
                          Are there any examples of similar features elsewhere that you find helpful?
                        </Typography>
                      </li>
                    </ul>
                  </Box>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    backgroundColor: theme.colors.accent,
                    color: '#000000',
                    fontWeight: theme.typography.fontWeight.bold,
                    py: theme.spacing.sm,
                    '&:hover': {
                      backgroundColor: theme.colors.accentLight
                    }
                  }}
                >
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right side - Additional info */}
        <Grid item xs={12} md={4}>
          {/* Feedback Policy */}
          <Card sx={{ 
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`,
            mb: theme.spacing.lg
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Our Feedback Policy
              </Typography>
              <Typography variant="body2" paragraph sx={{ color: theme.colors.text.primary }}>
                We value your input and use it to continuously improve our platform. Here's how we handle your feedback:
              </Typography>
              <Divider sx={{ my: theme.spacing.sm, borderColor: theme.colors.border.light }} />
              <Typography variant="subtitle2" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Response Time
              </Typography>
              <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
                We aim to acknowledge all feedback within 48 hours. For bug reports, our team will investigate and provide updates as we work on a resolution.
              </Typography>
              <Typography variant="subtitle2" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Privacy
              </Typography>
              <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
                Your feedback is kept confidential. We may use anonymized feedback for improving our services but will not share your personal details without consent.
              </Typography>
              <Typography variant="subtitle2" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Feature Requests
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                We evaluate all feature requests based on user demand, strategic alignment, and technical feasibility. Popular requests are prioritized in our development roadmap.
              </Typography>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card sx={{ 
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`,
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.accent }}>
                Feedback FAQ
              </Typography>
              <Typography variant="subtitle2" gutterBottom sx={{ color: theme.colors.text.primary }}>
                How is my feedback used?
              </Typography>
              <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
                Your feedback is reviewed by our product team and used to prioritize improvements and identify issues that need immediate attention.
              </Typography>
              <Typography variant="subtitle2" gutterBottom sx={{ color: theme.colors.text.primary }}>
                Will I receive updates on my feedback?
              </Typography>
              <Typography variant="body2" paragraph sx={{ color: theme.colors.text.secondary }}>
                For bug reports and specific concerns, we'll update you via email. For general feedback and feature requests, we may reach out for more details if needed.
              </Typography>
              <Typography variant="subtitle2" gutterBottom sx={{ color: theme.colors.text.primary }}>
                Can I track the status of my bug report?
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Yes, you'll receive a ticket number for bug reports, which you can use to check the status in our help center.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ 
            width: '100%',
            backgroundColor: snackbarSeverity === 'success' ? '#2e7d32' : '#d32f2f',
            color: '#ffffff'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
};

export default Feedback;
