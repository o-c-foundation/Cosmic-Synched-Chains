#!/bin/bash

# PM2 Service Manager for Cosmos Deploy Platform (Improved Version)
# This script sets up and manages all services using PM2 with improved error handling

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ROOT_DIR="/root/Documents/cosmos-deploy-platform"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
ADMIN_DIR="$ROOT_DIR/admin-panel"
ADMIN_STATIC_DIR="$ADMIN_DIR/static-admin"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}          PM2 Service Manager Setup (Improved)             ${NC}"
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  Frontend: localhost:3000 → https://beta.syncron.network  ${NC}"
echo -e "${BLUE}  Backend:  localhost:4000 → https://beta.syncron.network/api${NC}"
echo -e "${BLUE}  Admin UI: localhost:3001 (static HTML/JS version)        ${NC}"
echo -e "${BLUE}  Admin API: localhost:4001                                ${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Step 1: Check if PM2 is installed
echo -e "${YELLOW}Step 1: Checking if PM2 is installed...${NC}"
if ! command -v pm2 &> /dev/null; then
  echo -e "PM2 not found. Installing PM2 globally..."
  npm install -g pm2
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install PM2. Please install it manually with:${NC}"
    echo -e "npm install -g pm2"
    exit 1
  else
    echo -e "${GREEN}PM2 installed successfully.${NC}"
  fi
else
  echo -e "${GREEN}PM2 is already installed.${NC}"
fi

# Step 2: Kill all existing Node.js processes
echo -e "\n${YELLOW}Step 2: Stopping all existing processes...${NC}"
echo -e "Stopping all PM2 processes if any exist..."
pm2 delete all 2>/dev/null

echo -e "Stopping processes on relevant ports..."
for PORT in 3000 3001 4000 4001 5000; do
  PID=$(lsof -ti:$PORT)
  if [ ! -z "$PID" ]; then
    echo -e "Stopping service on port $PORT (PID: $PID)..."
    kill -9 $PID 2>/dev/null
    sleep 1
  else
    echo -e "No service running on port $PORT"
  fi
done

# Step 3: Update backend files to ensure health endpoint exists
echo -e "\n${YELLOW}Step 3: Updating backend health endpoints...${NC}"
cd "$BACKEND_DIR" || { echo -e "${RED}Backend directory not found!${NC}"; exit 1; }

# Create or update healthRoutes.js
HEALTH_ROUTES_PATH="$BACKEND_DIR/src/routes/healthRoutes.js"
if [ ! -f "$HEALTH_ROUTES_PATH" ]; then
  echo -e "Creating health routes file..."
  mkdir -p "$(dirname "$HEALTH_ROUTES_PATH")"
  cat > "$HEALTH_ROUTES_PATH" << EOF
const express = require('express');
const router = express.Router();

// Simple health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Service is up and running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
EOF
  echo -e "${GREEN}Health routes file created.${NC}"
fi

# Update server.js to include health routes
SERVER_PATH="$BACKEND_DIR/src/server.js"
if [ -f "$SERVER_PATH" ]; then
  # Add healthRoutes import if not present
  if ! grep -q "healthRoutes" "$SERVER_PATH"; then
    echo -e "Updating server.js to import health routes..."
    # Find the last import line and add healthRoutes import after it
    sed -i '/^const.*require/a const healthRoutes = require('"'"'./routes/healthRoutes'"'"');' "$SERVER_PATH"
  fi
  
  # Add direct health endpoint if not present
  if ! grep -q "app.get('/health'" "$SERVER_PATH"; then
    echo -e "Adding direct health endpoint to server.js..."
    # Find the middleware section and add health endpoint after it
    sed -i '/app.use/i \
// Direct health endpoint (accessible at /health)\
app.get('"'"'/health'"'"', (req, res) => {\
  res.status(200).json({ \
    status: '"'"'OK'"'"',\
    message: '"'"'Service is up and running'"'"',\
    timestamp: new Date().toISOString()\
  });\
});\
' "$SERVER_PATH"
  fi
  
  # Update route setup to include /api prefix and health routes
  if ! grep -q "app.use('/api/health'" "$SERVER_PATH" && ! grep -q "app.use('/health'" "$SERVER_PATH"; then
    echo -e "Adding health routes to API routes..."
    # Find the routes section and add health routes
    sed -i 's|app.use.*/api/auth|app.use("/api/health", healthRoutes);\
app.use("/api/auth|' "$SERVER_PATH"
  fi
  
  echo -e "${GREEN}Server.js updated with health endpoints.${NC}"
else
  echo -e "${RED}Server.js not found at $SERVER_PATH!${NC}"
fi

