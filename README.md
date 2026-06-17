# Guidance Language & Skills Academy

**Full-stack monorepo** — Next.js 14 frontend (Vercel) + Laravel 11 backend (Render via Docker)

## 📁 Project Structure
```
guidance-academy/
├── frontend/              ← Next.js 14 → deploy to Vercel
├── backend/               ← Laravel 11 + Docker → deploy to Render
├── README.md
├── QUICK_START.md         ← ⚡ 15-minute quick deploy
├── DEPLOYMENT_GUIDE.md    ← 📘 Complete deployment instructions
├── DATABASE_INFO.md       ← 🗄️ Database connection details
└── TROUBLESHOOTING.md     ← 🔧 Common issues & solutions
```

## 🚀 Quick Deploy

**👉 See [QUICK_START.md](./QUICK_START.md) for 15-minute deployment**  
**👉 See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions**  
**👉 See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) if you encounter issues**

### Quick Links:
- 🔗 **GitHub Repo**: https://github.com/suleyman0931/Guidance-Language-Skills-Academy
- 🗄️ **Database Info**: [DATABASE_INFO.md](./DATABASE_INFO.md)
- 🌐 **Deploy Backend**: [render.com](https://render.com) (Free tier)
- 🌐 **Deploy Frontend**: [vercel.com](https://vercel.com) (Free tier)

---

## 1. Backend — Deploy to Render

### One-click steps
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Render auto-detects `Dockerfile` — select **Docker** runtime
5. Add these environment variables in Render dashboard:

| Key | Value |
|-----|-------|
| `APP_KEY` | Run `php artisan key:generate --show` locally first |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | *(your Render MySQL host)* |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | `guidance_academy` |
| `DB_USERNAME` | *(your DB user)* |
| `DB_PASSWORD` | *(your DB password)* |
| `FRONTEND_URL` | `https://GuidanceAcademy.vercel.app` |

6. Deploy! Render builds via Docker and runs on port 8080.

### Render MySQL setup
- Go to Render → **New PostgreSQL** or use PlanetScale/Railway for MySQL
- Copy the connection details into the env vars above

---

## 2. Frontend — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add environment variable:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` |

4. Deploy! Your site will be live at `https://GuidanceAcademy.vercel.app`
   (Set this as your custom domain in Vercel project settings)

---

## Local Development

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve  # runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
# create .env.local:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev  # runs on http://localhost:3000
```

### Docker local test
```bash
cd backend
docker build -t guidance-backend .
docker run -p 8080:8080 --env-file .env guidance-backend
```
