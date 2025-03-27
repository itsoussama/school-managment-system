<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'stage_id',
        'school_id'
    ];

    // protected $appends = ['teachers', 'students'];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'school_id', 'id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class);
    }

    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }

    public function stage(): BelongsTo
    {
        return $this->belongsTo(Stage::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    // public function getTeachersAttribute()
    // {
    //     return $this->users->filter(fn($user) => $user->role->contains('name', 'Teacher'))->values();
    // }

    // public function getStudentsAttribute()
    // {
    //     return $this->users->filter(fn($user) => $user->role->contains('name', 'Student'))->values();
    // }
}
