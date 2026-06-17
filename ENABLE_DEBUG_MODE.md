# Enable Debug Mode - See Actual Errors

## Current Status

✅ **Deployment**: Building (commit `329bbc2`)  
✅ **Fix Applied**: Disabled crashing laravel-worker  
⏳ **Wait**: 5-7 minutes for deployment  

---

## After Deployment: Enable Debug Mode

### Step 1: Add APP_DEBUG Environment Variable

1. Go to: https://dashboard.render.com
2. Click your service: **"guidance-language-skills-academy"**
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `APP_DEBUG`
   - **Value**: `true`
6. Click **"Save Changes"**
7. Service will auto-restart (takes 30-60 seconds)

### Step 2: Test in Postman Again

**Test Registration:**
```
POST https://guidance-language-skills-academy.onrender.com/api/registrations

Headers:
  Content-Type: application/json
  Accept: application/json

Body:
{
  "name_en": "Test Student",
  "name_am": "ፈተና ተማሪ",
  "phone": "0912345678",
  "grade": "Grade 10",
  "purpose": "Language Learning",
  "referral": "Friend",
  "lang": "en"
}
```

**Now you'll see detailed error like:**
```json
{
  "message": "SQLSTATE[42P01]: Undefined table: 7 ERROR:  relation \"registrations\" does not exist",
  "exception": "Illuminate\\Database\\QueryException",
  "file": "/var/www/html/vendor/laravel/framework/...",
  "line": 123,
  "trace": [...]
}
```

### Step 3: Share the Error

Copy the full error message and share it. It will tell us exactly what's wrong.

---

## Most Likely Errors & Solutions

### Error 1: Table doesn't exist
```
SQLSTATE[42P01]: Undefined table: relation "registrations" does not exist
```

**Solution**: Run migrations manually:
```bash
# In Render Shell
php artisan migrate:fresh --seed --force
```

### Error 2: Column doesn't exist  
```
SQLSTATE[42703]: Undefined column: column "xxx" does not exist
```

**Solution**: Migration schema mismatch, need to update migration file.

### Error 3: Database connection refused
```
SQLSTATE[08006]: Connection refused
```

**Solution**: Check DATABASE_URL environment variable.

### Error 4: APP_KEY issue
```
No application encryption key has been specified
```

**Solution**: Already fixed in entrypoint (auto-generates).

---

## Quick Database Check

If you want to verify database directly:

### Connect to Render Shell

1. In Render Dashboard → Your service
2. Click **"Shell"** tab
3. Run commands:

```bash
# Check if tables exist
php artisan tinker
>>> \DB::table('information_schema.tables')->where('table_schema', 'public')->pluck('table_name');

# Check registrations table
>>> \DB::table('registrations')->count();

# Check users table
>>> \DB::table('users')->count();

# Exit
>>> exit
```

---

## After Getting Error Details

Once we see the actual error:

1. **If table missing**: Run `php artisan migrate:fresh --seed --force`
2. **If validation error**: Fix controller validation rules
3. **If database connection**: Check DATABASE_URL
4. **If other**: Share error and we'll fix

---

## Don't Forget

⚠️ **After fixing, DISABLE debug mode:**
1. Go back to Environment tab
2. Change `APP_DEBUG` to `false`
3. Save

Debug mode shows sensitive information - only for testing!

---

**Next Steps:**
1. Wait for current deployment (329bbc2) to complete
2. Add APP_DEBUG=true
3. Test in Postman
4. Share the error message
