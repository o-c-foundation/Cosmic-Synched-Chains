import { createTheme } from '@mui/material/styles';

// Cosmic Synched Chains branding colors
const PRIMARY_COLOR = '#CCFF00'; // Bright green
const SECONDARY_COLOR = '#000000'; // Black

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      contrastText: '#000000',
    },
    secondary: {
      main: SECONDARY_COLOR,
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      dark: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

export default theme;
