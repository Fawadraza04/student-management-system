// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Debug: Log API URL in development
if (import.meta.env.DEV) {
  console.log("🔍 API_BASE_URL:", API_BASE_URL);
  console.log("🔍 VITE_API_URL env:", import.meta.env.VITE_API_URL);
}

export default API_BASE_URL;

