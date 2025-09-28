#!/bin/bash
set -e

# Stop the running container (if any)
echo "Stopping the Docker container..."
docker stop dark-backend || echo "No running container named 'dark-backend' to stop."
# Remove the stopped container
echo "Removing the Docker container..."
docker rm dark-backend || echo "No container named 'dark-backend' to remove."