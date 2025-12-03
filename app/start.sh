#!/bin/bash
# Railway start script for frontend
if [ ! -d dist ]; then
  echo "ERROR: dist folder not found!"
  exit 1
fi

# Use Railway's PORT environment variable
PORT=${PORT:-8080}
echo "Starting Express server on 0.0.0.0:$PORT..."

# Use Express server (guaranteed to work with Railway)
node serve-frontend.js

