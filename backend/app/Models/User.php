<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'registration_id',
        'username',
        'name_en',
        'name_am',
        'phone',
        'password',
        'role',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'password'   => 'hashed',
        'created_at' => 'datetime',
    ];

    const ROLE_ADMIN   = 'admin';
    const ROLE_STUDENT = 'student';

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }
}
