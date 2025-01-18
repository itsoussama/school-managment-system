<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact',
        'address',
        'image_path',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'school_id', 'id');
    }
    public function resources(): HasMany
    {
        return $this->hasMany(resource::class, 'school_id', 'id');
    }
    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class, 'school_id', 'id');
    }
    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class, 'school_id', 'id');
    }
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class, 'school_id', 'id');
    }
    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }
}
