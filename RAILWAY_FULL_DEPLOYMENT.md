# 🚂 Railway Par Pura Project Deploy - Complete Guide

## Overview
Railway par 2 services banayenge:
1. **Backend Service** - API server
2. **Frontend Service** - React app

---

## Part 1: Backend Service (Already Setup)

### Step 1: Backend Service Check Karo
1. Railway dashboard → Apna project
2. Backend service already hai ya nahi check karo
3. Agar nahi hai, to:
   - "New" → "GitHub Repo" → Apna repo select karo
   - Service name: `backend` ya `student-management-backend`

### Step 2: Backend Settings
1. Service → "Settings" tab
2. **Root Directory:** `app`
3. **Start Command:** `node server.js`

### Step 3: Backend Environment Variables
1. "Variables" tab
2. Add karo:
   - **MONGODB_URI:** `mongodb+srv://fawadraza:raza2018@cluster0.xxxxx.mongodb.net/stu3?retryWrites=true&w=majority`
   - **JWT_SECRET:** `fawad-student-management-secret-key-2024`
   - **PORT:** `5000`

### Step 4: Backend Domain
1. "Settings" → "Generate Domain"
2. Backend URL copy karo (jaise: `https://backend-production.up.railway.app`)

---

## Part 2: Frontend Service (New)

### Step 1: New Service Create Karo
1. Railway dashboard → Apna project
2. "New" button click karo
3. "GitHub Repo" select karo
4. Same repository select karo: `Fawadraza04/student-management-system`
5. Service name: `frontend` ya `student-management-frontend`

### Step 2: Frontend Settings
1. Service → "Settings" tab
2. **Root Directory:** `app`
3. **Build Command:** `npm run build`
4. **Start Command:** `npx serve -s dist -l 3000`
   (Ya: `npm install -g serve && serve -s dist -l 3000`)

### Step 3: Frontend Environment Variables
1. "Variables" tab
2. Add karo:
   - **VITE_API_URL:** Backend URL (jo Part 1, Step 4 mein copy kiya)
     Example: `https://backend-production.up.railway.app`

### Step 4: Frontend Build Settings
1. Railway automatically detect karega Node.js project
2. Build process:
   - Dependencies install karega
   - `npm run build` run karega
   - `dist` folder create hoga

### Step 5: Frontend Domain
1. "Settings" → "Generate Domain"
2. Frontend URL copy karo (jaise: `https://frontend-production.up.railway.app`)

---

## Alternative: Single Service with Both (Not Recommended)

Agar ek hi service mein dono chahiye, to:

1. **Root Directory:** `app`
2. **Build Command:** `npm run build`
3. **Start Command:** 
   ```bash
   npm run build && node server.js
   ```
   (Lekin yeh recommended nahi hai - better hai separate services)

---

## Quick Checklist

### Backend Service
- [ ] Service created
- [ ] Root Directory: `app`
- [ ] Start Command: `node server.js`
- [ ] Variables added:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] PORT
- [ ] Domain generated
- [ ] Backend URL copied

### Frontend Service
- [ ] Service created
- [ ] Root Directory: `app`
- [ ] Build Command: `npm run build`
- [ ] Start Command: `npx serve -s dist -l 3000`
- [ ] Variable added:
  - [ ] VITE_API_URL = Backend URL
- [ ] Domain generated
- [ ] Frontend URL copied

---

## Important Notes

1. **Backend pehle deploy karo** - Frontend ko backend URL chahiye
2. **Frontend service mein `serve` package** install hoga automatically
3. **Environment variables** properly set karo
4. **Domains** automatically generate honge

---

## After Deployment

1. **Backend URL:** `https://backend-production.up.railway.app`
2. **Frontend URL:** `https://frontend-production.up.railway.app`
3. Frontend URL open karo - app ready hai!

---

## Troubleshooting

### Frontend Build Failed
- Check karo `npm run build` locally kaam kar raha hai ya nahi
- Check karo `dist` folder create ho raha hai ya nahi

### Frontend Not Loading
- Check karo `VITE_API_URL` variable set hai ya nahi
- Check karo backend URL correct hai ya nahi

### Backend Connection Error
- Check karo `MONGODB_URI` correct hai ya nahi
- Check karo MongoDB Atlas network access allow hai ya nahi

