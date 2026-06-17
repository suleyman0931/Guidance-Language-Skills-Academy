<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_en', 'title_am',
        'body_en',  'body_am',
        'type', 'is_published', 'created_by',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'created_at'   => 'datetime',
    ];

    const TYPE_ANNOUNCEMENT = 'announcement';
    const TYPE_NEWS         = 'news';
    const TYPE_TIP          = 'tip';

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
