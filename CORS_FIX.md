# 🔧 CORS Error - Quick Fix

## ❌ Error You're Seeing:

```
Access to XMLHttpRequest has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## ✅ Quick Fix Steps:

### Step 1: Update FRONTEND_URL in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your web service: `guidance-academy-api`
3. Go to **"Environment"** tab
4. Find or add `FRONTEND_URL` variable:
   - Key: `FRONTEND_URL`
   - Value: `https://guidanceacademy.vercel.app`
   
   ⚠️ **Important:** Use the EXACT URL (no trailing slash)

5. Click **"Save Changes"**
6. Service will redeploy automatically

### Step 2: Verify Backend is Running

While waiting for redeploy, check:

1. Go to your backend URL: https://guidance-academy-api.onrender.com/api/health
2. You should see a JSON response like:
   ```json
   {
     "status": "ok",
     "service": "Guidance Academy API",
     "timestamp": "2026-06-17T..."
   }
   ```

If you get an error or timeout:
- Backend might still be deploying
- Check Render logs for errors
- Make sure migrations completed successfully

### Step 3: Wait for Redeploy

- Render takes 5-10 minutes to redeploy
- Watch the **"Logs"** tab for:
  ```
  ==> Running migrations...
  Migration table created successfully.
  ==> Seeding database...
  ==> Starting services...
  ```

### Step 4: Test Again

After redeploy completes:
1. Go back to https://guidanceacademy.vercel.app
2. Try to login or register
3. Should work now! ✅

---

## 🔍 Why This Happens:

The backend CORS configuration needs to know which frontend URL to allow. The config already includes a pattern for Vercel apps, but setting `FRONTEND_URL` explicitly ensures it works.

---

## 🎯 Your URLs:

| Service | URL |
|---------|-----|
| **Frontend** | https://guidanceacademy.vercel.app |
| **Backend API** | https://guidance-academy-api.onrender.com |
| **Backend Health** | https://guidance-academy-api.onrender.com/api/health |

---

## ⚠️ If Still Not Working:

### Check 1: Backend Logs
Look for errors in Render logs:
- Database connection errors?
- App not starting?
- Nginx errors?

### Check 2: Test API Directly
```bash
curl https://guidance-academy-api.onrender.com/api/health
```

Should return JSON. If it times out or errors, backend isn't running.

### Check 3: Frontend Environment Variable
Make sure Vercel has:
- Key: `NEXT_PUBLIC_API_URL`
- Value: `https://guidance-academy-api.onrender.com`

Go to Vercel → Your Project → Settings → Environment Variables

---

## 🚀 Expected Behavior After Fix:

1. ✅ Backend responds to health check
2. ✅ CORS headers included in API responses
3. ✅ Frontend can call backend APIs
4. ✅ Login works
5. ✅ Registration works
6. ✅ Admin panel accessible

---

**Most common issue:** `FRONTEND_URL` not set or set incorrectly in Render. Make sure it matches your Vercel URL exactly!
