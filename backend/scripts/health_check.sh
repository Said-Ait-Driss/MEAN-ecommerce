#!/bin/bash
set -e

# check the health of the application
HEALTH_CHECK_URL="http://localhost:8080/health"
response=$(curl --write-out "%{http_code}" --silent --output /dev/null "$HEALTH_CHECK_URL")
if [ "$response" -ne 200 ]; then
  echo "Health check failed with response code: $response"
  exit 1
else
  echo "Health check passed with response code: $response"
fi