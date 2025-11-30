# 🚂 Railway Deployment - Simple Guide (Step by Step)

## Step 1: Railway Dashboard Mein Jao
1. Browser kholo
2. https://railway.app par jao
3. GitHub se login karo

## Step 2: Project Create Karo
1. "New Project" button click karo
2. "Deploy from GitHub repo" select karo
3. Apna repo select karo: `Fawadraza04/student-management-system`
4. Railway automatically detect karega

## Step 3: Settings Fix Karo
1. Service card par click karo (jo abhi create hua)
2. **Settings** tab par jao
3. **Root Directory** field mein type karo: `app`
4. Save karo

## Step 4: MongoDB Connection String
1. https://www.mongodb.com/cloud/atlas par jao
2. Login karo
3. Left side → "DATABASE" → "Clusters"
4. Apne cluster par "Connect" button click karo
5. "Connect your application" select karo
6. Connection string copy karo (kuch aisa hoga):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Is string ko update karo:
   - `<username>` ki jagah: `fawadraza`
   - `<password>` ki jagah: `raza2018`
   - End mein `/stu3` add karo
   
   **Final string example:**
   ```
   mongodb+srv://fawadraza:raza2018@cluster0.xxxxx.mongodb.net/stu3?retryWrites=true&w=majority
   ```

## Step 5: Railway Variables Add Karo
1. Railway dashboard → Apna service
2. **Variables** tab click karo
3. "New Variable" button click karo
4. **Pehla variable:**
   - Key: `MONGODB_URI`
   - Value: Jo connection string banaya (Step 4 se)
   - "Add" click karo

5. **Dusra variable:**
   - "New Variable" click karo
   - Key: `JWT_SECRET`
   - Value: `fawad-student-management-secret-2024`
   - "Add" click karo

6. **Teesra variable:**
   - "New Variable" click karo
   - Key: `PORT`
   - Value: `5000`
   - "Add" click karo

## Step 6: Deploy Check Karo
1. **Deployments** tab par jao
2. Latest deployment check karo
3. Agar "Building" dikhe, wait karo
4. Agar "Active" dikhe, matlab successful hai!

## Step 7: URL Get Karo
1. **Settings** tab par jao
2. "Generate Domain" button click karo (agar nahi hai to automatically generate hoga)
3. Railway URL copy karo (jaise: `https://student-management-production.up.railway.app`)

## ✅ Done!
Ab backend deploy ho gaya hai!

---

## 🐛 Agar Error Aaye:

### Error 1: Build Failed
- **Solution:** Settings mein Root Directory `app` set hai ya nahi check karo

### Error 2: MongoDB Connection Error
- **Solution:** MongoDB Atlas → Network Access → "Allow Access from Anywhere" (0.0.0.0/0)

### Error 3: Port Error
- **Solution:** Variables mein `PORT=5000` add kiya hai ya nahi check karo

---

## 📞 Help Chahiye?
Agar koi step mein problem aaye, to Railway ke logs share karo, main help karunga!

