#!/bin/bash
set -e

# Pull the Docker image from Docker Hub
echo "Pulling the Docker image from Docker Hub..."
docker pull n9i/dark-backend:latest


# Run the Docker image as a container
echo "Running the Docker container..."
docker run -d --name dark-backend -p 8000:8000 n9i/dark-backend:latest
echo "Docker container is running. You can access the backend at http://localhost:8000"