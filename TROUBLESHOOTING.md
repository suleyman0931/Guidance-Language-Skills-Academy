# 🔧 Troubleshooting Guide

## Common Deployment Issues

### 1. ❌ artisan File Not Found

**Error Message:**
```
"/artisan": not found
failed to compute cache key
```

**Solution:**
✅ Already fixed! The `artisan` file has been added to the repository.

The `artisan` file is Laravel's CLI tool. It was missing from the initial commit.

---

### 2. ❌ composer.lock Not Found Error

**Error Message:**
```
failed to compute cache key: "/composer.lock": not found
```

**Solution:**
✅ Already fixed! The Dockerfile now generates `composer.lock` during build.

If you want to generate it locally (optional):
```bash
cd backend
composer install
git add composer.lock
git commit -m "Add composer.lock"
git push
```

---

### 2. ❌ Database Connection Failed

**Error Message:**
```
SQLSTATE[08006] [7] could not connect to server
```

**Solutions:**

#### A. Wrong Database Host
- ✅ Use **Internal hostname**: `dpg-d8p0f937u1sc73nh8rajp-a`
- ❌ Don't use external hostname with `.oregon-postgres.render.com`

#### B. Wrong DB_CONNECTION
Check your environment variables:
```env
DB_CONNECTION=pgsql  ✅ Correct
DB_CONNECTION=mysql  ❌ Wrong
DB_CONNECTION=postgres  ❌ Wrong (must be 'pgsql')
```

#### C. Missing PostgreSQL Extension
If you see "driver not found", the Dockerfile already includes:
```dockerfile
RUN docker-php-ext-install pdo pdo_pgsql pgsql
```

---

### 3. ❌ APP_KEY Not Set

**Error Message:**
```
No application encryption key has been specified
```

**Solution:**

Generate a key locally:
```bash
cd backend
composer install
php artisan key:generate --show
```

Copy the output (e.g., `base64:xyz123...`) and add to Render environment variables:
```
APP_KEY=base64:xyz123...
```

Or use online generator: https://generate-random.org/laravel-key-generator

---

### 4. ❌ Migration Fails

**Error Message:**
```
SQLSTATE[42P01]: Undefined table
```

**Solution:**

Run migrations manually in Render Shell:
1. Go to your web service on Render
2. Click **Shell** tab
3. Run:
```bash
php artisan migrate:fresh --force
php artisan db:seed --force
```

---

### 5. ❌ CORS Errors in Frontend

**Error in Browser Console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

Update backend environment variable:
```env
FRONTEND_URL=https://your-exact-vercel-url.vercel.app
```

Check `backend/config/cors.php` includes:
```php
'allowed_origins' => [env('FRONTEND_URL')],
```

---

### 6. ❌ Vercel Build Fails

**Error Message:**
```
Module not found: Can't resolve 'xyz'
```

**Solutions:**

#### A. Install missing dependencies:
```bash
cd frontend
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

#### B. Clear Vercel cache:
- Go to Vercel dashboard
- Settings → General
- Scroll to "Build & Development Settings"
- Click "Clear Cache"
- Redeploy

---

### 7. ❌ API URL Not Found (Frontend)

**Error:**
```
Failed to fetch: https://undefined/api/...
```

**Solution:**

Add environment variable in Vercel:
```
NEXT_PUBLIC_API_URL=https://guidance-academy-api.onrender.com
```

Make sure to include `NEXT_PUBLIC_` prefix!

---

### 8. ❌ Render Service Spins Down

**Issue:**
First request takes 30-60 seconds after inactivity.

**Solutions:**

#### Free tier (temporary):
- This is expected behavior on free tier
- Service spins down after 15 minutes of inactivity

#### Upgrade to Starter ($7/month):
- Services stay always-on
- No cold starts

#### Keep-alive workaround (free tier):
Use a cron job to ping your API every 10 minutes:
```bash
# Use a service like cron-job.org or UptimeRobot
GET https://guidance-academy-api.onrender.com/api/health
```

---

### 9. ❌ Environment Variables Not Loading

**Issue:**
Changes to environment variables don't take effect.

**Solution:**

After updating environment variables on Render:
1. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
2. Wait for deployment to complete
3. Check logs to verify variables are loaded

---

### 10. ❌ Docker Build Takes Too Long

**Issue:**
Render build times out or takes 10+ minutes.

**Solutions:**

#### A. Check Docker logs:
- Look for stuck composer install
- Look for network timeouts

#### B. Add build timeout (render.yaml):
```yaml
services:
  - type: web
    buildCommand: timeout 15m docker build .
```

---

## 📊 How to Check Logs

### Render Logs
1. Go to Render dashboard
2. Select your web service
3. Click **"Logs"** tab
4. Look for errors in red

### Vercel Logs
1. Go to Vercel dashboard
2. Select your project
3. Click **"Deployments"**
4. Click on a deployment
5. Click **"Building"** or **"Runtime Logs"**

---

## 🆘 Still Having Issues?

### Check These Files:

1. **DATABASE_INFO.md** - Your database credentials
2. **DEPLOYMENT_GUIDE.md** - Step-by-step deployment
3. **QUICK_START.md** - Quick reference

### Verify Configuration:

```bash
# Check backend config
cat backend/.env.example
cat backend/Dockerfile
cat backend/config/database.php

# Check frontend config
cat frontend/.env.example
cat frontend/vercel.json

# Check deployment config
cat render.yaml
```

### Get Help:
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Laravel Docs**: https://laravel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] PostgreSQL database created on Render
- [ ] Database credentials saved (see DATABASE_INFO.md)
- [ ] APP_KEY generated
- [ ] All environment variables added to Render
- [ ] Backend deployed successfully
- [ ] Migrations ran successfully
- [ ] Frontend deployed to Vercel
- [ ] NEXT_PUBLIC_API_URL set in Vercel
- [ ] FRONTEND_URL updated in Render
- [ ] Test user registration
- [ ] Test login
- [ ] Test admin panel

---

**Last Updated**: June 17, 2026
