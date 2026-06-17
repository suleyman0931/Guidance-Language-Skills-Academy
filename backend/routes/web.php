<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn() => response()->json([
    'name'    => 'Guidance Academy API',
    'version' => '1.0.0',
    'status'  => 'running',
    'docs'    => '/api/health',
]));
