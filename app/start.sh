#!/bin/bash
# Railway start script for frontend
if [ ! -d dist ]; then
  echo "ERROR: dist folder not found!"
  exit 1
fi

# Use Railway's PORT environment variable
PORT=${PORT:-8080}
echo "Starting serve on 0.0.0.0:$PORT..."

# Start serve with 0.0.0.0 to bind to all interfaces (required for Railway)
npx serve -s dist -l 0.0.0.0:$PORT

