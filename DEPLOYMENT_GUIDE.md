# 🚀 Deployment Guide - Guidance Language & Skills Academy

This guide walks you through deploying your application:
- **Backend (Laravel)** → Render.com
- **Frontend (Next.js)** → Vercel

---

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ GitHub account (code already pushed to: https://github.com/suleyman0931/Guidance-Language-Skills-Academy.git)
- ✅ [Render.com](https://render.com) account (free tier available)
- ✅ [Vercel.com](https://vercel.com) account (free tier available)

---

## 🎯 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (this makes connecting repos easier)

### Step 2: Create PostgreSQL Database
1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `guidance-academy-db`
   - **Database**: `guidance_academy`
   - **Region**: Choose closest to you (e.g., Oregon US-West)
   - **PostgreSQL Version**: 16
   - **Plan**: **Free** (requires credit card for verification)
3. Click **"Create Database"**
4. **Save the connection details** from the database info page (Connections section):

**Example from your database:**
- **Hostname**: `dpg-d8p0f937u1sc73nh8rajp-a`
- **Port**: `5432`
- **Database**: `guidance_academy`
- **Username**: `guidance_academy_user`
- **Password**: `adDOsx4sJMolmeSTENMboI18XzqJkZn` (your actual password will be different)
- **Internal Database URL**: `postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a/guidance_academy`
- **External Database URL**: `postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com/guidance_academy`

> **Important**: 
> - Use the **Internal Database URL** for your web service (faster, no external network)
> - The **External URL** is for connecting from your local machine
> - Keep these credentials secure!

> **Note**: Render requires a credit card even for free tier. The free database includes 256 MB RAM and 1 GB storage.

### Step 3: Deploy Backend Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Select: `suleyman0931/Guidance-Language-Skills-Academy`
3. Configure the service:
   - **Name**: `guidance-academy-api`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** (auto-detected from Dockerfile)
   - **Plan**: **Free**

### Step 4: Configure Environment Variables
In the **"Environment"** section, add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `APP_NAME` | `Guidance Academy API` | Application name |
| `APP_ENV` | `production` | Environment |
| `APP_DEBUG` | `false` | Disable debug in production |
| `APP_KEY` | `base64:GENERATE_THIS` | See instructions below ⬇️ |
| `APP_URL` | `https://guidance-academy-api.onrender.com` | Your Render URL |
| `DB_CONNECTION` | `pgsql` | Database type (PostgreSQL) |
| `DB_HOST` | `dpg-d8p0f937u1sc73nh8rajp-a` | From database Connections |
| `DB_PORT` | `5432` | Database port |
| `DB_DATABASE` | `guidance_academy` | Database name |
| `DB_USERNAME` | `guidance_academy_user` | From database Connections |
| `DB_PASSWORD` | `adDOsx4sJMolmeSTENMboI18XzqJkZn` | From database Connections |
| `FRONTEND_URL` | `https://guidance-academy.vercel.app` | Update after deploying frontend |

> **Pro Tip**: Instead of adding each variable individually, you can also use the **Internal Database URL** by adding:
> - `DATABASE_URL` = `postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a/guidance_academy`
> 
> Laravel will automatically parse this URL if you configure it in your `.env` file.

#### 🔑 Generate APP_KEY:
You need to generate a Laravel application key. Two options:

**Option A - Using local Laravel:**
```bash
cd backend
composer install
php artisan key:generate --show
```

**Option B - Using online generator:**
1. Go to: https://generate-random.org/laravel-key-generator
2. Copy the generated key (starts with `base64:`)

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Render will build your Docker image (takes 5-10 minutes)
3. Once deployed, you'll see your backend URL: `https://guidance-academy-api.onrender.com`

### Step 6: Run Database Migrations
After deployment, you need to run migrations:

1. Go to your web service in Render
2. Click **"Shell"** tab (opens a terminal)
3. Run:
```bash
php artisan migrate --force
php artisan db:seed --force
```

✅ **Backend is now live!** Save your backend URL for the next step.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your repository: `suleyman0931/Guidance-Language-Skills-Academy`
3. Configure import:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - Click **"Edit"** next to Root Directory and select `frontend` folder

### Step 3: Configure Environment Variables
Before deploying, add environment variable:

Click **"Environment Variables"** section and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://guidance-academy-api.onrender.com` |

*(Replace with your actual Render backend URL from Part 1)*

### Step 4: Deploy
1. Click **"Deploy"**
2. Vercel will build and deploy (takes 2-3 minutes)
3. You'll get a URL like: `https://guidance-language-skills-academy.vercel.app`

### Step 5: Set Custom Domain (Optional)
1. In Vercel project settings → **"Domains"**
2. Add: `guidance-academy.vercel.app` or your custom domain
3. Follow Vercel's DNS instructions if using custom domain

### Step 6: Update Backend CORS Settings
Go back to Render and update the backend environment variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-actual-vercel-url.vercel.app` |

Click **"Save Changes"** - Render will redeploy automatically.

✅ **Frontend is now live!**

---

## 🧪 Testing Your Deployment

### Connect to Database Locally (Optional)

You can connect to your Render PostgreSQL database from your local machine using the **External Database URL**:

```bash
# Using psql command line
psql "postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com/guidance_academy"

# Or using the PSQL Command from Render dashboard:
PGPASSWORD=adDOsx4sJMolmeSTENMboI18XzqJkZn psql -h dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com -U guidance_academy_user guidance_academy
```

**Using GUI tools:**
- **TablePlus**: Use External Database URL
- **pgAdmin**: 
  - Host: `dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com`
  - Port: `5432`
  - Database: `guidance_academy`
  - Username: `guidance_academy_user`
  - Password: `adDOsx4sJMolmeSTENMboI18XzqJkZn`

### Test Backend API
```bash
# Health check
curl https://guidance-academy-api.onrender.com/api/health

# Test registration endpoint
curl https://guidance-academy-api.onrender.com/api/registrations
```

### Test Frontend
1. Visit your Vercel URL
2. Try registering a new account
3. Login and test the admin panel

---

## 🔧 Troubleshooting

### Backend Issues

**PostgreSQL connection failed:**
- Verify you're using the **Internal Database URL** (without `.oregon-postgres.render.com`) for your web service
- Check that all database credentials are copied exactly (no extra spaces)
- Ensure `DB_CONNECTION=pgsql` not `mysql` or `postgres`
- Verify the database is in the same region as your web service
- Check Render logs for specific connection errors

**Database connection failed:**
- Check that DB credentials in Render match your MySQL database
- Ensure database is in the same region as web service
- Verify internal database URL is being used (not external)

**500 errors:**
- Check Render logs: Go to service → **"Logs"** tab
- Verify `APP_KEY` is set correctly
- Make sure migrations ran successfully

**CORS errors:**
- Verify `FRONTEND_URL` matches your Vercel deployment URL exactly
- Check `backend/config/cors.php` allows your frontend domain

### Frontend Issues

**API connection failed:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check that backend URL is accessible
- Open browser console to see exact error

**Build failed:**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Try deploying from a clean commit

### Render Free Tier Limitations
- Web services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds to wake up
- Database has connection limits

To prevent spin-down, you can:
- Upgrade to paid plan ($7/month)
- Use a cron job to ping your API every 10 minutes

---

## 📊 Monitoring

### Render Dashboard
- View logs: Service → **"Logs"** tab
- Check metrics: Service → **"Metrics"** tab
- Database status: Database → **"Info"** tab

### Vercel Dashboard
- Build logs: Project → **"Deployments"** → Click deployment
- Analytics: Project → **"Analytics"** tab
- Real-time logs: Available on Pro plan

---

## 🔄 Redeployment

### Backend (Render)
- **Auto-deploy**: Push to `main` branch → Render deploys automatically
- **Manual deploy**: Render dashboard → **"Manual Deploy"** → Select branch

### Frontend (Vercel)
- **Auto-deploy**: Push to `main` branch → Vercel deploys automatically
- **Manual deploy**: Vercel dashboard → **"Deployments"** → **"Redeploy"**

---

## 🔐 Security Checklist

- ✅ `APP_DEBUG=false` in production
- ✅ Strong `APP_KEY` generated
- ✅ Database credentials secured
- ✅ CORS properly configured
- ✅ `.env` files not committed to git
- ✅ Use environment variables for secrets

---

## 💰 Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Render Web Service | Free | $0 |
| Render MySQL | Free | $0 |
| Vercel Hosting | Free | $0 |
| **Total** | | **$0/month** |

### When to Upgrade:
- Render Free: 750 hours/month, spins down after inactivity
- Upgrade to **Starter ($7/month)** for: Always-on, no spin-down
- Vercel Free: Unlimited personal projects
- Upgrade to **Pro ($20/month)** for: Team collaboration, analytics

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Laravel Docs**: https://laravel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎉 Your URLs

After deployment, save these:

| Service | URL |
|---------|-----|
| **Frontend** | `https://your-app.vercel.app` |
| **Backend API** | `https://guidance-academy-api.onrender.com` |
| **GitHub Repo** | `https://github.com/suleyman0931/Guidance-Language-Skills-Academy` |

---

**Happy Deploying! 🚀**
