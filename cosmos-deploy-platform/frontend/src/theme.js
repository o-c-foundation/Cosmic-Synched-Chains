import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#CCFF00', // Correct green
      light: '#E5FF7D',
      dark: '#99CC00',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FF00FF', // Complementary magenta to create cyberpunk feel
      light: '#FF7DFF',
      dark: '#D800D8',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(204, 255, 0, 0.2)',
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
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
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          color: '#000000',
          '&:hover': {
            boxShadow: '0 0 15px rgba(204, 255, 0, 0.5)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(204, 255, 0, 0.5)',
          '&:hover': {
            borderColor: '#CCFF00',
            boxShadow: '0 0 10px rgba(204, 255, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1A1A1A',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(204, 255, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(204, 255, 0, 0.15)',
            border: '1px solid rgba(204, 255, 0, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#000000',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#CCFF00 #1A1A1A",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#1A1A1A",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#CCFF00",
            minHeight: 24,
            border: "2px solid #1A1A1A",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#E5FF7D",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#E5FF7D",
          },
        },
      },
    },
  },
});

export default theme;