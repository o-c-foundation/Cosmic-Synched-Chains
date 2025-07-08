#!/bin/bash

# Admin Panel Frontend Rebuilder
# This script will completely rebuild the admin frontend from scratch

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ADMIN_DIR="/root/Documents/cosmos-deploy-platform/admin-panel"
CLIENT_DIR="$ADMIN_DIR/client"
BACKUP_DIR="$ADMIN_DIR/client-backup-$(date +%Y%m%d%H%M%S)"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}          Admin Panel Frontend Rebuilder Tool              ${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Check if admin directory exists
if [ ! -d "$ADMIN_DIR" ]; then
  echo -e "${RED}Error: Admin panel directory not found at $ADMIN_DIR${NC}"
  exit 1
fi

# Stop any running process on port 3001
echo -e "${YELLOW}Stopping any service running on port 3001...${NC}"
PID=$(lsof -ti:3001)
if [ ! -z "$PID" ]; then
  echo -e "Stopping service on port 3001 (PID: $PID)..."
  kill -9 $PID 2>/dev/null
  sleep 1
else
  echo -e "No service running on port 3001"
fi

# Backup existing client directory if it exists
if [ -d "$CLIENT_DIR" ]; then
  echo -e "${YELLOW}Backing up existing client directory to $BACKUP_DIR...${NC}"
  mv "$CLIENT_DIR" "$BACKUP_DIR"
fi

# Create new client directory
echo -e "${YELLOW}Creating new client directory...${NC}"
mkdir -p "$CLIENT_DIR"
cd "$CLIENT_DIR"

# Initialize a new React app with minimal dependencies
echo -e "${YELLOW}Initializing new React app...${NC}"

# Create package.json
echo -e "${YELLOW}Creating package.json...${NC}"
cat > package.json << EOF
{
  "name": "cosmos-deploy-admin-client",
  "version": "1.0.0",
  "description": "Admin panel frontend for Cosmos Deploy Platform",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.1",
    "@mui/material": "^5.14.1",
    "@mui/x-data-grid": "^6.10.1",
    "axios": "^1.4.0",
    "chart.js": "^4.3.0",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.2",
    "react-scripts": "5.0.1",
    "date-fns": "^2.30.0",
    "notistack": "^3.0.1"
  },
  "scripts": {
    "start": "PORT=3001 react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:4001"
}
EOF

# Create public directory and index.html
echo -e "${YELLOW}Creating public directory and index.html...${NC}"
mkdir -p public
cat > public/index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Cosmic Synched Chains Admin Panel"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <title>CSC Admin Panel</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Roboto', sans-serif;
      }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create manifest.json
cat > public/manifest.json << EOF
{
  "short_name": "CSC Admin",
  "name": "Cosmic Synched Chains Admin Panel",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
EOF

# Create src directory and basic files
echo -e "${YELLOW}Creating src directory and basic files...${NC}"
mkdir -p src

# Create index.js
cat > src/index.js << EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
EOF

# Create theme.js
cat > src/theme.js << EOF
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
EOF

# Create App.js with a minimal implementation
cat > src/App.js << EOF
import React from 'react';
import { Box, Typography, AppBar, Toolbar, Container, Paper } from '@mui/material';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cosmic Synched Chains Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>
          <Typography variant="body1">
            The admin panel is currently being set up. This is a minimal implementation to verify connectivity.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Backend API: http://localhost:4001
          </Typography>
        </Paper>
      </Container>
      
      <Box component="footer" sx={{ p: 2, bgcolor: 'background.dark', color: 'white', textAlign: 'center' }}>
        <Typography variant="body2">
          Cosmic Synched Chains by Syncron Labs - Admin Access Only
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
EOF

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --no-fund --no-audit

# Test start
echo -e "${YELLOW}Test starting admin frontend...${NC}"
PORT=3001 BROWSER=none npm start > /tmp/admin-frontend-rebuild.log 2>&1 &
FRONTEND_PID=$!
sleep 15

# Check if admin frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
  echo -e "${RED}Error: Failed to start admin frontend. Check debug log:${NC}"
  cat /tmp/admin-frontend-rebuild.log
  echo -e "${RED}Rebuild failed.${NC}"
  exit 1
else
  echo -e "${GREEN}Admin frontend started successfully on port 3001 (PID: $FRONTEND_PID)${NC}"
  
  # Test connectivity
  echo -e "${YELLOW}Testing connectivity...${NC}"
  if curl -s http://localhost:3001 | grep -q "html"; then
    echo -e "${GREEN}Admin frontend is responding on http://localhost:3001${NC}"
  else
    echo -e "${RED}Admin frontend is not responding correctly on http://localhost:3001${NC}"
  fi
  
  # Kill the test process
  kill $FRONTEND_PID
fi

echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN}          Admin Panel Frontend Rebuilt Successfully        ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${YELLOW}A minimal admin panel has been created to ensure connectivity.${NC}"
echo -e "${YELLOW}You can restore your previous components from:${NC}"
echo -e "${BLUE}$BACKUP_DIR${NC}"
echo ""
echo -e "${YELLOW}To run the full system with:${NC}"
echo -e "${BLUE}cd /root/Documents/cosmos-deploy-platform/ && ./restart-services.sh${NC}"
echo ""