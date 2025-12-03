const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  fallthrough: true // Allow fallthrough to next middleware if file not found
}));

// Handle React Router - serve index.html for all non-API routes (Express 5 compatible)
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Check if file exists in dist
  const filePath = path.join(__dirname, 'dist', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return next(); // Let static middleware handle it
  }
  
  // Serve index.html for React Router
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist')}`);
});

