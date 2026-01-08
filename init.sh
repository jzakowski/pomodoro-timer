#!/bin/bash

# Pomodoro Timer - Development Environment Setup Script
# This script sets up and runs the development environment

set -e  # Exit on error

echo "🍅 Pomodoro Timer - Development Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check if .env.local exists, if not create it
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    touch .env.local
    echo -e "${GREEN}✓ .env.local created${NC}"
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    mkdir -p logs
fi

# Create tests directories if they don't exist
mkdir -p tests/verification
mkdir -p tests/scripts
mkdir -p tests/screenshots

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start development server (port 3000)"
echo "  npm run build        - Build for production"
echo "  npm run start        - Start production server"
echo "  npm run lint         - Run ESLint"
echo "  npm run type-check   - Run TypeScript type check"
echo ""
echo "Starting development server..."
echo ""

# Start the development server
npm run dev