# Step 4: Create PM2 ecosystem file
echo -e "\n${YELLOW}Step 4: Creating PM2 ecosystem configuration...${NC}"
cat > "$ROOT_DIR/ecosystem.config.js" << EOF
module.exports = {
  apps: [
    {
      name: "backend-api",
      cwd: "${BACKEND_DIR}",
      script: "src/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/tmp/backend-error.log",
      out_file: "/tmp/backend-out.log",
      merge_logs: true
    },
    {
      name: "frontend",
      cwd: "${FRONTEND_DIR}",
      script: "node_modules/.bin/react-scripts",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        BROWSER: "none",
        // Fix for allowedHosts error
        DANGEROUSLY_DISABLE_HOST_CHECK: true,
        WDS_SOCKET_HOST: "localhost",
        WDS_SOCKET_PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/tmp/frontend-error.log",
      out_file: "/tmp/frontend-out.log",
      merge_logs: true
    },
    {
      name: "admin-backend",
      cwd: "${ADMIN_DIR}/server",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 4001
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "300M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/tmp/admin-backend-error.log",
      out_file: "/tmp/admin-backend-out.log",
      merge_logs: true
    },
    {
      name: "admin-static",
      cwd: "${ADMIN_STATIC_DIR}",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "200M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/tmp/admin-static-error.log",
      out_file: "/tmp/admin-static-out.log",
      merge_logs: true
    }
  ]
};
EOF

echo -e "${GREEN}PM2 ecosystem file created at $ROOT_DIR/ecosystem.config.js${NC}"

# Step 5: Fix API routing in frontend
echo -e "\n${YELLOW}Step 5: Fixing API routing in frontend...${NC}"
cd "$FRONTEND_DIR" || { echo -e "${RED}Frontend directory not found!${NC}"; exit 1; }

# Update proxy in package.json
if grep -q '"proxy":' package.json; then
  echo -e "Updating proxy configuration in package.json..."
  # Replace any proxy with the correct one
  sed -i 's|"proxy": "http://localhost:[0-9]\+.*"|"proxy": "https://beta.syncron.network/api"|g' package.json
  echo -e "${GREEN}Frontend proxy updated to https://beta.syncron.network/api${NC}"
else
  echo -e "Adding proxy configuration to package.json..."
  # Add proxy before the last closing brace
  sed -i '/"browserslist": {/i\  "proxy": "https://beta.syncron.network/api",' package.json
  echo -e "${GREEN}Frontend proxy added as https://beta.syncron.network/api${NC}"
fi

# Step 6: Set up static admin panel if not already configured
echo -e "\n${YELLOW}Step 6: Setting up static admin panel...${NC}"
if [ ! -d "$ADMIN_STATIC_DIR" ]; then
  echo -e "${RED}Static admin directory not found. Creating it...${NC}"
  mkdir -p "$ADMIN_STATIC_DIR"
fi

# Step 7: Start services with PM2
echo -e "\n${YELLOW}Step 7: Starting services with PM2...${NC}"
cd "$ROOT_DIR" || { echo -e "${RED}Root directory not found!${NC}"; exit 1; }

echo -e "Starting all services using PM2..."
pm2 start ecosystem.config.js

# Wait for services to start
echo -e "Waiting for services to initialize..."
sleep 10

# Step 8: Verify connectivity
echo -e "\n${YELLOW}Step 8: Verifying connectivity...${NC}"

# Test backend connectivity with improved error handling
echo -e "Testing backend connectivity on port 4000..."
BACKEND_HEALTH_OK=false

# Try /health endpoint
if curl -s http://localhost:4000/health > /dev/null; then
  echo -e "${GREEN}Backend is responding on port 4000 at /health${NC}"
  BACKEND_HEALTH_OK=true
# Try /api/health endpoint
elif curl -s http://localhost:4000/api/health > /dev/null; then
  echo -e "${GREEN}Backend is responding on port 4000 at /api/health${NC}"
  BACKEND_HEALTH_OK=true
else
  echo -e "${RED}Backend is not responding on port 4000${NC}"
  echo -e "${YELLOW}Trying to restart backend...${NC}"
  pm2 restart backend-api
  sleep 5
  
  # Try again after restart
  if curl -s http://localhost:4000/health > /dev/null; then
    echo -e "${GREEN}Backend is now responding at /health after restart${NC}"
    BACKEND_HEALTH_OK=true
  elif curl -s http://localhost:4000/api/health > /dev/null; then
    echo -e "${GREEN}Backend is now responding at /api/health after restart${NC}"
    BACKEND_HEALTH_OK=true
  else
    echo -e "${RED}Backend still not responding after restart${NC}"
    echo -e "${YELLOW}Checking logs...${NC}"
    tail -n 20 /tmp/backend-error.log
  fi
fi

# Test frontend connectivity
echo -e "Testing frontend connectivity on port 3000..."
if curl -s http://localhost:3000 | grep -q "html"; then
  echo -e "${GREEN}Frontend is responding on port 3000${NC}"
else
  echo -e "${RED}Frontend is not responding on port 3000${NC}"
  echo -e "${YELLOW}Trying to restart frontend...${NC}"
  pm2 restart frontend
  sleep 10
  
  # Try again after restart
  if curl -s http://localhost:3000 | grep -q "html"; then
    echo -e "${GREEN}Frontend is now responding after restart${NC}"
  else
    echo -e "${RED}Frontend still not responding after restart${NC}"
    echo -e "${YELLOW}Checking logs...${NC}"
    tail -n 20 /tmp/frontend-error.log
  fi
