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
     * Setup account after registration — creates User linked to registration.
     */
    public function setupAccount(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'registration_id'       => 'required|integer|exists:registrations,id',
            'username'              => ['required', 'string', 'min:3', 'max:40', 'unique:users,username', 'regex:/^[a-zA-Z0-9_]+$/'],
            'password'              => 'required|string|min:8|confirmed',
        ]);

        if ($v->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $v->errors()], 422);
        }

        // Ensure no account already exists for this registration
        $existing = User::where('registration_id', $request->registration_id)->first();
        if ($existing) {
            return response()->json(['message' => 'Account already exists for this registration.'], 409);
        }

        $reg  = Registration::findOrFail($request->registration_id);

        $user = User::create([
            'registration_id' => $reg->id,
            'username'        => strtolower($request->username),
            'name_en'         => $reg->name_en,
            'name_am'         => $reg->name_am,
            'phone'           => $reg->phone,
            'password'        => Hash::make($request->password),
            'role'            => 'student',
        ]);

        $token = $user->createToken('ga_token')->plainTextToken;

        return response()->json([
            'message' => 'Account created successfully',
            'user'    => $this->userResource($user),
            'token'   => $token,
        ], 201);
    }

    /**
     * Login with username + password.
     */
    public function login(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
        if ($v->fails()) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('username', strtolower($request->username))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid username or password'], 401);
        }

        // Revoke old tokens to keep it clean
        $user->tokens()->delete();
        $token = $user->createToken('ga_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user'    => $this->userResource($user),
            'token'   => $token,
        ]);
    }

    /**
     * Return authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userResource($request->user())]);
    }

    /**
     * Logout — revoke current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out']);
    }

    /**
     * Check if a username is available.
     */
    public function checkUsername(string $username): JsonResponse
    {
        $taken = User::where('username', strtolower($username))->exists();
        return response()->json(['available' => !$taken]);
    }

    // ── Private helper ────────────────────────────────────────────────────────

    private function userResource(User $user): array
    {
        return [
            'id'       => $user->id,
            'username' => $user->username,
            'name_en'  => $user->name_en,
            'name_am'  => $user->name_am,
            'phone'    => $user->phone,
            'role'     => $user->role,
        ];
    }
}