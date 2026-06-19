<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'name_en'  => 'required|string|max:120',
            'name_am'  => 'required|string|max:120',
            'phone'    => ['required', 'string', 'regex:/^(09|07)\d{8}$/', 'unique:registrations,phone'],
            'grade'    => 'required|string|in:grade7,grade9,grade11,other',
            'purpose'  => 'required|string|max:1000',
            'referral' => 'required|string|in:telegram,friends,banner,other',
            'lang'     => 'sometimes|string|in:en,am',
        ]);

        if ($v->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $v->errors()], 422);
        }

        $reg = Registration::create([
            'name_en'  => trim($request->name_en),
            'name_am'  => trim($request->name_am),
            'phone'    => $request->phone,
            'grade'    => $request->grade,
            'purpose'  => $request->purpose,
            'referral' => $request->referral,
            'lang'     => $request->lang ?? 'en',
            'status'   => 'pending',
        ]);

        return response()->json([
            'message'         => 'Registration successful',
            'registration_id' => $reg->id,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Registration::query()->orderByDesc('created_at');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) =>
                $q->where('name_en', 'like', "%{$s}%")
                  ->orWhere('name_am', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%")
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Only filter by payment_status if column exists (migration has run)
        if ($request->filled('payment_status') && \Schema::hasColumn('registrations', 'payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $data = $query->paginate(20);

        // Attach username from users table
        $regIds = $data->pluck('id');
        $users  = User::whereIn('registration_id', $regIds)->pluck('username', 'registration_id');

        $data->getCollection()->transform(function ($reg) use ($users) {
            $reg->username = $users[$reg->id] ?? null;
            return $reg;
        });

        return response()->json($data);
    }

    public function show(int $id): JsonResponse
    {
        $reg = Registration::findOrFail($id);
        $user = User::where('registration_id', $id)->first();
        $reg->username = $user?->username;
        return response()->json(['data' => $reg]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $reg = Registration::findOrFail($id);
        $reg->update(['status' => $request->status]);
        return response()->json(['data' => $reg]);
    }

    public function updatePaymentStatus(Request $request, int $id): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'payment_status' => 'required|in:unpaid,paid',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $reg = Registration::findOrFail($id);
        $reg->update(['payment_status' => $request->payment_status]);
        return response()->json(['data' => $reg]);
    }

    public function destroy(int $id): JsonResponse
    {
        $reg = Registration::findOrFail($id);
        User::where('registration_id', $id)->delete();
        $reg->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'    => Registration::count(),
            'pending'  => Registration::where('status', 'pending')->count(),
            'approved' => Registration::where('status', 'approved')->count(),
            'rejected' => Registration::where('status', 'rejected')->count(),
            'today'    => Registration::whereDate('created_at', today())->count(),
        ]);
    }
}