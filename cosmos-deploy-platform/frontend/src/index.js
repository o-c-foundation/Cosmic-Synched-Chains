import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme/overrides.css'; // Import theme overrides after index.css to ensure they take precedence
import './theme/contrast-fixes.css'; // Import professional contrast fixes
import App from './App';
import { ThemeProvider } from './theme/ThemeProvider'; 
import './utils/debug-api'; // Import the debug tools
import './theme/component-overrides'; // Import dynamic component-specific overrides

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
