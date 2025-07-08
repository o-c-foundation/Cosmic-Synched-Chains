#!/bin/bash

# PM2 Service Manager for Cosmos Deploy Platform (Simple Version)
# This script sets up and manages all services using PM2

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
echo -e "${BLUE}          PM2 Service Manager Setup (Simple)               ${NC}"
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

# Step 3: Create PM2 ecosystem file
echo -e "\n${YELLOW}Step 3: Creating PM2 ecosystem configuration...${NC}"
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
        DANGEROUSLY_DISABLE_HOST_CHECK: true
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

# Step 4: Start services with PM2
echo -e "\n${YELLOW}Step 4: Starting services with PM2...${NC}"
cd "$ROOT_DIR" || { echo -e "${RED}Root directory not found!${NC}"; exit 1; }

echo -e "Starting all services using PM2..."
pm2 start ecosystem.config.js

# Wait for services to start
echo -e "Waiting for services to initialize..."
sleep 10

# Step 5: Verify connectivity
echo -e "\n${YELLOW}Step 5: Verifying connectivity...${NC}"

# Test backend connectivity with improved error handling
echo -e "Testing backend connectivity on port 4000..."
if curl -s http://localhost:4000/health > /dev/null; then
  echo -e "${GREEN}Backend is responding on port 4000 at /health${NC}"
elif curl -s http://localhost:4000/api/health > /dev/null; then
  echo -e "${GREEN}Backend is responding on port 4000 at /api/health${NC}"
else
  echo -e "${RED}Backend is not responding on port 4000${NC}"
  echo -e "${YELLOW}Check backend logs with: pm2 logs backend-api${NC}"
fi

# Test frontend connectivity
echo -e "Testing frontend connectivity on port 3000..."
if curl -s http://localhost:3000 | grep -q "html"; then
  echo -e "${GREEN}Frontend is responding on port 3000${NC}"
else
  echo -e "${RED}Frontend is not responding on port 3000${NC}"
  echo -e "${YELLOW}Check frontend logs with: pm2 logs frontend${NC}"
fi

# Test admin static panel connectivity
echo -e "Testing admin panel connectivity on port 3001..."
if curl -s http://localhost:3001 | grep -q "html"; then
  echo -e "${GREEN}Admin panel is responding on port 3001${NC}"
else
  echo -e "${RED}Admin panel is not responding on port 3001${NC}"
  echo -e "${YELLOW}Check admin panel logs with: pm2 logs admin-static${NC}"
fi

# Test admin backend connectivity
echo -e "Testing admin backend connectivity on port 4001..."
if curl -s http://localhost:4001/health > /dev/null; then
  echo -e "${GREEN}Admin backend is responding on port 4001${NC}"
else
  echo -e "${RED}Admin backend is not responding on port 4001${NC}"
  echo -e "${YELLOW}Check admin backend logs with: pm2 logs admin-backend${NC}"
fi

# Test domain connectivity
echo -e "Testing domain connectivity..."
if curl -s https://beta.syncron.network --insecure | grep -q "html"; then
  echo -e "${GREEN}Domain proxy to frontend is working${NC}"
else
  echo -e "${YELLOW}Could not verify domain proxy to frontend${NC}"
fi

if curl -s https://beta.syncron.network/api/health --insecure > /dev/null; then
  echo -e "${GREEN}Domain proxy to backend API is working at /api/health${NC}"
elif curl -s https://beta.syncron.network/health --insecure > /dev/null; then
  echo -e "${GREEN}Domain proxy to backend API is working at /health${NC}"
else
  echo -e "${YELLOW}Could not verify domain proxy to backend API${NC}"
fi

# Step 6: Save PM2 configuration
echo -e "\n${YELLOW}Step 6: Saving PM2 configuration...${NC}"
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

# Step 7: Show logs for any failing services
echo -e "\n${YELLOW}Step 7: Checking for service errors...${NC}"
for SERVICE in backend-api frontend admin-backend admin-static; do
  if ! pm2 show $SERVICE | grep -q "online"; then
    echo -e "${RED}Service $SERVICE is not running correctly. Here are the logs:${NC}"
    pm2 logs $SERVICE --lines 20
  fi
done

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