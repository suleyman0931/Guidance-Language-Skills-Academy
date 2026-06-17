# 🚨 Backend Not Running - Troubleshooting

## Issue: 404 Not Found on API Endpoints

Your backend URL returns "Not Found", which means the service isn't running properly.

---

## 🔍 Step 1: Check Render Dashboard

### A. Verify Service Status
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your web service (should be named `guidance-academy-api`)
3. Check the status indicator:
   - 🟢 **Live** - Service is running
   - 🟡 **Deploying** - Still deploying (wait)
   - 🔴 **Failed** - Deployment failed (check logs)
   - ⚪ **Suspended** - Free tier timeout

### B. Check the Exact URL
In the service dashboard, you should see your URL at the top.

Common formats:
- `https://guidance-academy-api.onrender.com`
- `https://your-service-name.onrender.com`

Make sure you're using the exact URL shown!

---

## 🔍 Step 2: Check Deployment Logs

1. In your web service, click **"Logs"** tab
2. Look at the most recent logs
3. Check for these patterns:

### ✅ Successful Deployment:
```
==> Running migrations...
Migration table created successfully.
==> Seeding database...
Database seeding completed successfully.
==> Starting services...
```

### ❌ Failed Deployment - Database Issues:
```
SQLSTATE[08006] [7] connection to server failed
SSL connection has been closed unexpectedly
```

**Fix:** Database connection issue. Check DATABASE_INFO.md

### ❌ Failed Deployment - APP_KEY Issues:
```
file_get_contents(/var/www/html/.env): Failed to open stream
```

**Fix:** APP_KEY generation issue (should be fixed in latest code)

### ❌ Failed Deployment - Build Issues:
```
ERROR: failed to solve
composer.lock not found
artisan not found
```

**Fix:** Missing files (should be fixed in latest code)

---

## 🔍 Step 3: Check What URL to Test

Try these URLs in your browser:

1. **Health Check:**
   ```
   https://guidance-academy-api.onrender.com/api/health
   ```
   Expected: JSON response `{"status":"ok",...}`

2. **Base URL:**
   ```
   https://guidance-academy-api.onrender.com
   ```
   Expected: 404 or Laravel error page (this is normal)

3. **API Base:**
   ```
   https://guidance-academy-api.onrender.com/api
   ```
   Expected: 404 (this is normal, no route here)

---

## 🎯 Common Issues & Solutions

### Issue 1: Service is "Suspended" (Free Tier)

**Symptom:** Service shows as suspended or inactive
**Cause:** Free tier services spin down after 15 minutes of inactivity
**Solution:** 
- Click into the service - it should auto-wake up
- Wait 30-60 seconds for cold start
- Refresh the page

### Issue 2: Deployment Still Running

**Symptom:** Status shows "Deploying" or spinning
**Cause:** Deployment in progress
**Solution:**
- Wait 5-10 minutes
- Watch logs for progress
- If stuck for >15 minutes, cancel and redeploy

### Issue 3: Deployment Failed

**Symptom:** Status shows "Failed" or "Build failed"
**Cause:** Error during build or startup
**Solution:**
1. Check logs for specific error
2. Refer to error-specific fixes above
3. Make code fix and push to GitHub
4. Render auto-redeploys on push

### Issue 4: Service Not Created Yet

**Symptom:** You don't see a web service in Render
**Cause:** Web service wasn't created
**Solution:**
- Create web service following DEPLOYMENT_GUIDE.md
- Connect to GitHub repo
- Set root directory to `backend`
- Runtime: Docker

---

## 🛠️ Quick Diagnostic Commands

If you have Render CLI or shell access:

```bash
# Check if PHP is running
ps aux | grep php

# Check if Nginx is running
ps aux | grep nginx

# Check if port 8080 is listening
netstat -tlnp | grep 8080

# Test Laravel directly
php artisan --version
```

---

## 🔄 Force Redeploy

If nothing works, force a clean redeploy:

1. Go to your web service in Render
2. Click **"Manual Deploy"** dropdown (top right)
3. Select **"Clear build cache & deploy"**
4. Wait for new deployment
5. Watch logs carefully

---

## 📋 Checklist Before Creating Service

If you need to recreate the service:

- [ ] GitHub repo is accessible
- [ ] Render connected to GitHub account
- [ ] Root directory set to `backend`
- [ ] Runtime detected as **Docker**
- [ ] Region matches database region
- [ ] Environment variables set:
  - `APP_NAME`
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `APP_KEY` (generate one)
  - `DATABASE_URL` (from database)
  - `FRONTEND_URL=https://guidanceacademy.vercel.app`

---

## 🆘 What to Check Right Now:

1. **Open Render Dashboard** → Find your web service
2. **Check Status** → Is it Live, Deploying, or Failed?
3. **Check Logs** → What's the last message?
4. **Copy Exact URL** → What URL is shown at the top?
5. **Test URL** → Try https://YOUR-EXACT-URL/api/health

**Report back with:**
- Service status (Live/Deploying/Failed?)
- Last few lines from logs
- Exact URL of your service

This will help diagnose the exact issue!
