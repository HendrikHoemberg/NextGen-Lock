#!/bin/bash

echo "Installing NextGen-Lock dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed successfully"
else
    echo "✗ Failed to install backend dependencies"
    exit 1
fi
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed successfully"
else
    echo "✗ Failed to install frontend dependencies"
    exit 1
fi
echo ""

echo "All dependencies installed successfully!"
