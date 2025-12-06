#!/bin/bash
RED="\033[0;31m"
NC="\033[0m"

clear

echo -e "     ${RED}      =========================================${NC}"
echo -e "     ${RED}      ||   Starting Frontend on Port 3000... || ${NC}"
echo -e "     ${RED}      =========================================${NC}"
echo ""

cd "$(dirname "$0")/frontend"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${RED}Installing dependencies...${NC}"
    npm install
fi

# Start the development server
npm run dev
