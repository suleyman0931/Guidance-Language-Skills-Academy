<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_am',
        'phone',
        'grade',
        'purpose',
        'referral',
        'lang',
        'status',
        'payment_status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING  = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    // Payment status constants
    const PAYMENT_UNPAID = 'unpaid';
    const PAYMENT_PAID   = 'paid';

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function getFormattedPhoneAttribute(): string
    {
        $phone = $this->phone;
        if (strlen($phone) === 10) {
            return '+251 ' . substr($phone, 1, 2) . ' ' . substr($phone, 3, 3) . ' ' . substr($phone, 6);
        }
        return $phone;
    }
}
