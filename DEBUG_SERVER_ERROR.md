# Debugging Server Error - Step by Step

## Error Received
```json
{
  "message": "Server Error"
}
```

This is Laravel's generic error response when an exception occurs and `APP_DEBUG=false`.

---

## Common Causes

### 1. **Database Not Connected**
- Migration tables don't exist
- Database credentials incorrect
- PostgreSQL SSL connection failed

### 2. **APP_KEY Not Set**
- Laravel needs APP_KEY for encryption
- Session/cookie handling fails without it

### 3. **Migration Not Run**
- Tables don't exist (`registrations`, `users`, etc.)
- Queries fail with "table not found"

### 4. **File Permissions**
- Storage folder not writable
- Cache folder not writable

### 5. **PHP Extensions Missing**
- PDO PostgreSQL not installed
- Required extensions not available

---

## How to Check Render Logs

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Click on your service: **"guidance-language-skills-academy"**
3. Click **"Logs"** tab

### Step 2: Look for Error Messages
Search for these keywords in logs:
- `ERROR`
- `SQLSTATE`
- `Exception`
- `table`
- `connection`
- `APP_KEY`

### Step 3: Check Deployment Status
Look for these messages:
- ✅ `==> Starting Guidance Academy API...`
- ✅ `==> PostgreSQL SSL mode set to: prefer`
- ✅ `==> Running migrations...`
- ✅ `==> Creating storage link...`
- ❌ Any error messages

---

## Quick Diagnostic Tests

### Test 1: Check if Migrations Ran

**In Render Logs, look for:**
```
==> Running migrations...
Migration table created successfully.
Migrating: 2024_01_01_000001_create_registrations_table
Migrated:  2024_01_01_000001_create_registrations_table (XX ms)
Migrating: 2024_01_01_000002_create_users_table
Migrated:  2024_01_01_000002_create_users_table (XX ms)
...
```

**If NOT found:** Migrations failed - database connection issue

### Test 2: Check APP_KEY

**In Render Environment Variables:**
1. Go to service → Environment
2. Check if `APP_KEY` exists
3. Should look like: `base64:xxxxxxxxxxxxxx...`

**If missing:** Add it manually in Render dashboard

### Test 3: Check Database Connection

**In Render Logs, look for:**
```
SQLSTATE[08006] [7] could not connect to server
```
or
```
Connection refused
```

**If found:** Database connection failed

---

## Solutions Based on Log Output

### If Migration Failed

**Add this to Render Environment:**
```
DB_CONNECTION=pgsql
DB_HOST=<your-postgres-host>
DB_PORT=5432
DB_DATABASE=<your-db-name>
DB_USERNAME=<your-username>
DB_PASSWORD=<your-password>
DATABASE_URL=<full-postgres-url>
PGSSLMODE=prefer
```

Then trigger manual deploy.

### If APP_KEY Missing

**In Render Dashboard:**
1. Go to Environment tab
2. Add new variable:
   - Key: `APP_KEY`
   - Value: `base64:` followed by 32 random bytes in base64
3. Or generate: Run `php artisan key:generate --show` locally and copy

### If Storage Not Writable

**Check entrypoint.sh runs:**
```bash
php artisan storage:link
```

Should see in logs:
```
==> Creating storage link...
The [public/storage] link has been connected to [storage/app/public].
```

---

## Manual Deploy Trigger

If you made environment variable changes:
1. Go to Render Dashboard
2. Click service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait 5-7 minutes
5. Check logs for errors

---

## Enable Debug Mode (Temporarily)

**WARNING:** Only for testing, not for production!

In Render Environment:
1. Add: `APP_DEBUG=true`
2. Redeploy
3. Test API in Postman
4. You'll see detailed error with stack trace
5. **IMPORTANT:** Set back to `false` after fixing!

---

## Check Which Tables Exist

If you have database access, run:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Expected tables:
- `migrations`
- `registrations`
- `users`
- `personal_access_tokens`
- `posts`
- `promotional_images`

---

## Test Locally First

To verify the code works:

```bash
# In backend folder
php artisan migrate:fresh --seed
php artisan serve

# Test
curl http://localhost:8000/api/health
```

If it works locally but not on Render → deployment/environment issue
If it fails locally too → code issue

---

## Most Likely Issue

Based on the timing, the most likely cause is:

**🔴 Render deployment hasn't finished yet**

The latest commit `d3d565b` includes:
- New nginx configuration
- Docker image needs to rebuild
- Takes 5-7 minutes

**Check:**
1. Render dashboard shows "Building" or "Deploying"?
2. If YES → Wait for "Live" status
3. Then test again

---

## Next Steps

1. **Check Render Logs** - Share the error output
2. **Check Deployment Status** - Is it "Live"?
3. **Check Environment Variables** - Is APP_KEY set?
4. **Share specific error** - What do logs say?

---

Would you like me to:
- [ ] Check Render deployment status
- [ ] Add APP_DEBUG=true temporarily to see detailed error
- [ ] Review environment variables
- [ ] Create a manual migration trigger

Let me know what you see in the Render logs!
