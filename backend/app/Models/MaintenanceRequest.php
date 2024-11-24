<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MaintenanceRequest extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'status', 'priority','school_id', 'resource_id', 'resolved_date', 'file_path', 'created_at', 'updated_at'];

    const STATUS_PENDING = 'pending';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';

    const PERIORITY_LOW = 'low';
    const PERIORITY_MEDIUM = 'medium';
    const PERIORITY_HIGH = 'high';

    public static function getStatuses()
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_IN_PROGRESS,
            self::STATUS_COMPLETED,
        ];
    }
    public static function getPeriority()
    {
        return [
            self::PERIORITY_LOW,
            self::PERIORITY_MEDIUM,
            self::PERIORITY_HIGH,
        ];
    }
    public function users() : BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
    public function schools() : BelongsTo
    {
        return $this->BelongsTo(School::class, 'school_id', 'id');
    }
    public function resources() : BelongsTo
    {
        return $this->BelongsTo(Resource::class, 'resource_id', 'id');
    }
}
