/**
 * Cosmos Deploy Platform Theme
 * 
 * This file defines the global theme styling for the application
 * Primary: #000000 (Black)
 * Accent: #CCFF00 (Neon Green)
 */

const theme = {
  colors: {
    primary: '#000000',
    accent: '#CCFF00',
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      accent: '#CCFF00',
      dark: '#000000'
    },
    background: {
      primary: '#000000',
      secondary: '#111111',
      tertiary: '#222222'
    },
    border: {
      light: '#333333',
      accent: '#CCFF00'
    },
    success: '#00CC66',
    error: '#FF3366',
    warning: '#FFCC00',
    info: '#3399FF'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      small: '0.875rem',
      normal: '1rem',
      large: '1.125rem',
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem'
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    }
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px'
  },
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    fast: 'all 0.15s ease-out',
    slow: 'all 0.5s ease-in-out'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%'
  },
  // Component-specific styling
  components: {
    button: {
      primary: {
        background: '#CCFF00',
        color: '#000000',
        hoverBackground: '#DDFF33'
      },
      secondary: {
        background: 'transparent',
        color: '#CCFF00',
        border: '1px solid #CCFF00',
        hoverBackground: 'rgba(204, 255, 0, 0.1)'
      },
      disabled: {
        background: '#333333',
        color: '#666666'
      }
    },
    card: {
      background: '#111111',
      border: '1px solid #333333',
      hoverBorder: '1px solid #CCFF00'
    },
    input: {
      background: '#111111',
      border: '1px solid #333333',
      focusBorder: '1px solid #CCFF00',
      color: '#FFFFFF',
      placeholder: '#666666'
    },
    navbar: {
      background: '#000000',
      border: '1px solid #333333',
      activeItem: '#CCFF00'
    },
    sidebar: {
      background: '#111111',
      activeItem: {
        background: '#000000',
        color: '#CCFF00',
        borderLeft: '4px solid #CCFF00'
      }
    },
    table: {
      header: {
        background: '#111111',
        color: '#CCFF00'
      },
      row: {
        background: '#000000',
        altBackground: '#111111',
        hoverBackground: '#222222'
      }
    }
  }
};

export default theme;
