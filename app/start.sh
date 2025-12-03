#!/bin/bash
# Railway start script for frontend
if [ ! -d dist ]; then
  echo "ERROR: dist folder not found!"
  exit 1
fi

# Use Railway's PORT environment variable
PORT=${PORT:-8080}
echo "Starting server on port $PORT..."

# Simple solution: Use serve with explicit host binding via environment
HOST=0.0.0.0 PORT=$PORT npx serve -s dist -l $PORT

