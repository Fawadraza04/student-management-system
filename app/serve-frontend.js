const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'dist');

// Serve static files
app.use(express.static(DIST_DIR));

// Catch-all handler for React Router - must be last
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Start server on 0.0.0.0 (all interfaces) for Railway
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving files from: ${DIST_DIR}`);
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

