#!/bin/bash
# Railway start script for frontend
if [ ! -d dist ]; then
  echo "ERROR: dist folder not found!"
  exit 1
fi

# Use Railway's PORT environment variable
PORT=${PORT:-8080}
echo "Starting serve on 0.0.0.0:$PORT..."

# Use http-server instead of serve (better Railway support)
npx http-server dist -p $PORT -a 0.0.0.0 --cors

