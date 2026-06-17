# Local Development Setup Guide

This guide will help you run both the backend and frontend locally.

---

## 📋 Prerequisites

### Install These First:

1. **PHP 8.2+** 
   - Download: https://www.php.net/downloads
   - Or use XAMPP/Laragon (Windows): https://laragon.org/

2. **Composer** (PHP Package Manager)
   - Download: https://getcomposer.org/download/

3. **Node.js 18+** and **npm**
   - Download: https://nodejs.org/

4. **PostgreSQL** (Optional - we'll use SQLite for local)
   - Download: https://www.postgresql.org/download/
   - Or skip and use SQLite (simpler)

---

## 🔧 Backend Setup (Laravel API)

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

This will install all Laravel packages (takes 2-3 minutes).

### Step 3: Create Environment File

Copy the example environment file:

```bash
copy .env.example .env
```

Or on Mac/Linux:
```bash
cp .env.example .env
```

### Step 4: Configure Database (SQLite - Easiest)

Open `backend/.env` and change these lines:

```env
# Change FROM:
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Change TO (SQLite):
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=database.sqlite
# DB_USERNAME=root
# DB_PASSWORD=
```

Create the SQLite database file:

```bash
# Windows
type nul > database/database.sqlite

# Mac/Linux
touch database/database.sqlite
```

### Step 5: Generate Application Key

```bash
php artisan key:generate
```

This sets `APP_KEY` in your `.env` file.

### Step 6: Run Migrations & Seed Database

```bash
php artisan migrate:fresh --seed
```

This will:
- Create all database tables
- Create admin user (username: `admin`, password: `Admin@2024!`)

### Step 7: Create Storage Link

```bash
php artisan storage:link
```

### Step 8: Start Laravel Server

```bash
php artisan serve
```

You should see:
```
INFO  Server running on [http://127.0.0.1:8000].
```

**✅ Backend is now running at: http://localhost:8000**

### Test Backend:

Open browser or Postman:
```
GET http://localhost:8000/api/health
```

Should return:
```json
{
  "status": "ok",
  "service": "Guidance Academy API"
}
```

---

## 🎨 Frontend Setup (Next.js)

### Step 1: Navigate to Frontend Folder

Open a **NEW terminal window** (keep backend running), then:

```bash
cd frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

This installs all React/Next.js packages (takes 2-3 minutes).

### Step 3: Create Environment File

Create `frontend/.env.local` file:

```bash
# Windows
type nul > .env.local

# Mac/Linux
touch .env.local
```

Open `frontend/.env.local` and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This tells frontend to connect to your local backend.

### Step 4: Start Next.js Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in Xs
```

**✅ Frontend is now running at: http://localhost:3000**

---

## 🧪 Test Everything Locally

### 1. Open Frontend
Visit: http://localhost:3000

### 2. Test Registration
1. Go to: http://localhost:3000/register
2. Fill out form
3. Submit

### 3. Test Login
1. Go to: http://localhost:3000/login
2. Username: `admin`
3. Password: `Admin@2024!`
4. Click Login

### 4. Test Admin Panel
After login, you should be redirected to:
http://localhost:3000/admin

Try uploading promotional images!

---

## 🔍 Troubleshooting

### Backend Issues

**Error: "composer: command not found"**
- Install Composer: https://getcomposer.org/download/

**Error: "could not find driver"**
- Install PHP PDO extension
- For SQLite: Enable `extension=pdo_sqlite` in `php.ini`
- For PostgreSQL: Enable `extension=pdo_pgsql` in `php.ini`

**Error: "Class 'PDO' not found"**
- Enable `extension=pdo` in `php.ini`

**Port 8000 already in use:**
```bash
php artisan serve --port=8001
```
Then update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

**Database table doesn't exist:**
```bash
php artisan migrate:fresh --seed
```

**Storage folder permission error:**
```bash
# Windows (run as Administrator)
icacls "storage" /grant Users:F /t

# Mac/Linux
chmod -R 775 storage bootstrap/cache
```

### Frontend Issues

**Error: "npm: command not found"**
- Install Node.js: https://nodejs.org/

**Error: "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use:**
- Next.js will automatically suggest port 3001
- Or specify: `npm run dev -- --port 3001`

**CORS error in browser:**
- Make sure backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Restart frontend: `Ctrl+C` then `npm run dev`

**API connection refused:**
- Verify backend is running at http://localhost:8000
- Check `backend/.env` has `APP_DEBUG=true`
- Check backend terminal for errors

---

## 📝 Quick Commands Reference

### Backend (in `backend/` folder):
```bash
# Install dependencies
composer install

# Run migrations
php artisan migrate:fresh --seed

# Start server
php artisan serve

# Clear cache (if needed)
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Check routes
php artisan route:list

# Access tinker (database console)
php artisan tinker
```

### Frontend (in `frontend/` folder):
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clear cache
rm -rf .next
```

---

## 🎯 Expected URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Health** | http://localhost:8000/api/health |
| **API Debug** | http://localhost:8000/api/debug/tables |
| **Register** | http://localhost:3000/register |
| **Login** | http://localhost:3000/login |
| **Admin** | http://localhost:3000/admin |

---

## 🔐 Default Credentials

```
Username: admin
Password: Admin@2024!
```

---

## 💡 Development Tips

1. **Keep both terminals open** - one for backend, one for frontend
2. **Use `APP_DEBUG=true`** in `backend/.env` to see detailed errors
3. **Check browser console** (F12) for frontend errors
4. **Check backend terminal** for API errors
5. **Use Postman** to test API endpoints directly

---

## 🚀 Next Steps

Once everything works locally:

1. Fix any issues you find
2. Test all features (registration, login, admin, images)
3. Commit fixes to GitHub
4. Render will auto-deploy

Working locally makes debugging **much faster**!

---

## 📚 Helpful Commands

### Check if servers are running:

```bash
# Check backend (should return JSON)
curl http://localhost:8000/api/health

# Check frontend (should return HTML)
curl http://localhost:3000
```

### Stop servers:

- Press `Ctrl + C` in each terminal

---

Need help? Share the error messages and I'll help you fix them!
