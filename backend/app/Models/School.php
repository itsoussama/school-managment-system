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
    public function stages(): HasMany
    {
        return $this->hasMany(Stage::class);
    }
    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class);
    }

    public static function generateURN($name)
    {
        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $name), 0, 2)); // Extract first 2 letters
        $hash = strtoupper(substr(md5($name . microtime()), 0, 4)); // Generate short unique hash

        $ref = "{$prefix}-{$hash}";

        // Ensure uniqueness
        while (School::where('ref', $ref)->exists()) {
            $hash = strtoupper(substr(md5($name . microtime()), 0, 4)); // Regenerate if exists
            $ref = "{$prefix}-{$hash}";
        }

        return $ref;
    }
}
