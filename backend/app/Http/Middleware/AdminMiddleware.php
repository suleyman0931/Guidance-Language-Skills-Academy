<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        \Log::info('AdminMiddleware: Checking admin access', [
            'has_user' => $request->user() !== null,
            'user_id' => $request->user()?->id,
            'user_role' => $request->user()?->role,
            'path' => $request->path(),
            'method' => $request->method(),
        ]);

        if (!$request->user()) {
            \Log::warning('AdminMiddleware: No authenticated user');
            return response()->json(['message' => 'Unauthorized: Please login'], 401);
        }

        if ($request->user()->role !== 'admin') {
            \Log::warning('AdminMiddleware: User is not admin', [
                'user_id' => $request->user()->id,
                'role' => $request->user()->role,
            ]);
            return response()->json(['message' => 'Forbidden: Admin access only'], 403);
        }

        \Log::info('AdminMiddleware: Admin access granted', ['user_id' => $request->user()->id]);
        return $next($request);
    }
}
