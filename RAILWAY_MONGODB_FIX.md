# 🔧 Railway MongoDB Connection Fix

## ❌ Current Error

```
DB Error: Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.xxxxx.mongodb.net
```

**Meaning:** MongoDB connection string galat hai ya environment variable set nahi hai.

## ✅ Solution: MongoDB URI Set Karo

### Step 1: MongoDB Atlas Connection String Copy Karo

1. MongoDB Atlas dashboard → **Clusters** → Your cluster
2. **Connect** button click karo
3. **Connect your application** select karo
4. **Connection string** copy karo:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```
5. `<username>` aur `<password>` replace karo (jo tumne MongoDB Atlas mein set kiye hain)
6. `<database-name>` replace karo (e.g., `student-management`)

**Example:**
```
mongodb+srv://fawadraza:raza2018@cluster0.xxxxx.mongodb.net/student-management?retryWrites=true&w=majority
```

### Step 2: Railway Dashboard Mein Add Karo

1. Railway dashboard → **Backend service** (SMS-backend)
2. **Variables** tab click karo
3. **New Variable** button click karo
4. Add karo:
   - **Key:** `MONGODB_URI`
   - **Value:** MongoDB connection string (jo tumne copy kiya)
5. **Add** button click karo

### Step 3: Other Required Variables

Backend service ke liye yeh variables bhi add karo:

1. **JWT_SECRET:**
   - **Key:** `JWT_SECRET`
   - **Value:** Koi random string (e.g., `my-super-secret-jwt-key-12345`)

2. **PORT:**
   - Railway automatically set karta hai, but agar manually chahiye:
   - **Key:** `PORT`
   - **Value:** `5000` (ya Railway jo assign kare)

### Step 4: Redeploy

1. **Deployments** tab
2. **Redeploy** button click karo
3. Wait for deployment

### Step 5: Check Logs

**Deploy Logs** mein yeh dikhna chahiye:
```
Starting Container
DB connected
Server running on port 5000
```

## 🔍 Troubleshooting

### Issue 1: Still Getting ENOTFOUND Error

**Possible Causes:**
1. Connection string mein username/password galat hai
2. Database name galat hai
3. Network access allow nahi hai MongoDB Atlas mein

**Solution:**
1. MongoDB Atlas → **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
2. Connection string verify karo - sahi format hai?
3. Username/password double-check karo

### Issue 2: Authentication Failed

**Error:** `Authentication failed`

**Solution:**
1. MongoDB Atlas → **Database Access** → Check username/password
2. Agar password galat hai, to new user create karo
3. Connection string mein sahi credentials use karo

### Issue 3: Database Not Found

**Error:** `Database not found`

**Solution:**
1. Connection string mein database name check karo
2. Agar database nahi hai, to pehle create karo (ya koi bhi name use karo, MongoDB automatically create kar dega)

## ✅ Final Checklist

- [ ] MongoDB Atlas connection string copy kiya
- [ ] Username/password replace kiye
- [ ] Database name set kiya
- [ ] `MONGODB_URI` Railway mein add kiya
- [ ] `JWT_SECRET` Railway mein add kiya
- [ ] Network access allow kiya (0.0.0.0/0)
- [ ] Redeploy kiya
- [ ] Logs check kiye - "DB connected" dikh raha hai?

## 🎯 Expected Result

After fix, **Deploy Logs** mein:
```
Starting Container
DB connected
Server running on port 5000
```

**No errors!** ✅




