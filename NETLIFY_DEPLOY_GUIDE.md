# 🌐 Netlify Frontend Deployment - Simple Guide

## Step 1: Netlify Account
1. Browser kholo
2. https://www.netlify.com par jao
3. GitHub se sign in karo

## Step 2: New Site Create Karo
1. Dashboard par "Add new site" button click karo
2. "Import an existing project" select karo
3. GitHub connect karo (agar pehle se connected nahi hai)
4. Apna repository select karo: `Fawadraza04/student-management-system`

## Step 3: Build Settings Configure Karo
1. **Base directory:** `app` type karo
2. **Build command:** `npm run build` type karo
3. **Publish directory:** `app/dist` type karo
4. "Deploy site" button click karo

## Step 4: Environment Variable Add Karo
1. Site deploy hone ke baad, "Site settings" par jao
2. Left sidebar mein "Environment variables" click karo
3. "Add a variable" button click karo
4. **Key:** `VITE_API_URL`
5. **Value:** Apna Railway backend URL (jaise: `https://your-app.up.railway.app`)
6. "Save" click karo

## Step 5: Redeploy Karo
1. "Deploys" tab par jao
2. "Trigger deploy" → "Clear cache and deploy site" click karo
3. Wait karo deployment complete hone tak

## Step 6: Site URL Get Karo
1. Deploy complete hone ke baad
2. Top par site URL dikhega (jaise: `https://student-management.netlify.app`)
3. Is URL ko copy karo

## ✅ Done!
Ab frontend bhi deploy ho gaya hai!

---

## 🔗 Important
- Frontend URL: Netlify se milega
- Backend URL: Railway se milega
- Netlify mein `VITE_API_URL` = Railway URL add karna zaroori hai

---

## 🐛 Agar Error Aaye:
- **Build failed:** Check karo `app/dist` folder exist karta hai ya nahi
- **404 Error:** `_redirects` file check karo `app/public/` mein
- **API Error:** `VITE_API_URL` environment variable check karo

