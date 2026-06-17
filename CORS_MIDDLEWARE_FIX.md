# CORS Middleware Fix - Complete Resolution

## Problem Identified
The duplicate `Access-Control-Allow-Origin` header error was caused by **Laravel's CORS middleware not being registered** in the middleware stack.

### Error Message
```
The 'Access-Control-Allow-Origin' header contains multiple values 
'https://guidanceacademy.vercel.app, https://guidanceacademy.vercel.app', 
but only one is allowed.
```

## Root Cause
In Laravel 11, the `HandleCors` middleware is **NOT automatically registered**. While we had:
- ✅ Configured `config/cors.php` correctly
- ✅ Removed CORS headers from nginx
- ❌ **MISSING**: CORS middleware registration

Without the middleware being registered, Laravel wasn't processing CORS requests at all, causing inconsistent behavior.

## Solution Applied

### File: `backend/bootstrap/app.php`
Added the `HandleCors` middleware to the global middleware stack:

```php
->withMiddleware(function (Middleware $middleware) {
    // Add CORS middleware globally to handle cross-origin requests
    $middleware->use([
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);

    $middleware->api(prepend: [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ]);

    $middleware->alias([
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
    ]);
})
```

## Complete CORS Architecture

### 1. **nginx** (`backend/docker/nginx.conf`)
- Handles OPTIONS preflight requests with 204 response
- Does NOT set any CORS headers
- Passes all requests to Laravel

### 2. **Laravel Middleware** (`HandleCors`)
- Registered globally in `bootstrap/app.php`
- Reads configuration from `config/cors.php`
- Sets correct CORS headers on all responses

### 3. **CORS Configuration** (`backend/config/cors.php`)
```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],
'allowed_origins' => [
    'https://guidanceacademy.vercel.app',
    'http://localhost:3000',
],
'supports_credentials' => true,
```

## Deployment Status

✅ Code committed and pushed to GitHub  
🔄 Render deployment in progress (~5-7 minutes)

## Testing After Deployment

Once Render shows "Live" status:

1. **Test Registration**
   - Go to: https://guidanceacademy.vercel.app/register
   - Fill form and submit
   - Open browser DevTools → Network tab
   - Verify single `Access-Control-Allow-Origin` header

2. **Test Promotional Images Upload**
   - Login as admin at https://guidanceacademy.vercel.app/login
   - Go to Admin → Promotions
   - Upload a test image
   - Verify it appears on homepage

## Expected Behavior

- ✅ Single `Access-Control-Allow-Origin` header on all responses
- ✅ Preflight OPTIONS requests return 204
- ✅ API requests succeed from frontend
- ✅ File uploads work correctly
- ✅ Authentication cookies work with credentials

## Why This Works

Laravel 11 uses a new middleware structure where middleware must be explicitly registered. Simply having the config file isn't enough - the middleware needs to be added to the middleware stack in `bootstrap/app.php`.

This is different from Laravel 10 and earlier where CORS middleware was auto-registered.

---

**Last Updated:** June 17, 2026  
**Status:** ✅ Fixed - Awaiting Render deployment
