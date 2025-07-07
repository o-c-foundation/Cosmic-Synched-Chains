#!/bin/bash

# Cosmos Deploy Platform - Run Script
# This script starts the application's frontend and backend servers

set -e

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==== Cosmos Deploy Platform ====${NC}"

# Check if MongoDB is running
check_mongodb() {
  echo -e "${BLUE}Checking MongoDB status...${NC}"
  if command -v mongod &> /dev/null; then
    if pgrep mongod > /dev/null; then
      echo -e "${GREEN}MongoDB is running.${NC}"
      return 0
    else
      echo -e "${YELLOW}MongoDB is not running. Attempting to start...${NC}"
      if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
      elif command -v brew &> /dev/null; then
        brew services start mongodb-community
      else
        mongod --fork --logpath /tmp/mongodb.log
      fi
      
      # Check if MongoDB started successfully
      if [ $? -eq 0 ]; then
        echo -e "${GREEN}MongoDB started successfully.${NC}"
        return 0
      else
        echo -e "${RED}Failed to start MongoDB. Please start it manually.${NC}"
        return 1
      fi
    fi
  else
    echo -e "${YELLOW}MongoDB not found. Please install MongoDB or ensure it's in your PATH.${NC}"
    echo -e "${YELLOW}Continue anyway? The application may not function correctly without a database.${NC}"
    read -p "Continue (y/n)? " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      return 0
    else
      return 1
    fi
  fi
}

# Start backend server
start_backend() {
  echo -e "${BLUE}Starting backend server...${NC}"
  cd cosmos-deploy-platform/backend
  
  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
  fi
  
  # Start the backend server in a new terminal
  if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- npm run dev
  elif command -v xterm &> /dev/null; then
    xterm -e "npm run dev" &
  elif command -v osascript &> /dev/null; then
    # macOS approach
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run dev"'
  else
    # Fallback: start in background
    echo -e "${YELLOW}No terminal emulator found. Starting backend in background.${NC}"
    npm run dev &
    BACKEND_PID=$!
    echo -e "${GREEN}Backend started with PID: $BACKEND_PID${NC}"
  fi
  
  echo -e "${GREEN}Backend server starting on http://localhost:5000${NC}"
  cd ../..
}

# Start frontend server
start_frontend() {
  echo -e "${BLUE}Starting frontend server...${NC}"
  cd cosmos-deploy-platform/frontend
  
  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
  fi
  
  # Check if package.json contains start script
  if grep -q "\"start\":" package.json; then
    START_CMD="npm start"
  else
    # If there's no start script, add one temporarily
    echo -e "${YELLOW}No start script found in package.json, using 'react-scripts start'${NC}"
    START_CMD="npx react-scripts start"
  fi
  
  # Start the frontend server in a new terminal
  if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "$START_CMD"
  elif command -v xterm &> /dev/null; then
    xterm -e "$START_CMD" &
  elif command -v osascript &> /dev/null; then
    # macOS approach
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && '"$START_CMD"'"'
  else
    # Fallback: start in background
    echo -e "${YELLOW}No terminal emulator found. Starting frontend in background.${NC}"
    $START_CMD &
    FRONTEND_PID=$!
    echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
  fi
  
  echo -e "${GREEN}Frontend server starting on http://localhost:3000${NC}"
  cd ../..
}

# Main execution flow
main() {
  # Check if the project structure exists
  if [ ! -d "cosmos-deploy-platform" ]; then
    echo -e "${RED}Error: Project directory not found.${NC}"
    echo -e "${YELLOW}Have you run the setup script (setup-cosmos-deploy-platform.sh) first?${NC}"
    exit 1
  fi
  
  # Check MongoDB status
  check_mongodb || exit 1
  
  # Start backend
  start_backend
  
  # Give backend a moment to start
  echo -e "${YELLOW}Waiting for backend to initialize...${NC}"
  sleep 3
  
  # Start frontend
  start_frontend
  
  # Display success message
  echo -e "\n${GREEN}=====================================${NC}"
  echo -e "${GREEN}Cosmos Deploy Platform is starting up!${NC}"
  echo -e "${GREEN}=====================================${NC}"
  echo -e "Backend API: ${BLUE}http://localhost:5000${NC}"
  echo -e "Frontend UI: ${BLUE}http://localhost:3000${NC}"
  echo -e "\n${YELLOW}Note: It may take a few moments for both services to fully initialize.${NC}"
  echo -e "${YELLOW}Press Ctrl+C to shut down the services when you're done.${NC}"
  
  # Keep the script running
  echo -e "\n${BLUE}Monitoring logs...${NC}"
  echo -e "${YELLOW}(Press Ctrl+C to stop)${NC}"
  
  # Wait for user to press Ctrl+C
  trap 'echo -e "\n${GREEN}Shutting down Cosmos Deploy Platform...${NC}"; cleanup' INT
  tail -f /dev/null
}

# Cleanup function
cleanup() {
  echo -e "${BLUE}Stopping services...${NC}"
  
  # Stop background processes if we have their PIDs
  if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
  fi
  
  if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
  fi
  
  # Try to find and kill node processes related to our app
  echo -e "${YELLOW}Stopping any remaining processes...${NC}"
  pkill -f "node.*cosmos-deploy-platform" 2>/dev/null || true
  
  echo -e "${GREEN}Cosmos Deploy Platform stopped.${NC}"
  exit 0
}

# Run the main function
main