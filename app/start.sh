#!/bin/bash
# Railway start script for frontend
if [ ! -d dist ]; then
  echo "ERROR: dist folder not found!"
  exit 1
fi

# Use Railway's PORT environment variable
PORT=${PORT:-8080}
echo "Starting Express server on 0.0.0.0:$PORT..."

# Use Express to serve static files (guaranteed 0.0.0.0 binding)
node serve-frontend.js

