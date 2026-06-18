# Missing Laravel Config Files - CRITICAL FIX

## Problem Identified
The promotional image upload was failing with:
```
No 'Access-Control-Allow-Origin' header is present on the requested resource
POST .../api/admin/promotional-images net::ERR_FAILED 500 (Internal Server Error)
```

## Root Cause
**Missing Laravel configuration files** caused the framework to use internal defaults. When `auth:sanctum` + `AdminMiddleware` + file upload combined, Laravel crashed **before** CORS headers could be attached to the response.

### Files That Were Missing:
1. ❌ `backend/config/auth.php` - Auth guard configuration
2. ❌ `backend/config/sanctum.php` - Sanctum stateful domains configuration
3. ❌ `backend/app/Http/Controllers/Controller.php` (fixed earlier)
4. ❌ `storage/app/public` directory (fixed earlier)

## Solution Applied

### 1. Created `backend/config/auth.php`
Defines proper auth guards including the `sanctum` guard needed for API authentication.

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'sanctum' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

### 2. Created `backend/config/sanctum.php`
Defines stateful domains so Sanctum knows to trust requests from Vercel frontend.

```php
'stateful' => explode(',', env(
    'SANCTUM_STATEFUL_DOMAINS',
    'guidanceacademy.vercel.app,localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1'
)),
```

### 3. Updated `PromotionalImageController.php`
Changed from `catch (\Exception $e)` to `catch (\Throwable $e)` to catch **all** PHP errors including TypeError, not just Exceptions.

```php
} catch (\Throwable $e) {
    return response()->json([
        'success' => false,
        'message' => 'Failed to upload image: ' . $e->getMessage()
    ], 500);
}
```

This ensures that even if something fails, we get a proper JSON error with CORS headers instead of a crash.

## Testing Steps

### After Render Redeploys:

1. **Login to Admin Panel**
   - URL: https://guidanceacademy.vercel.app/admin
   - Username: `admin`
   - Password: `Admin@2024!`

2. **Navigate to Promotions**
   - Click "Promotions" in the admin sidebar

3. **Test Image Upload**
   - Click "Upload New Image"
   - Select an image (JPEG, PNG, WebP, max 2MB)
   - Add optional title/description
   - Click "Upload"

4. **Expected Results**
   - ✅ No CORS error
   - ✅ Success message: "Promotional image uploaded successfully"
   - ✅ Image appears in the list
   - ✅ Image displays on homepage gallery

5. **If Still Fails**
   - The `\Throwable` catch will now return a JSON error message
   - Check browser console for the actual error message
   - Share the error message for further debugging

## Why This Happened

Laravel projects typically copy config files from a fresh skeleton. This project appears to have been created without some standard config files, possibly due to:
- Manual project setup instead of `laravel new`
- Incomplete file copy from skeleton
- Gitignore accidentally excluding config files
- Files deleted accidentally

## Prevention

**Recommendation**: Compare the project against a fresh Laravel 11 skeleton to identify any other missing files:

```bash
# Create a fresh Laravel 11 project for comparison
composer create-project laravel/laravel laravel11-skeleton

# Compare config directories
diff -r laravel11-skeleton/config backend/config

# Check for other missing files
diff -r laravel11-skeleton/app backend/app
```

### Files to Verify Exist:
- ✅ `config/auth.php`
- ✅ `config/sanctum.php`
- ✅ `config/cors.php`
- ✅ `config/database.php`
- ✅ `config/filesystems.php`
- ❓ `config/session.php` (check if missing)
- ❓ `config/cache.php` (check if missing)
- ❓ `config/queue.php` (check if missing)

## Files Fixed So Far

| File | Status | When Fixed |
|------|--------|-----------|
| `app/Http/Controllers/Controller.php` | ✅ Fixed | Earlier session |
| `storage/app/public` | ✅ Fixed | Earlier session |
| `config/auth.php` | ✅ Fixed | This commit |
| `config/sanctum.php` | ✅ Fixed | This commit |

---

## Commit Details

**Commit**: `9c2091c`
**Branch**: `main`
**Pushed**: ✅ Yes
**Render Status**: Deploying automatically (if auto-deploy enabled) or needs manual trigger

---

**Date**: June 18, 2026
**Status**: Deployed - Waiting for Render to rebuild
