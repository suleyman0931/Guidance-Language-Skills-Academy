# Sanctum Cookie Configuration Fix

## Problem Identified
**No cookies are being stored!** This is why authentication fails and promotional image upload returns 500 error.

When you login, Sanctum should create a session cookie, but it's not working because of cross-origin cookie configuration.

## Solution

### 1. Add Missing Config File
✅ Created `backend/config/session.php` with proper cross-origin cookie settings:
- `secure` = true (required for HTTPS)
- `same_site` = 'none' (required for cross-origin)
- `http_only` = true (security)

### 2. Add Environment Variables to Render

Go to Render Dashboard → Your Service → Environment:

**Add these environment variables:**

```
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
SANCTUM_STATEFUL_DOMAINS=guidanceacademy.vercel.app
```

### 3. Redeploy

After adding environment variables, Render will automatically redeploy.

---

## How to Add Environment Variables on Render:

1. Go to: https://dashboard.render.com
2. Click your service: **guidance-academy-api**
3. Click **Environment** tab (left sidebar)
4. Click **Add Environment Variable**
5. Add each variable:
   - Key: `SESSION_SECURE_COOKIE`
   - Value: `true`
   - Click **Save**
6. Repeat for all variables above
7. Service will auto-redeploy

---

## Why This Fixes It:

**Cross-origin cookies require:**
- ✅ `Secure` flag (HTTPS only)
- ✅ `SameSite=None` (allow cross-origin)
- ✅ Proper CORS headers (already configured)
- ✅ Stateful domains configured (already configured)

Without these settings, browsers block cookies from being set cross-origin (Vercel → Render).

---

## After Deploy - Test:

1. **Clear browser cookies/cache**
2. **Login again**: https://guidanceacademy.vercel.app/login
3. **Check DevTools → Application → Cookies**
4. **Should see cookies now!**
5. **Try uploading image**

---

## Alternative: Use API Tokens Instead of Cookies

If cookies still don't work (some browsers are very strict), we can switch to API token authentication instead of cookie-based sessions. Let me know if you want to do that.

---

**Status**: Config files created, needs environment variables added on Render
**Date**: June 18, 2026
