# 🔧 Database Hostname Fix

## ❌ Error You're Seeing:

**Error 1: Hostname not resolved**
```
SQLSTATE[08006] [7] could not translate host name "dpg-d8p0f937u1sc73nh8rajp-a" to address: Name does not resolve
```

**Error 2: SSL connection closed**
```
SQLSTATE[08006] [7] connection to server at "dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com" (35.227.164.209), port 5432 failed: SSL connection has been closed unexpectedly
```

## 🎯 The Problem:

1. The short internal hostname `dpg-d8p0f937u1sc73nh8rajp-a` doesn't resolve
2. Render PostgreSQL requires **SSL connections** but Laravel isn't configured for it

You need to use the **full hostname** with the region suffix AND enable SSL mode.

---

## ✅ Solution: Use Full Hostname

### Option 1: Update Individual Variables (Current Setup)

Go to your Render web service → Environment tab → Edit `DB_HOST`:

**Change from:**
```
DB_HOST=dpg-d8p0f937u1sc73nh8rajp-a
```

**Change to:**
```
DB_HOST=dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com
```

**Also add SSL mode:**
```
DB_SSLMODE=require
```

This adds the `.oregon-postgres.render.com` suffix and enables required SSL mode.

---

### Option 2: Use DATABASE_URL (Recommended)

This is cleaner and more reliable. Replace all separate DB_* variables with a single `DATABASE_URL`:

**Remove these variables:**
- `DB_CONNECTION`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SSLMODE` (if present)

**Add this single variable:**
```
DATABASE_URL=postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com:5432/guidance_academy?sslmode=require
```

Note the `?sslmode=require` at the end - this is **critical** for Render PostgreSQL connections.

---

## 📝 Step-by-Step Fix

### If Using Option 1 (Update DB_HOST):

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your web service: `guidance-academy-api`
3. Go to **Environment** tab
4. Find `DB_HOST` variable
5. Click **Edit**
6. Change value to: `dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com`
7. **Add another variable** (click "Add Environment Variable"):
   - Key: `DB_SSLMODE`
   - Value: `require`
8. Click **Save Changes**
9. Service will automatically redeploy (wait 5-10 minutes)

### If Using Option 2 (Use DATABASE_URL):

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your web service: `guidance-academy-api`
3. Go to **Environment** tab
4. **Delete these variables** (click trash icon):
   - `DB_CONNECTION`
   - `DB_HOST`
   - `DB_PORT`
   - `DB_DATABASE`
   - `DB_USERNAME`
   - `DB_PASSWORD`
5. **Add new variable**:
   - Key: `DATABASE_URL`
   - Value: `postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com:5432/guidance_academy?sslmode=require`
6. Click **Save Changes**
7. Service will automatically redeploy (wait 5-10 minutes)

---

## 🔍 How to Get Your Exact Hostname

If you're not sure about your hostname:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **database** (not web service): `guidance-academy-db`
3. Look at the **"Connections"** section
4. Find **"Internal Database URL"** - it looks like:
   ```
   postgresql://user:password@hostname/database
   ```
5. The hostname is the part between `@` and `/`
6. Use that full hostname

---

## 🧪 Test the Fix

After redeployment completes:

1. Go to your web service
2. Click **Logs** tab
3. Look for these success messages:
   ```
   ==> Running migrations...
   Migration table created successfully.
   Migrating: 2024_01_01_000001_create_registrations_table
   Migrated:  2024_01_01_000001_create_registrations_table
   ```

4. Test your API:
   ```bash
   curl https://guidance-academy-api.onrender.com/api/health
   ```

---

## ⚠️ About the "View path not found" Warning

This warning is harmless:
```
In ViewClearCommand.php line 59:
View path not found.
```

It happens because your API-only Laravel app doesn't have a `resources/views` directory. You can ignore this warning - it doesn't affect functionality.

---

## 💡 Why This Happens

Render's internal DNS resolution can be inconsistent with short hostnames. Using the full hostname (with `.oregon-postgres.render.com`) ensures:

- ✅ Reliable DNS resolution
- ✅ Works across all Render services
- ✅ No connection issues

The full hostname is the **recommended approach** by Render's documentation.

---

## ✅ Expected Behavior After Fix

Your deployment logs should show:

```
==> Starting Guidance Academy API...
==> Discovering packages...
INFO  Discovering packages...
==> Caching configuration...
INFO  Configuration cached successfully.
==> Running migrations...
Migration table created successfully.
Migrating: 2024_01_01_000001_create_registrations_table
Migrated:  2024_01_01_000001_create_registrations_table
Migrating: 2024_01_01_000002_create_users_table
Migrated:  2024_01_01_000002_create_users_table
==> Seeding database (first run)...
Database seeding completed successfully.
==> Starting services...
```

---

## 🆘 Still Not Working?

If you still get connection errors after using the full hostname:

1. **Verify the database is running:**
   - Go to database in Render dashboard
   - Check status is "Available" (green)

2. **Verify region match:**
   - Database region: Oregon (US West)
   - Web service region: Should match

3. **Check database credentials:**
   - Go to database → Connections
   - Copy the exact values (no typos)

4. **Try external hostname temporarily:**
   - Use the **External Database URL** from your database
   - Example: `dpg-xxxxx-a.oregon-postgres.render.com`
   - Note: This is slower but confirms connectivity

---

**Quick Fix Summary:**

Change `DB_HOST` from `dpg-d8p0f937u1sc73nh8rajp-a` to `dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com`

That's it! 🎉