fi

# Test admin static panel connectivity
echo -e "Testing admin panel connectivity on port 3001..."
if curl -s http://localhost:3001 | grep -q "html"; then
  echo -e "${GREEN}Admin panel is responding on port 3001${NC}"
else
  echo -e "${RED}Admin panel is not responding on port 3001${NC}"
  echo -e "${YELLOW}Trying to restart admin panel...${NC}"
  pm2 restart admin-static
  sleep 5
  
  # Try again after restart
  if curl -s http://localhost:3001 | grep -q "html"; then
    echo -e "${GREEN}Admin panel is now responding after restart${NC}"
  else
    echo -e "${RED}Admin panel still not responding after restart${NC}"
    echo -e "${YELLOW}Checking logs...${NC}"
    tail -n 20 /tmp/admin-static-error.log
  fi
fi

# Test admin backend connectivity
echo -e "Testing admin backend connectivity on port 4001..."
if curl -s http://localhost:4001/health > /dev/null; then
  echo -e "${GREEN}Admin backend is responding on port 4001${NC}"
else
  echo -e "${RED}Admin backend is not responding on port 4001${NC}"
  echo -e "${YELLOW}Trying to restart admin backend...${NC}"
  pm2 restart admin-backend
  sleep 5
  
  # Try again after restart
  if curl -s http://localhost:4001/health > /dev/null; then
    echo -e "${GREEN}Admin backend is now responding after restart${NC}"
  else
    echo -e "${RED}Admin backend still not responding after restart${NC}"
    echo -e "${YELLOW}Checking logs...${NC}"
    tail -n 20 /tmp/admin-backend-error.log
  fi
fi

# Test domain connectivity with improved checks
echo -e "Testing domain connectivity..."
if curl -s https://beta.syncron.network --insecure | grep -q "html"; then
  echo -e "${GREEN}Domain proxy to frontend is working${NC}"
else
  echo -e "${YELLOW}Could not verify domain proxy to frontend${NC}"
  echo -e "${YELLOW}This might be expected if running on a development environment${NC}"
fi

# Try both health endpoint paths for backend API
if curl -s https://beta.syncron.network/api/health --insecure > /dev/null; then
  echo -e "${GREEN}Domain proxy to backend API is working at /api/health${NC}"
elif curl -s https://beta.syncron.network/health --insecure > /dev/null; then
  echo -e "${GREEN}Domain proxy to backend API is working at /health${NC}"
else
  echo -e "${YELLOW}Could not verify domain proxy to backend API${NC}"
  echo -e "${YELLOW}This might be expected if the proxy is not configured correctly${NC}"
  
  if [ "$BACKEND_HEALTH_OK" = true ]; then
    echo -e "${YELLOW}Backend is running, but domain proxy might need configuration${NC}"
    echo -e "${YELLOW}Check Apache/Nginx configuration to ensure proper forwarding of API requests${NC}"
  fi
fi

# Step 9: Save PM2 configuration
echo -e "\n${YELLOW}Step 9: Saving PM2 configuration...${NC}"
pm2 save

# Setup PM2 to start on system boot (if running as root)
if [ "$(id -u)" = "0" ]; then
  echo -e "Setting up PM2 to start on system boot..."
  pm2 startup
  
  # Check if successful
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}PM2 startup script installed. Services will start automatically on system boot.${NC}"
  else
    echo -e "${RED}Failed to install PM2 startup script.${NC}"
  fi
else
  echo -e "${YELLOW}Not running as root, skipping PM2 startup configuration.${NC}"
  echo -e "To configure PM2 to start on system boot, run: sudo pm2 startup"
fi

# Display PM2 status
echo -e "\n${YELLOW}Current PM2 status:${NC}"
pm2 status

# Summary
echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   PM2 Service Manager Setup Complete                  ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   Services are now managed by PM2:                    ║${NC}"
echo -e "${GREEN}║   - backend-api: Main backend on port 4000            ║${NC}"
echo -e "${GREEN}║   - frontend: Main frontend on port 3000              ║${NC}"
echo -e "${GREEN}║   - admin-backend: Admin API on port 4001             ║${NC}"
echo -e "${GREEN}║   - admin-static: Admin UI on port 3001               ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   Useful PM2 commands:                                ║${NC}"
echo -e "${GREEN}║   - pm2 status                View all processes      ║${NC}"
echo -e "${GREEN}║   - pm2 logs                  View all logs           ║${NC}"
echo -e "${GREEN}║   - pm2 logs [service]        View specific logs      ║${NC}"
echo -e "${GREEN}║   - pm2 restart [service]     Restart a service       ║${NC}"
echo -e "${GREEN}║   - pm2 stop [service]        Stop a service          ║${NC}"
echo -e "${GREEN}║   - pm2 start [service]       Start a service         ║${NC}"
echo -e "${GREEN}║   - pm2 monit                 Monitor all processes   ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"