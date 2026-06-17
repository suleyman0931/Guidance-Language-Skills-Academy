# Force Database Migrations to Run

## Problem

```
INFO Nothing to migrate.
```

Laravel thinks migrations have already run, but tables may not exist, causing "Server Error" when trying to query them.

---

## Solution: Force Fresh Migration

You need to connect to Render Shell and run migration commands manually.

### Step 1: Open Render Shell

1. Go to: https://dashboard.render.com
2. Click your service: **"guidance-language-skills-academy"**
3. Click **"Shell"** tab (top right)
4. Wait for shell to connect

### Step 2: Check Current Database State

In the shell, run:
```bash
php artisan tinker
```

Then type:
```php
\DB::table('registrations')->count();
```

**If you get an error** like `relation "registrations" does not exist`, the table is missing!

Type `exit` to leave tinker.

### Step 3: Run Fresh Migrations

Run this command to recreate all tables:
```bash
php artisan migrate:fresh --seed --force
```

This will:
- Drop all existing tables
- Run all migrations from scratch
- Seed the database with admin user

**Expected output:**
```
Dropped all tables successfully.
Migration table created successfully.
Migrating: 2024_01_01_000001_create_registrations_table
Migrated:  2024_01_01_000001_create_registrations_table (XX ms)
Migrating: 2024_01_01_000002_create_users_table
Migrated:  2024_01_01_000002_create_users_table (XX ms)
Migrating: 2024_01_01_000003_create_personal_access_tokens_table
Migrated:  2024_01_01_000003_create_personal_access_tokens_table (XX ms)
Migrating: 2024_01_01_000004_create_posts_table
Migrated:  2024_01_01_000004_create_posts_table (XX ms)
Migrating: 2024_01_01_000005_create_promotional_images_table
Migrated:  2024_01_01_000005_create_promotional_images_table (XX ms)
Seeding: DatabaseSeeder
Seeded:  DatabaseSeeder (XX ms)
Database seeding completed successfully.
```

### Step 4: Verify Tables Exist

```bash
php artisan tinker
```

```php
// Check each table
\DB::table('registrations')->count();  // Should return 0
\DB::table('users')->count();          // Should return 1 (admin)
\DB::table('posts')->count();          // Should return 0
\DB::table('promotional_images')->count(); // Should return 0

exit
```

All should return numbers (not errors).

---

## Alternative: If Shell Doesn't Work

### Add Environment Variable to Force Migration

1. In Render Dashboard → Environment tab
2. Add new variable:
   - Key: `FORCE_MIGRATE`
   - Value: `true`
3. Save changes

Then update `entrypoint.sh` to check this variable and run `migrate:fresh`.

---

## After Migrations Run

### Test in Postman

**1. Health Check:**
```
GET https://guidance-language-skills-academy.onrender.com/api/health
```
Should return 200 OK.

**2. Registration:**
```
POST https://guidance-language-skills-academy.onrender.com/api/registrations

Body:
{
  "name_en": "Test Student",
  "name_am": "ፈተና ተማሪ",
  "phone": "0912345678",
  "grade": "grade10",
  "purpose": "Language Learning",
  "referral": "friends",
  "lang": "en"
}
```

Should return **201 Created** with registration data!

**3. Login:**
```
POST https://guidance-language-skills-academy.onrender.com/api/auth/login

Body:
{
  "username": "admin",
  "password": "Admin@2024!"
}
```

Should return **200 OK** with token!

---

## Why This Happened

The `entrypoint.sh` runs `php artisan migrate --force` which only runs NEW migrations. If Laravel's `migrations` table already exists and shows all migrations as "done", it skips them - even if the actual data tables are missing or incomplete.

`migrate:fresh` forces a complete rebuild.

---

## Next Steps

1. Open Render Shell
2. Run `php artisan migrate:fresh --seed --force`
3. Verify tables exist in tinker
4. Test API in Postman
5. Share results!

If you can't access shell, let me know and I'll add the force migration logic to the entrypoint script.
