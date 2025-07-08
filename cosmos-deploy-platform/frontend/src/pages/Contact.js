import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import PageLayout from '../components/Layout/PageLayout';
import { useTheme } from '../theme/ThemeProvider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

/**
 * Contact page with contact form and information
 * @returns {JSX.Element} Contact component
 */
const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: 'success',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setAlert({
        open: true,
        type: 'success',
        message: 'Your message has been sent. We\'ll get back to you shortly!'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 1500);
  };

  const handleAlertClose = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'feedback', label: 'Product Feedback' },
    { value: 'billing', label: 'Billing Support' }
  ];

  const contactDetails = [
    {
      icon: <EmailIcon fontSize="large" sx={{ color: theme.colors.accent }} />,
      label: 'Email Us',
      content: 'contact@opencryptofoundation.org',
      action: 'mailto:contact@opencryptofoundation.org'
    },
    {
      icon: <PhoneIcon fontSize="large" sx={{ color: theme.colors.accent }} />,
      label: 'Call Us',
      content: '+1 (888) 555-0123',
      action: 'tel:+18885550123'
    },
    {
      icon: <LocationOnIcon fontSize="large" sx={{ color: theme.colors.accent }} />,
      label: 'Visit Us',
      content: '88 Blockchain Avenue, San Francisco, CA 94107',
      action: 'https://maps.google.com/?q=San+Francisco+CA+94107'
    }
  ];

  return (
    <PageLayout title="Contact Us">
      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={0}
            sx={{ 
              backgroundColor: theme.colors.background.secondary,
              p: theme.spacing.lg,
              borderRadius: theme.borderRadius.medium,
              border: `1px solid ${theme.colors.border.light}`,
              height: '100%'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
              Get in Touch
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: theme.spacing.lg }}>
              Have questions or need assistance? Our team is here to help. 
              Feel free to reach out through any of the channels below.
            </Typography>

            <Box sx={{ mt: theme.spacing.xl }}>
              {contactDetails.map((detail, index) => (
                <Box key={index} sx={{ mb: theme.spacing.lg }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: theme.spacing.sm }}>
                    {detail.icon}
                    <Typography variant="h6" sx={{ ml: theme.spacing.md, color: theme.colors.text.primary }}>
                      {detail.label}
                    </Typography>
                  </Box>
                  <Typography 
                    component="a"
                    href={detail.action}
                    target="_blank"
                    rel="noopener noreferrer" 
                    variant="body1" 
                    sx={{ 
                      ml: '44px',
                      color: theme.colors.text.primary,
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme.colors.accent,
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {detail.content}
                  </Typography>
                  
                  {index < contactDetails.length - 1 && (
                    <Divider sx={{ my: theme.spacing.lg, borderColor: theme.colors.border.light }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={0}
            sx={{ 
              backgroundColor: theme.colors.background.secondary,
              p: theme.spacing.lg,
              borderRadius: theme.borderRadius.medium,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text.accent }}>
              Send Us a Message
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiInputLabel-root': { color: theme.colors.text.secondary },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: theme.colors.border.light },
                        '&:hover fieldset': { borderColor: theme.colors.border.medium },
                        '&.Mui-focused fieldset': { borderColor: theme.colors.accent }
                      }
                    }}
                    InputProps={{
                      style: { color: theme.colors.text.primary }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiInputLabel-root': { color: theme.colors.text.secondary },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: theme.colors.border.light },
                        '&:hover fieldset': { borderColor: theme.colors.border.medium },
                        '&.Mui-focused fieldset': { borderColor: theme.colors.accent }
                      }
                    }}
                    InputProps={{
                      style: { color: theme.colors.text.primary }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Inquiry Type"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiInputLabel-root': { color: theme.colors.text.secondary },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: theme.colors.border.light },
                        '&:hover fieldset': { borderColor: theme.colors.border.medium },
                        '&.Mui-focused fieldset': { borderColor: theme.colors.accent }
                      },
                      '& .MuiSelect-select': { color: theme.colors.text.primary }
                    }}
                  >
                    {inquiryTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiInputLabel-root': { color: theme.colors.text.secondary },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: theme.colors.border.light },
                        '&:hover fieldset': { borderColor: theme.colors.border.medium },
                        '&.Mui-focused fieldset': { borderColor: theme.colors.accent }
                      }
                    }}
                    InputProps={{
                      style: { color: theme.colors.text.primary }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={5}
                    variant="outlined"
                    sx={{
                      '& .MuiInputLabel-root': { color: theme.colors.text.secondary },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: theme.colors.border.light },
                        '&:hover fieldset': { borderColor: theme.colors.border.medium },
                        '&.Mui-focused fieldset': { borderColor: theme.colors.accent }
                      }
                    }}
                    InputProps={{
                      style: { color: theme.colors.text.primary }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: theme.colors.accent,
                      color: '#000000',
                      fontWeight: theme.typography.fontWeight.bold,
                      '&:hover': {
                        backgroundColor: theme.colors.accentLight
                      },
                      py: theme.spacing.sm,
                      px: theme.spacing.lg
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
};

export default Contact;
