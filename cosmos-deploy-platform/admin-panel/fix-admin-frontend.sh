#!/bin/bash

# Admin Panel Frontend Fixer
# This script will diagnose and fix issues with the admin frontend

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ADMIN_DIR="/root/Documents/cosmos-deploy-platform/admin-panel"
CLIENT_DIR="$ADMIN_DIR/client"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}          Admin Panel Frontend Diagnostic Tool             ${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Check if admin client directory exists
if [ ! -d "$CLIENT_DIR" ]; then
  echo -e "${RED}Error: Admin client directory not found at $CLIENT_DIR${NC}"
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

# Change to client directory
cd "$CLIENT_DIR"
echo -e "${YELLOW}Current directory: $(pwd)${NC}"

# Check package.json
echo -e "${YELLOW}Checking package.json...${NC}"
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found!${NC}"
  exit 1
fi

# Check node_modules
echo -e "${YELLOW}Checking node_modules...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}node_modules not found, installing dependencies...${NC}"
  npm install
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: npm install failed!${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}node_modules found.${NC}"
fi

# Update proxy configuration to point to admin backend on port 4001
echo -e "${YELLOW}Updating proxy configuration...${NC}"
if grep -q '"proxy":' package.json; then
  sed -i 's/"proxy": "http:\/\/localhost:[0-9]\+/"proxy": "http:\/\/localhost:4001/' package.json
  echo -e "${GREEN}Updated proxy to http://localhost:4001${NC}"
else
  # Add proxy if not present
  sed -i 's/"browserslist": {/"proxy": "http:\/\/localhost:4001",\n  "browserslist": {/' package.json
  echo -e "${GREEN}Added proxy to http://localhost:4001${NC}"
fi

# Check React start script
echo -e "${YELLOW}Checking start script...${NC}"
if grep -q '"start":' package.json; then
  echo -e "${GREEN}Start script found.${NC}"
  
  # Update the start script to ensure PORT is set correctly
  if ! grep -q '"start": "PORT=3001 react-scripts start"' package.json; then
    sed -i 's/"start": "react-scripts start"/"start": "PORT=3001 react-scripts start"/' package.json
    sed -i 's/"start": "PORT=[0-9]\+ react-scripts start"/"start": "PORT=3001 react-scripts start"/' package.json
    echo -e "${GREEN}Updated start script to set PORT=3001${NC}"
  fi
else
  echo -e "${RED}Error: start script not found in package.json!${NC}"
  exit 1
fi

# Check public directory
echo -e "${YELLOW}Checking public directory...${NC}"
if [ ! -d "public" ]; then
  echo -e "${YELLOW}public directory not found, creating it...${NC}"
  mkdir -p public
  
  # Create minimal index.html
  echo -e "${YELLOW}Creating minimal index.html...${NC}"
  cat > public/index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Cosmic Synched Chains Admin Panel" />
    <title>CSC Admin Panel</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
fi

# Check src directory
echo -e "${YELLOW}Checking src directory...${NC}"
if [ ! -d "src" ]; then
  echo -e "${RED}Error: src directory not found!${NC}"
  exit 1
fi

# Test start the admin frontend in a new process
echo -e "${YELLOW}Test starting admin frontend...${NC}"
PORT=3001 npm start > /tmp/admin-frontend-debug.log 2>&1 &
FRONTEND_PID=$!
sleep 10

# Check if admin frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
  echo -e "${RED}Error: Failed to start admin frontend. Check debug log:${NC}"
  cat /tmp/admin-frontend-debug.log
  
  echo -e "\n${YELLOW}Attempting to reinstall dependencies...${NC}"
  npm ci
  
  echo -e "\n${YELLOW}Trying to start again with explicit port...${NC}"
  PORT=3001 BROWSER=none npm start > /tmp/admin-frontend-debug.log 2>&1 &
  FRONTEND_PID=$!
  sleep 10
  
  if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${RED}Error: Admin frontend still failed to start. See debug log for details.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}Admin frontend started successfully on port 3001 (PID: $FRONTEND_PID)${NC}"
fi

# Kill the test process
kill $FRONTEND_PID

echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN}          Admin Panel Frontend Fixed Successfully          ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${YELLOW}You can now run the services with:${NC}"
echo -e "${BLUE}./restart-services.sh${NC}"
echo ""