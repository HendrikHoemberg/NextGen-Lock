#!/bin/bash

echo -e "\033[1;36mStarting NextGen Lock Backend and Frontend...\033[0m"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install Backend Dependencies
echo -e "\n\033[1;33mInstalling Backend Dependencies...\033[0m"
cd "$SCRIPT_DIR/backend"
npm install

# Install Frontend Dependencies
echo -e "\n\033[1;33mInstalling Frontend Dependencies...\033[0m"
cd "$SCRIPT_DIR/frontend"
npm install

# Return to root
cd "$SCRIPT_DIR"

# Start Backend in background
echo -e "\n\033[1;33mStarting Backend Server on port 5000...\033[0m"
cd "$SCRIPT_DIR/backend"
npm start &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3

# Trap to cleanup backend on exit
trap "echo -e '\n\033[1;33mStopping backend server...\033[0m'; kill $BACKEND_PID 2>/dev/null" EXIT

# Start Frontend
echo -e "\033[1;33mStarting Frontend Server on port 3000...\033[0m"
echo -e "\n\033[1;32mServers running!\033[0m"
echo -e "\033[1;32mBackend: http://localhost:5000\033[0m"
echo -e "\033[1;32mFrontend: http://localhost:3000\033[0m"
echo -e "\n\033[1;36mPress Ctrl+C to stop both servers\033[0m\n"

cd "$SCRIPT_DIR/frontend"
npm run dev
