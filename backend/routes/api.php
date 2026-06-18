<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PromotionalImageController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

// Health
Route::get('/health', fn() => response()->json([
    'status'    => 'ok',
    'service'   => 'Guidance Academy API',
    'timestamp' => now()->toIso8601String(),
]));

// Debug endpoint - check database
Route::get('/debug/tables', function() {
    try {
        $tables = \DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
        $counts = [
            'registrations' => \DB::table('registrations')->count(),
            'users' => \DB::table('users')->count(),
            'posts' => \DB::table('posts')->count(),
            'promotional_images' => \DB::table('promotional_images')->count(),
            'personal_access_tokens' => \DB::table('personal_access_tokens')->count(),
        ];
        return response()->json([
            'status' => 'ok',
            'tables' => $tables,
            'counts' => $counts,
            'admin_exists' => \DB::table('users')->where('username', 'admin')->exists(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

// Debug endpoint - check storage
Route::get('/debug/storage', function() {
    try {
        $storagePath = storage_path('app/public/promotional_images');
        $publicPath = public_path('storage');
        
        return response()->json([
            'status' => 'ok',
            'storage_path' => $storagePath,
            'storage_exists' => is_dir($storagePath),
            'storage_writable' => is_writable(storage_path('app/public')),
            'public_path' => $publicPath,
            'public_link_exists' => is_link($publicPath),
            'disk_config' => config('filesystems.disks.public'),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

// Public: registration
Route::post('/registrations', [RegistrationController::class, 'store']);

// Public: auth
Route::post('/auth/login',         [AuthController::class, 'login']);
Route::post('/auth/setup-account', [AuthController::class, 'setupAccount']);
Route::get('/auth/check-username/{username}', [AuthController::class, 'checkUsername']);

// Public: posts
Route::get('/posts', [PostController::class, 'publicIndex']);

// Public: promotional images
Route::get('/promotional-images', [PromotionalImageController::class, 'index']);

// Authenticated
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
});

// Admin only
Route::middleware(['auth:sanctum', \App\Http\Middleware\AdminMiddleware::class])
    ->prefix('admin')
    ->group(function () {
        Route::get('/students',               [RegistrationController::class, 'index']);
        Route::get('/students/{id}',          [RegistrationController::class, 'show']);
        Route::patch('/students/{id}/status', [RegistrationController::class, 'updateStatus']);
        Route::delete('/students/{id}',       [RegistrationController::class, 'destroy']);
        Route::get('/stats',                  [RegistrationController::class, 'stats']);

        Route::get('/posts',                       [PostController::class, 'index']);
        Route::post('/posts',                      [PostController::class, 'store']);
        Route::put('/posts/{id}',                  [PostController::class, 'update']);
        Route::delete('/posts/{id}',               [PostController::class, 'destroy']);
        Route::patch('/posts/{id}/toggle-publish', [PostController::class, 'togglePublish']);

        // Promotional images management
        Route::get('/promotional-images',           [PromotionalImageController::class, 'adminIndex']);
        Route::post('/promotional-images',          [PromotionalImageController::class, 'store']);
        Route::put('/promotional-images/{id}',      [PromotionalImageController::class, 'update']);
        Route::patch('/promotional-images/{id}/toggle', [PromotionalImageController::class, 'toggleActive']);
        Route::delete('/promotional-images/{id}',   [PromotionalImageController::class, 'destroy']);
    });
