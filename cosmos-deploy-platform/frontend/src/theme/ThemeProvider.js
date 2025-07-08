import React, { createContext, useContext } from 'react';
import theme from './theme';

// Create theme context
const ThemeContext = createContext(theme);

/**
 * Hook to access theme values
 * @returns {Object} Theme object
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * Theme provider component
 * @param {Object} props Component props
 * @returns {JSX.Element} Provider component
 */
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
