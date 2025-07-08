#!/bin/bash

# Static Admin Panel Starter
# This script starts the static admin panel on port 3001

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ADMIN_DIR="/root/Documents/cosmos-deploy-platform/admin-panel"
STATIC_DIR="$ADMIN_DIR/static-admin"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}          Static Admin Panel Launcher                      ${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Check if static admin directory exists
if [ ! -d "$STATIC_DIR" ]; then
  echo -e "${RED}Error: Static admin directory not found at $STATIC_DIR${NC}"
  exit 1
fi

# Change to static admin directory
cd "$STATIC_DIR" || exit 1
echo -e "${YELLOW}Current directory: $(pwd)${NC}"

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

# Start the static admin server
echo -e "${YELLOW}Starting static admin server...${NC}"
node server.js > /tmp/static-admin.log 2>&1 &
ADMIN_PID=$!
sleep 2

# Check if server started successfully
if ! ps -p $ADMIN_PID > /dev/null; then
  echo -e "${RED}Error: Failed to start static admin server. Check logs:${NC}"
  cat /tmp/static-admin.log
  exit 1
else
  echo -e "${GREEN}Static admin server started successfully on port 3001 (PID: $ADMIN_PID)${NC}"
fi

# Test if server is responding
echo -e "${YELLOW}Testing if server is responding...${NC}"
if curl -s http://localhost:3001 | grep -q "Cosmic Synched Chains Admin"; then
  echo -e "${GREEN}Static admin server is responding correctly on http://localhost:3001${NC}"
else
  echo -e "${RED}Static admin server is not responding correctly on http://localhost:3001${NC}"
  echo -e "${YELLOW}Check logs at /tmp/static-admin.log${NC}"
fi

echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   Static Admin Panel is now running!                  ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   - URL: http://localhost:3001                        ║${NC}"
echo -e "${GREEN}║   - PID: $ADMIN_PID                                 ║${NC}"
echo -e "${GREEN}║   - Logs: /tmp/static-admin.log                       ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"