# ⚡ Quick Start - Deploy in 15 Minutes

## Backend → Render (5 minutes)

1. **Sign up**: [render.com](https://render.com) with GitHub
2. **New PostgreSQL**: 
   - Name: `guidance-academy-db`
   - Database: `guidance_academy`
   - Plan: Free (requires credit card)
   - **Save the connection details!**
3. **New Web Service**: 
   - Repo: `Guidance-Language-Skills-Academy`
   - Root: `backend`
   - Runtime: Docker
4. **Add env vars** (use your actual database credentials):
   ```
   APP_KEY=base64:YOUR_GENERATED_KEY
   APP_ENV=production
   APP_DEBUG=false
   DB_CONNECTION=pgsql
   DB_HOST=dpg-xxxxxx-a
   DB_PORT=5432
   DB_DATABASE=guidance_academy
   DB_USERNAME=guidance_academy_user
   DB_PASSWORD=your_actual_password
   FRONTEND_URL=https://guidance-academy.vercel.app
   ```
   
   **Example from screenshot:**
   ```
   DB_HOST=dpg-d8p0f937u1sc73nh8rajp-a
   DB_USERNAME=guidance_academy_user
   DB_PASSWORD=adDOsx4sJMolmeSTENMboI18XzqJkZn
   ```
5. **Deploy** → Wait for build → Open **Shell** tab → Run:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

✅ Save backend URL: `https://guidance-academy-api.onrender.com`

---

## Frontend → Vercel (3 minutes)

1. **Sign up**: [vercel.com](https://vercel.com) with GitHub
2. **Import Project**: 
   - Repo: `Guidance-Language-Skills-Academy`
   - Root: `frontend`
3. **Add env var**:
   ```
   NEXT_PUBLIC_API_URL=https://guidance-academy-api.onrender.com
   ```
4. **Deploy** → Wait 2 mins

✅ Frontend live at: `https://guidance-academy.vercel.app`

---

## Update Backend CORS

Go back to Render → Update env var:
```
FRONTEND_URL=https://guidance-academy.vercel.app
```

---

## 🎉 Done!

Visit your frontend URL and test:
- User registration
- Login
- Admin panel

**Need help?** → See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
