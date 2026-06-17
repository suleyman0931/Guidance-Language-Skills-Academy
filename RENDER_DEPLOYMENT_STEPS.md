# 🚀 Render Deployment - Step-by-Step

## Current Status: ✅ Fixed!

The Docker build issues have been resolved. You can now proceed with deployment.

---

## What Was Fixed:

1. ✅ **composer.lock missing** - Dockerfile now handles missing lock file
2. ✅ **artisan not found** - Files are now copied in the correct order
3. ✅ **composer scripts failing** - Scripts run with proper flags and at runtime
4. ✅ **PostgreSQL support** - Backend configured for PostgreSQL instead of MySQL

---

## Next Steps to Deploy on Render:

### 1️⃣ Create Web Service

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect Repository"**
4. Select: `suleyman0931/Guidance-Language-Skills-Academy`
5. Click **"Connect"**

### 2️⃣ Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `guidance-academy-api` |
| **Region** | `Oregon (US West)` (same as your database) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | **Docker** (auto-detected) |
| **Plan** | **Free** |

### 3️⃣ Add Environment Variables

Click **"Advanced"** and add these environment variables:

```env
APP_NAME=Guidance Academy API
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_URL=https://guidance-academy-api.onrender.com

DB_CONNECTION=pgsql
DB_HOST=dpg-d8p0f937u1sc73nh8rajp-a
DB_PORT=5432
DB_DATABASE=guidance_academy
DB_USERNAME=guidance_academy_user
DB_PASSWORD=adDOsx4sJMolmeSTENMboI18XzqJkZn

FRONTEND_URL=https://guidance-academy.vercel.app
```

#### 🔑 How to Generate APP_KEY:

**Option A - Online Generator:**
1. Visit: https://generate-random.org/laravel-key-generator
2. Copy the key (e.g., `base64:abc123xyz...`)
3. Paste into `APP_KEY` variable

**Option B - Local Generation:**
```bash
cd backend
composer install
php artisan key:generate --show
```

### 4️⃣ Deploy

1. Review all settings
2. Click **"Create Web Service"**
3. Wait for build (5-10 minutes)

### 5️⃣ Monitor Deployment

Watch the build logs for these stages:

```
✓ Cloning repository
✓ Building Docker image
  - Installing PHP extensions
  - Installing Composer dependencies
  - Copying files
  - Setting permissions
✓ Image built successfully
✓ Starting container
✓ Running entrypoint script
  - Generating APP_KEY (if needed)
  - Discovering packages
  - Running migrations
  - Seeding database
✓ Service is live!
```

### 6️⃣ Verify Deployment

Your backend should be live at:
```
https://guidance-academy-api.onrender.com
```

Test the API:
```bash
# Health check (if you have one)
curl https://guidance-academy-api.onrender.com/api/health

# Check API is responding
curl https://guidance-academy-api.onrender.com/api/registrations
```

---

## 🔍 Troubleshooting Build Issues

### If Build Fails:

**Check Logs Section** - Look for:

1. **"composer.lock not found"** 
   - ✅ Already fixed in latest code
   - Pull latest: `git pull origin main`

2. **"artisan: not found"**
   - ✅ Already fixed in latest code
   - Pull latest: `git pull origin main`

3. **"Database connection failed"**
   - Check DB credentials are correct
   - Verify DB_HOST uses internal hostname (no `.oregon-postgres.render.com`)

4. **"APP_KEY not set"**
   - Generate key and add to environment variables

### Manual Deployment Commands:

If auto-deploy doesn't work, you can trigger manually:

1. In Render dashboard, go to your web service
2. Click **"Manual Deploy"** dropdown
3. Select **"Clear build cache & deploy"**
4. Click **"Deploy"**

---

## 📝 Post-Deployment Checklist

After successful deployment:

- [ ] Backend URL is accessible: `https://guidance-academy-api.onrender.com`
- [ ] Check logs show "Service is live!"
- [ ] Migrations completed successfully
- [ ] Database has been seeded
- [ ] Test an API endpoint
- [ ] Save backend URL for frontend deployment
- [ ] Update FRONTEND_URL after deploying frontend

---

## 🔄 Continuous Deployment

Every time you push to `main` branch:
- Render automatically rebuilds and deploys
- Takes 5-10 minutes per deployment
- Zero downtime during deployment

To disable auto-deploy:
1. Go to Settings
2. Uncheck "Auto-Deploy"

---

## 📊 Monitor Your Service

### View Logs:
- Dashboard → Your Service → **Logs** tab
- Real-time logs stream as they happen

### Check Metrics:
- Dashboard → Your Service → **Metrics** tab
- View CPU, Memory, Response times

### Database Status:
- Dashboard → Your Database → **Info** tab
- Connection count, storage usage

---

## 💰 Free Tier Limits

Your current setup uses Render's free tier:

**Web Service:**
- 750 hours/month
- Spins down after 15 minutes of inactivity
- Cold start: 30-60 seconds

**Database:**
- 256 MB RAM
- 1 GB Storage
- Expires: July 7, 2025

### Upgrade to Prevent Spin Down:
- **Starter Plan**: $7/month
- Always-on (no spin down)
- Better performance

---

## 🎯 What's Next?

After backend is deployed:

1. ✅ Backend deployed on Render
2. ⏭️ Deploy frontend on Vercel (see DEPLOYMENT_GUIDE.md)
3. ⏭️ Update FRONTEND_URL in Render
4. ⏭️ Test the complete application

---

## 📚 Additional Resources

- **Full Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Database Info**: [DATABASE_INFO.md](./DATABASE_INFO.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Good luck with your deployment! 🚀**

If you encounter any issues, check TROUBLESHOOTING.md or the Render logs for specific error messages.
