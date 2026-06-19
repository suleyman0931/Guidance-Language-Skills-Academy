<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login - authenticate user and return token
     */
    public function login(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($v->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $v->errors()], 422);
        }

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'is_admin' => $user->role === 'admin',
            ],
        ]);
    }

    /**
     * Logout - revoke current token
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'is_admin' => $user->role === 'admin',
                'registration_id' => $user->registration_id,
            ],
        ]);
    }

    /**
     * Setup account - allow approved registration to create username/password
     */
    public function setupAccount(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'registration_id' => 'required|integer|exists:registrations,id',
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:users,username', 'regex:/^[a-zA-Z0-9_]+$/'],
            'password' => 'required|string|min:8',
        ]);

        if ($v->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $v->errors()], 422);
        }

        // Check if registration exists
        $registration = Registration::findOrFail($request->registration_id);
        
        // No approval check - allow anyone to create account after registration

        // Check if username already exists for this registration
        $existingUser = User::where('registration_id', $request->registration_id)->first();
        if ($existingUser) {
            return response()->json(['message' => 'Account already setup for this registration'], 409);
        }

        // Create user
        $user = User::create([
            'registration_id' => $request->registration_id,
            'username' => $request->username,
            'name_en' => $registration->name_en,
            'name_am' => $registration->name_am,
            'phone' => $registration->phone,
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Account created successfully',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'is_admin' => $user->role === 'admin',
            ],
        ], 201);
    }

    /**
     * Check if username is available
     */
    public function checkUsername(string $username): JsonResponse
    {
        $exists = User::where('username', $username)->exists();
        return response()->json(['available' => !$exists]);
    }
}
