const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router - serve index.html for all routes (Express 5 compatible)
app.use((req, res, next) => {
  // If request is for a file that doesn't exist, serve index.html
  if (req.path.startsWith('/api')) {
    return next(); // Don't interfere with API routes
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on http://0.0.0.0:${PORT}`);
});

