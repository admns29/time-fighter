#!/bin/bash
CYAN="\033[0;36m"
NC="\033[0m"

clear

echo -e "  ${CYAN}          =========================================${NC}"
echo -e "  ${CYAN}          ||   Starting Backend on Port 8080...  ||  ${NC}"
echo -e "  ${CYAN}          =========================================${NC}"
echo ""
cd "$(dirname "$0")/backend"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${CYAN}Error: Maven is not installed. Please install Maven first.${NC}"
    exit 1
fi

# Start the Spring Boot application
mvn spring-boot:run
