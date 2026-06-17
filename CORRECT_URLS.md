# ✅ Correct URLs for Your Deployment

## 🔗 Your Actual URLs:

| Service | Correct URL |
|---------|-------------|
| **Frontend (Vercel)** | `https://guidanceacademy.vercel.app` |
| **Backend (Render)** | `https://guidance-language-skills-academy.onrender.com` |
| **Backend Health Check** | `https://guidance-language-skills-academy.onrender.com/api/health` |

---

## 🔧 Fix Step 1: Update Vercel Environment Variable

The frontend is pointing to the wrong backend URL!

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: `guidance-language-skills-academy` (or similar)
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_API_URL`
5. **Update the value** to:
   ```
   https://guidance-language-skills-academy.onrender.com
   ```
6. Click **Save**
7. Go to **Deployments** tab
8. Click **"Redeploy"** on the latest deployment (3 dots menu)
9. Wait 2-3 minutes for redeploy

---

## 🔧 Fix Step 2: Update Render Environment Variable

The backend needs to know the frontend URL for CORS:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your web service: `guidance-language-skills-academy`
3. Go to **Environment** tab
4. Find or add `FRONTEND_URL`
5. **Set the value** to:
   ```
   https://guidanceacademy.vercel.app
   ```
6. Click **Save Changes**
7. Service will redeploy automatically (5-10 minutes)

---

## ✅ Test Backend is Running

While waiting, test the backend:

**Health Check:**
```
https://guidance-language-skills-academy.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "service": "Guidance Academy API",
  "timestamp": "2026-06-17T..."
}
```

If you get "Not Found" or error, check Render logs to see if deployment succeeded.

---

## 🎯 After Both Redeploys Complete:

1. Go to https://guidanceacademy.vercel.app
2. Try to register or login
3. Should work now! ✅

---

## 📋 Summary of Changes:

### Before (WRONG):
- Frontend → `https://guidance-academy-api.onrender.com` ❌
- Backend → Not set properly ❌

### After (CORRECT):
- Frontend → `https://guidance-language-skills-academy.onrender.com` ✅
- Backend CORS → `https://guidanceacademy.vercel.app` ✅

---

## 🔍 Quick Verification:

Open browser console (F12) on your frontend and check Network tab:
- Requests should go to `guidance-language-skills-academy.onrender.com`
- Should NOT see CORS errors
- Status codes should be 200 (or 401 for auth)

---

**The issue was the URL mismatch!** Fix both environment variables and you're good to go! 🚀
