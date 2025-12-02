# 🔧 Railway Backend Service Fix

## Problem
Railway backend service ke liye bhi frontend build karne ki koshish kar raha hai.

## Solution
Railway settings mein explicitly build command override karo.

## Steps

### Option 1: Railway Dashboard Se (Recommended)

1. Railway dashboard → Backend service
2. "Settings" tab
3. "Build Command" field mein:
   ```
   echo 'Backend only - skipping build'
   ```
   Ya simply:
   ```
   true
   ```
4. "Start Command" field mein:
   ```
   node server.js
   ```
5. Save karo

### Option 2: Railway.json Se

`app/railway.json` file already update ho chuki hai with:
```json
{
  "build": {
    "buildCommand": "echo 'Backend service - skipping frontend build'"
  }
}
```

Agar abhi bhi error aaye, to Railway dashboard se manually override karo.

## Important Settings for Backend Service

1. **Root Directory:** `app`
2. **Build Command:** `echo 'Backend only'` ya `true`
3. **Start Command:** `node server.js`
4. **Variables:**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT=5000`

## After Fix

1. Backend service redeploy karo
2. Logs check karo - ab build phase skip hoga
3. Server directly start hoga





