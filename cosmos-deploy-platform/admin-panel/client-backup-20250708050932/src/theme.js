import { createTheme } from '@mui/material/styles';

// Cosmic Synched Chains branding colors
const PRIMARY_COLOR = '#CCFF00'; // Bright green
const SECONDARY_COLOR = '#000000'; // Black
const TEXT_PRIMARY = '#000000'; // Black text for contrast on light backgrounds
const TEXT_SECONDARY = '#ffffff'; // White text for dark backgrounds
const BACKGROUND_LIGHT = '#f5f5f5'; // Light grey for background
const BACKGROUND_DARK = '#1a1a1a'; // Dark grey almost black for dark sections

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      contrastText: TEXT_PRIMARY,
    },
    secondary: {
      main: SECONDARY_COLOR,
      contrastText: TEXT_SECONDARY,
    },
    background: {
      default: BACKGROUND_LIGHT,
      paper: '#ffffff',
      dark: BACKGROUND_DARK,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    error: {
      main: '#ff3d00',
    },
    warning: {
      main: '#ffa000',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#43a047',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 400,
    },
    subtitle2: {
      fontWeight: 400,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
        containedPrimary: {
          color: TEXT_PRIMARY,
          '&:hover': {
            backgroundColor: PRIMARY_COLOR,
            opacity: 0.9,
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: SECONDARY_COLOR,
            opacity: 0.8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
  },
});

export default theme;