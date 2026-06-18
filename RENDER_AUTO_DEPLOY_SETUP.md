# Render Auto-Deploy Setup Guide

## Problem
Render is not automatically deploying when you push to GitHub. You have to manually click "Deploy latest commit" each time.

## Solution: Enable Auto-Deploy on Render

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Click on your service: **guidance-academy-api**

### Step 2: Check Auto-Deploy Setting
1. Click on **Settings** tab
2. Scroll to **Build & Deploy** section
3. Look for **Auto-Deploy** setting

### Step 3: Enable Auto-Deploy
- **If Auto-Deploy is set to "No":**
  1. Click **Edit** or the setting itself
  2. Change to **"Yes"**
  3. Click **Save Changes**

- **Branch Setting:**
  - Make sure **Branch** is set to: `main`
  - This should match your GitHub branch name

### Step 4: Verify GitHub Connection
1. Still in Settings, scroll to **Source Code** section
2. Verify it shows:
   - **Repository**: Your GitHub repo (suleyman0931/Guidance-Language-Skills-Academy)
   - **Branch**: main
   - **Status**: Connected ✓

### Step 5: Test Auto-Deploy
1. Make a small change to any file (or push from local)
2. Push to GitHub: `git push origin main`
3. Go back to Render dashboard
4. You should see a new deployment start automatically
5. Status will show: "Building..." then "Live"

---

## Alternative: Manual Deploy Trigger

If Auto-Deploy doesn't work or you prefer manual control:

### From Render Dashboard:
1. Go to your service page
2. Click **Manual Deploy**
3. Select **Deploy latest commit**
4. Click **Deploy**

### From GitHub (Webhook):
If auto-deploy still doesn't work, you may need to reconnect the GitHub webhook:

1. In Render, go to **Settings** → **Source Code**
2. Click **Disconnect** (if needed)
3. Click **Connect Repository**
4. Re-authorize GitHub
5. Select your repository
6. Select `main` branch
7. Save

---

## Current Deploy Status

**Service**: guidance-academy-api
**URL**: https://guidance-language-skills-academy.onrender.com
**Branch**: main
**Last Manual Deploy**: Latest commit with storage permissions fix

---

## What Should Happen After Enabling Auto-Deploy

✅ Every `git push origin main` will:
1. Trigger Render to pull latest code
2. Build new Docker image
3. Run migrations
4. Create storage directories with proper permissions
5. Deploy new container
6. Your changes go live automatically

⏱️ Deploy time: ~3-5 minutes

---

## Troubleshooting

### If Auto-Deploy Still Doesn't Work:

1. **Check Render Plan**
   - Free tier supports auto-deploy
   - No upgrade needed

2. **Check Branch Name**
   - Make sure you're pushing to `main` not `master`
   - Run: `git branch` to verify

3. **Check GitHub Integration**
   - Go to GitHub Settings → Integrations
   - Verify Render has access to your repository

4. **Check Render Logs**
   - Go to Logs tab
   - Look for any errors about GitHub webhook

5. **Re-connect Repository**
   - Disconnect and reconnect GitHub in Render settings
   - This refreshes the webhook

---

## Quick Commands

```bash
# Check current branch
git branch

# Check remote status
git remote -v

# Push to trigger auto-deploy
git push origin main

# View git log
git log --oneline -5
```

---

**Note**: Vercel (frontend) already has auto-deploy enabled and working. Only Render (backend) needs this configuration.

---

**Date**: June 18, 2026
