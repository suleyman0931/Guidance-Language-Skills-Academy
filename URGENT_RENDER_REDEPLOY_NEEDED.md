# ⚠️ URGENT: Render Needs Manual Redeploy

## Problem
The promotional image upload is still showing CORS error because **Render hasn't redeployed with the new config files yet**.

## Critical Commits That Need to Be Deployed:

### Commit `9c2091c` - **MOST IMPORTANT**
Added missing Laravel config files:
- ✅ `backend/config/auth.php`
- ✅ `backend/config/sanctum.php`
- ✅ Updated `PromotionalImageController.php`

**This commit MUST be deployed for uploads to work!**

### Commit `06927cd`
- Added CORS middleware and nginx CORS headers

### Commit `d3aa7d6`
- Storage directory permissions fix

## How to Manually Deploy on Render

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Click on your service: **guidance-academy-api**

### Step 2: Trigger Manual Deploy
1. Click **Manual Deploy** button (top right)
2. Select **"Deploy latest commit"**
3. Click **Deploy**

### Step 3: Wait for Deployment
- **Status** will show: "Deploying..."
- Watch the logs for:
  ```
  ==> Starting Guidance Academy API...
  ==> Creating storage link...
  ==> Your service is live 🎉
  ```
- Deployment takes ~3-5 minutes
- **Status** will change to: "Live" (green)

### Step 4: Verify Deployment
Check the logs for these key lines:
```
==> Ensuring storage directories exist...
==> Creating storage link...
INFO  The [public/storage] link has been connected to [storage/app/public].
==> Your service is live 🎉
```

### Step 5: Test Image Upload
1. Go to: https://guidanceacademy.vercel.app/admin/promotions
2. Login: `admin` / `Admin@2024!`
3. Try uploading an image
4. **Should work now!** ✅

---

## If Still Getting CORS Error After Deploy:

The CORS error happens because PHP crashes BEFORE sending CORS headers. After deploy:

1. **Check if deploy completed successfully**
   - Look for "Live" status in Render
   - Check logs for any errors

2. **Try upload again**
   - The `\Throwable` catch should now show the real error
   - Check browser console for error message JSON

3. **Check Render logs**
   - Go to "Logs" tab in Render
   - Look for PHP errors when you try to upload

---

## Why Manual Deploy is Needed

**Auto-deploy might not be enabled**. After you deploy manually this time:

1. Go to **Settings** tab in Render
2. Find **Auto-Deploy** setting
3. Change to **"Yes"**
4. Save changes

Then future pushes will auto-deploy.

---

## Current Status

✅ **Code pushed to GitHub**: Commit `9c2091c` with auth/sanctum config
✅ **Frontend deployed**: Vercel auto-deploys (already working)
⏳ **Backend needs deploy**: Render waiting for manual trigger

---

**NEXT STEP**: Go to Render dashboard and click "Manual Deploy" → "Deploy latest commit"

---

**Date**: June 18, 2026
