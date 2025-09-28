#!/bin/bash
set -e
# Validate the service is running correctly
SERVICE_URL="http://localhost:8000"
response=$(curl --write-out "%{http_code}" --silent --output /dev/null "$SERVICE_URL")
if [ "$response" -ne 200 ]; then
  echo "Service validation failed with response code: $response"
  exit 1
else
  echo "Service validation passed with response code: $response"
fi