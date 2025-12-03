#!/bin/bash
# Railway start script for frontend
if [ ! -d dist ]; then
  echo "ERROR: dist folder not found!"
  exit 1
fi

# Use Railway's PORT environment variable
PORT=${PORT:-8080}
echo "Starting serve on port $PORT..."

# Start serve - Railway automatically binds to 0.0.0.0
npx serve -s dist -l $PORT

