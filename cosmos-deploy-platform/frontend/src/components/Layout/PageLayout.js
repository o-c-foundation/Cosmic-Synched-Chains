import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '../../theme/ThemeProvider';

/**
 * Standard page layout component for content pages
 * @param {Object} props Component props
 * @param {string} props.title Page title
 * @param {React.ReactNode} props.children Page content
 * @param {boolean} props.fullWidth Whether page should be full width
 * @returns {JSX.Element} PageLayout component
 */
const PageLayout = ({ title, children, fullWidth = false }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        backgroundColor: theme.colors.background.primary,
        color: theme.colors.text.primary,
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '60px'
      }}
    >
      <Container maxWidth={fullWidth ? false : "lg"}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            color: theme.colors.text.accent,
            marginBottom: theme.spacing.xl,
            fontWeight: theme.typography.fontWeight.bold,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
};

export default PageLayout;
