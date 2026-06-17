# ⚡ Quick Fix: SSL Connection Error

## The Error:
```
SSL connection has been closed unexpectedly
```

## The Solution (2 Minutes):

### Option 1: Use DATABASE_URL (Easiest - Recommended ✅)

Go to your Render web service → **Environment** tab:

1. **Delete these variables** (if they exist):
   - `DB_HOST`
   - `DB_PORT`
   - `DB_DATABASE`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `DB_CONNECTION`

2. **Add ONE variable**:
   ```
   DATABASE_URL=postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com:5432/guidance_academy?sslmode=require
   ```

3. Keep these variables:
   - `APP_NAME`
   - `APP_ENV`
   - `APP_DEBUG`
   - `APP_KEY`
   - `APP_URL`
   - `FRONTEND_URL`

4. Click **Save Changes**

5. Wait 5-10 minutes for redeploy

---

### Option 2: Add SSL Mode to Existing Variables

If you want to keep separate DB variables:

1. **Update `DB_HOST`**:
   ```
   DB_HOST=dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com
   ```

2. **Add new variable**:
   ```
   DB_SSLMODE=require
   ```

3. Click **Save Changes**

---

## Why This Works:

Render PostgreSQL databases **require SSL connections**. The `?sslmode=require` parameter tells Laravel to use SSL when connecting to the database.

The code has been updated to support this - you just need to set the environment variable!

---

## ✅ Expected Result:

After redeployment, you should see:

```
==> Starting Guidance Academy API...
==> Discovering packages...
INFO  Discovering packages.
==> Caching configuration...
INFO  Configuration cached successfully.
==> Running migrations...
Migration table created successfully.
Migrating: 2024_01_01_000001_create_registrations_table
Migrated:  2024_01_01_000001_create_registrations_table
...
==> Seeding database (first run)...
Database seeding completed successfully.
==> Starting services...
```

---

## 🎉 That's It!

Your backend should now connect successfully to the PostgreSQL database with SSL.

**Next**: Deploy your frontend on Vercel!
