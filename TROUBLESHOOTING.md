# 🔧 Troubleshooting Guide

## Register/Login Nahin Ho Raha

### Step 1: Backend Server Check Karo
1. Terminal kholo
2. Check karo backend server running hai ya nahi
3. Agar nahi hai, to:
   ```bash
   cd app
   node server.js
   ```
4. Terminal mein dikhna chahiye:
   - `Server running on port 5000`
   - `DB connected` (agar MongoDB connected hai)

### Step 2: MongoDB Connection Check Karo
1. Agar "DB Error" dikhe terminal mein:
   - MongoDB locally install karo, ya
   - MongoDB Atlas connection string use karo

2. MongoDB Atlas use karne ke liye:
   - `.env` file banao `app` folder mein:
     ```
     MONGODB_URI=mongodb+srv://fawadraza:raza2018@cluster0.xxxxx.mongodb.net/stu3
     JWT_SECRET=your-secret-key
     ```
   - Server restart karo

### Step 3: Browser Console Check Karo
1. Browser mein F12 press karo
2. "Console" tab check karo
3. Koi error dikh raha hai?
   - `Network Error` = Backend server nahi chal raha
   - `CORS Error` = Backend CORS settings check karo
   - `404 Error` = API endpoint wrong hai

### Step 4: Network Tab Check Karo
1. F12 → "Network" tab
2. Register/Login try karo
3. `/api/auth/register` ya `/api/auth/login` request check karo
4. Response status check karo:
   - `200` = Success
   - `400` = Bad request (validation error)
   - `500` = Server error
   - `Failed` = Network error (backend nahi chal raha)

### Step 5: API URL Check Karo
1. Browser console mein type karo:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
2. Ya `app/src/config/api.js` check karo
3. Default: `http://localhost:5000` hona chahiye

## Common Errors aur Solutions

### Error 1: "Cannot connect to server"
**Solution:** Backend server start karo
```bash
cd app
node server.js
```

### Error 2: "DB Error" ya "MongoDB connection failed"
**Solution:** 
- MongoDB locally install karo, ya
- MongoDB Atlas connection string use karo

### Error 3: "Admin already exists"
**Solution:** Different email/username use karo

### Error 4: "Invalid credentials"
**Solution:** 
- Pehle register karo
- Phir same email/password se login karo

### Error 5: CORS Error
**Solution:** Backend mein CORS already enabled hai, check karo `server.js` mein

## Quick Test

1. **Backend Test:**
   ```bash
   curl http://localhost:5000/api/auth/verify
   ```
   Ya browser mein: `http://localhost:5000/api/auth/verify`
   - Agar error aaye = Backend nahi chal raha
   - Agar response aaye = Backend theek hai

2. **Frontend Test:**
   - Browser: `http://localhost:5173`
   - Console check karo (F12)

## Still Not Working?

1. Backend server logs check karo
2. Browser console errors share karo
3. Network tab screenshots share karo





