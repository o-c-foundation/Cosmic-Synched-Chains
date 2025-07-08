#!/bin/bash

# Cosmic Synched Chains Admin Panel Launcher
# This script starts both the backend and frontend of the admin panel

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Banner
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║   Cosmic Synched Chains - Admin Panel Launcher        ║"
echo "║                                                       ║"
echo "║   MAIN APP: FRONTEND (PORT 3000) → beta.syncron.network    ║"
echo "║   MAIN APP: BACKEND  (PORT 4000) → beta.syncron.network/api ║"
echo "║   ADMIN PANEL:       (PORT 3001) → localhost only     ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/server"
FRONTEND_DIR="$ROOT_DIR/client"

echo -e "${BLUE}Starting Admin Panel...${NC}"
echo -e "Root directory: ${YELLOW}$ROOT_DIR${NC}"

# Check if directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Error: Backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Function to cleanup on exit
function cleanup {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    
    # Kill the backend server
    if [ ! -z "$BACKEND_PID" ]; then
        echo -e "Stopping backend server (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
    fi
    
    # Kill the frontend server
    if [ ! -z "$FRONTEND_PID" ]; then
        echo -e "Stopping frontend server (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    echo -e "${GREEN}Admin panel stopped successfully.${NC}"
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Start backend server
echo -e "\n${BLUE}Starting backend server...${NC}"
cd "$BACKEND_DIR"

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

# Start the backend server
node server.js > /tmp/admin-backend.log 2>&1 &
BACKEND_PID=$!

# Check if backend started successfully
sleep 2
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}Error: Failed to start backend server. Check logs at /tmp/admin-backend.log${NC}"
    exit 1
else
    echo -e "${GREEN}Backend server started successfully on http://localhost:4000${NC}"
    echo -e "Backend PID: ${YELLOW}$BACKEND_PID${NC}"
fi

# Start frontend server
echo -e "\n${BLUE}Starting frontend server...${NC}"
cd "$FRONTEND_DIR"

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Start the frontend server
npm start > /tmp/admin-frontend.log 2>&1 &
FRONTEND_PID=$!

# Check if frontend started successfully
sleep 5
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${RED}Error: Failed to start frontend server. Check logs at /tmp/admin-frontend.log${NC}"
    kill $BACKEND_PID
    exit 1
else
    echo -e "${GREEN}Frontend server started successfully on http://localhost:3001${NC}"
    echo -e "Frontend PID: ${YELLOW}$FRONTEND_PID${NC}"
fi

# Success message
echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   Admin Panel is now running!                         ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   - Admin Frontend: http://localhost:3001             ║${NC}"
echo -e "${GREEN}║   - Admin Backend API: http://localhost:4000          ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   MAIN APP:                                           ║${NC}"
echo -e "${GREEN}║   - Frontend UI: https://beta.syncron.network/        ║${NC}"
echo -e "${GREEN}║   - Backend API: https://beta.syncron.network/api     ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║   Press Ctrl+C to stop the admin servers              ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"

# Wait for user to press Ctrl+C
wait $BACKEND_PID $FRONTEND_PID