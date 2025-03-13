<?php

namespace App\Models;

use App\Traits\HasReferenceID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class resource extends Model
{
    use HasFactory, HasReferenceID;

    protected $fillable = ['label', 'qty', 'school_id', 'category_id'];

    public function categories(): BelongsTo
    {
        return $this->belongsTo(category::class, 'category_id', 'id');
    }
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'school_id', 'id');
    }
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }
}
