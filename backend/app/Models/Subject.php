<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subject extends Model
{
    protected $table = 'subjects';
    protected $fillable = [
        'name',
        'coef',
        'school_id'
    ];

    use HasFactory;
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'subject_user');
    }

    // public function teachers()
    // {
    //     return $this->belongsToMany(Teacher::class, 'teacher_subject');
    // }

    public function grades(): BelongsToMany
    {
        return $this->belongsToMany(Grade::class, 'grade_subject');
    }

    public function calendars()
    {
        return $this->hasMany(Calendar::class);
    }

    public function schools(): BelongsTo
    {
        return $this->belongsTo((School::class), 'school_id', 'id');
    }
}
