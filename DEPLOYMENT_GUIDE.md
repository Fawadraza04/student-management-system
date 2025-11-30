# Deployment Guide - Netlify (Frontend) + Railway (Backend)

## 🚀 Frontend Deployment on Netlify

### Step 1: Prepare Frontend
1. All configuration files are ready:
   - `netlify.toml` ✅
   - `app/public/_redirects` ✅

### Step 2: Deploy to Netlify
1. Go to [Netlify](https://www.netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select repository: `Fawadraza04/student-management-system`
5. Configure build settings:
   - **Base directory**: `app`
   - **Build command**: `npm run build`
   - **Publish directory**: `app/dist`
6. Click "Deploy site"

### Step 3: Add Environment Variable
1. Go to Site settings → Environment variables
2. Add new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `YOUR_RAILWAY_BACKEND_URL` (you'll get this after Railway deployment)
3. Redeploy the site

---

## 🚂 Backend Deployment on Railway

### Step 1: Prepare Backend
1. Configuration files are ready:
   - `app/railway.json` ✅
   - `app/Procfile` ✅
   - Environment variables configured ✅

### Step 2: Deploy to Railway
1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select repository: `Fawadraza04/student-management-system`
4. Railway will auto-detect it's a Node.js project
5. Configure settings:
   - **Root Directory**: `app`
   - **Start Command**: `node server.js`

### Step 3: Add Environment Variables
1. Go to your service → Variables tab
2. Add these variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_secret_key_here
PORT=5000
```

### Step 4: Get MongoDB Atlas (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (Free tier)
4. Get connection string
5. Replace `<password>` with your database password
6. Add this to Railway environment variables

### Step 5: Get Railway URL
1. After deployment, Railway will give you a URL like:
   - `https://your-app-name.railway.app`
2. Copy this URL
3. Add it to Netlify environment variable `VITE_API_URL`

---

## 📝 Quick Checklist

### Netlify (Frontend)
- [ ] Connect GitHub repo
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `app/dist`
- [ ] Add environment variable: `VITE_API_URL` = Railway URL
- [ ] Deploy

### Railway (Backend)
- [ ] Connect GitHub repo
- [ ] Set root directory: `app`
- [ ] Add MongoDB Atlas connection string
- [ ] Add JWT_SECRET
- [ ] Deploy
- [ ] Copy Railway URL
- [ ] Add to Netlify environment variable

---

## 🔗 After Deployment

1. **Frontend URL**: `https://your-site-name.netlify.app`
2. **Backend URL**: `https://your-app-name.railway.app`
3. Update Netlify `VITE_API_URL` with Railway URL
4. Redeploy Netlify site

---

## 🐛 Troubleshooting

### Frontend 404 Error
- Make sure `_redirects` file is in `app/public/`
- Check `netlify.toml` configuration
- Clear cache and redeploy

### Backend Connection Error
- Check MongoDB Atlas connection string
- Verify environment variables in Railway
- Check Railway logs for errors

### CORS Error
- Backend already has CORS enabled
- Make sure Railway URL is correct in Netlify

---

## 📚 Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

