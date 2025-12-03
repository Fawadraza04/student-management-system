#!/bin/bash
# Railway start script for frontend
if [ ! -d dist ]; then
  echo "ERROR: dist folder not found!"
  exit 1
fi

# Use Railway's PORT environment variable
PORT=${PORT:-8080}
echo "Starting serve on 0.0.0.0:$PORT..."

# Set HOST to 0.0.0.0 for Railway (serve package uses HOST env var)
export HOST=0.0.0.0

# Start serve with host binding
npx serve -s dist -l $PORT

