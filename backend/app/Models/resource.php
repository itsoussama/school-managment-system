<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class resource extends Model
{
    use HasFactory;

    protected $fillable = ['label', 'qty', 'school_id', 'category_id'];

    public function categories(): BelongsTo
    {
        return $this->belongsTo(category::class, 'category_id', 'id');
    }
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'school_id', 'id');
    }
}
