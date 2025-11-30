# 🚀 Deployment Steps - Netlify (Frontend) + Railway (Backend)

## 📋 Prerequisites
- GitHub repository pushed ✅
- MongoDB Atlas account (free)
- Netlify account (free)
- Railway account (free)

---

## 🚂 STEP 1: Deploy Backend on Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository: `Fawadraza04/student-management-system`

### 1.2 Configure Railway Service
1. Railway will auto-detect Node.js
2. Go to **Settings** → **Root Directory**: Set to `app`
3. Go to **Settings** → **Start Command**: `node server.js`

### 1.3 Setup MongoDB Atlas (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (Free tier available)
3. Create a cluster (choose FREE tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `stu3` or any name you want

### 1.4 Add Environment Variables in Railway
1. Go to your Railway service → **Variables** tab
2. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/stu3?retryWrites=true&w=majority
JWT_SECRET=your-strong-secret-key-minimum-32-characters-long
PORT=5000
```

### 1.5 Get Railway URL
1. After deployment, Railway will give you a URL
2. It will look like: `https://your-app-name.up.railway.app`
3. **Copy this URL** - you'll need it for Netlify

---

## 🌐 STEP 2: Deploy Frontend on Netlify

### 2.1 Create Netlify Account
1. Go to [netlify.com](https://www.netlify.com)
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository: `Fawadraza04/student-management-system`

### 2.2 Configure Build Settings
1. **Base directory**: `app`
2. **Build command**: `npm run build`
3. **Publish directory**: `app/dist`

### 2.3 Add Environment Variable
1. Go to **Site settings** → **Environment variables**
2. Click "Add variable"
3. **Key**: `VITE_API_URL`
4. **Value**: Your Railway backend URL (from Step 1.5)
   - Example: `https://your-app-name.up.railway.app`
5. Click "Save"

### 2.4 Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be live at: `https://your-site-name.netlify.app`

---

## ✅ Final Checklist

### Railway (Backend)
- [ ] Project created from GitHub
- [ ] Root directory set to `app`
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables added:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] PORT
- [ ] Deployment successful
- [ ] Railway URL copied

### Netlify (Frontend)
- [ ] Site created from GitHub
- [ ] Build settings configured:
  - [ ] Base directory: `app`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `app/dist`
- [ ] Environment variable added:
  - [ ] VITE_API_URL = Railway URL
- [ ] Deployment successful
- [ ] Site is live

---

## 🔧 Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Check MONGODB_URI in Railway variables
- **Port Error**: Railway auto-assigns PORT, don't hardcode it
- **Build Failed**: Check Railway logs for errors

### Frontend Issues
- **404 Error**: Make sure `_redirects` file exists in `app/public/`
- **API Connection Error**: Check VITE_API_URL in Netlify environment variables
- **CORS Error**: Backend has CORS enabled, verify Railway URL is correct

### Common Fixes
1. **Clear cache and redeploy** on both platforms
2. **Check environment variables** are set correctly
3. **Verify URLs** don't have trailing slashes
4. **Check Railway logs** for backend errors
5. **Check Netlify build logs** for frontend errors

---

## 📝 Important Notes

1. **MongoDB Atlas**: Free tier gives you 512MB storage - enough for development
2. **Railway**: Free tier has usage limits, but good for small projects
3. **Netlify**: Free tier is generous for static sites
4. **Environment Variables**: Never commit `.env` files to GitHub
5. **API URLs**: Always use HTTPS in production

---

## 🎉 After Deployment

Your app will be live at:
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend**: `https://your-app-name.up.railway.app`

Test the app:
1. Open frontend URL
2. Register a new admin account
3. Login and test all features

---

## 🔄 Updating Code

After making changes:
1. Push to GitHub
2. Railway will auto-deploy backend
3. Netlify will auto-deploy frontend
4. Both platforms auto-detect changes from GitHub

---

## 💡 Pro Tips

1. **Monitor Railway usage** - Free tier has limits
2. **Use MongoDB Atlas IP whitelist** - Allow Railway IPs
3. **Set up custom domains** (optional) - Both platforms support it
4. **Enable notifications** - Get alerts for deployment status
5. **Check logs regularly** - Monitor for errors

