# 🚀 Quick Start - Run Locally in 5 Minutes

## Backend (Laravel API)

```bash
# 1. Go to backend folder
cd backend

# 2. Install dependencies (first time only)
composer install

# 3. Copy environment file
copy .env.local.example .env

# 4. Generate app key
php artisan key:generate

# 5. Create SQLite database file
type nul > database\database.sqlite

# 6. Run migrations and create admin user
php artisan migrate:fresh --seed

# 7. Create storage link
php artisan storage:link

# 8. Start backend server
php artisan serve
```

✅ Backend running at: **http://localhost:8000**

Test it: http://localhost:8000/api/health

---

## Frontend (Next.js)

**Open a NEW terminal window**, then:

```bash
# 1. Go to frontend folder
cd frontend

# 2. Install dependencies (first time only)
npm install

# 3. Create environment file
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local

# 4. Start frontend server
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

---

## 🧪 Test It

1. Open: http://localhost:3000
2. Try registration: http://localhost:3000/register
3. Login with:
   - Username: `admin`
   - Password: `Admin@2024!`

---

## 🛑 Stop Servers

Press `Ctrl + C` in each terminal

---

## 🔧 If Something Goes Wrong

### Backend won't start?

```bash
# Clear cache
php artisan cache:clear
php artisan config:clear

# Re-run migrations
php artisan migrate:fresh --seed

# Try again
php artisan serve
```

### Frontend won't start?

```bash
# Delete and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### "composer not found"?

Install Composer: https://getcomposer.org/download/

### "npm not found"?

Install Node.js: https://nodejs.org/

---

## 📝 That's It!

Both frontend and backend are now running locally. Any errors you see will help us fix the production deployment too!
