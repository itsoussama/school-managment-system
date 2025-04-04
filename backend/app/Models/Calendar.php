<?php

namespace App\Models;

use App\Helpers\ReferenceIDHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'event_type',
        'group_id',
        'classroom_id',
        'subject_id',
        'school_id',
        'start_date',
        'end_date',
    ];

    public function administrators()
    {
        return $this->morphedByMany(Administrator::class, 'calendarable');
    }

    public function teachers()
    {
        return $this->morphedByMany(Teacher::class, 'calendarable');
    }

    public function students()
    {
        return $this->morphedByMany(Student::class, 'calendarable');
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    // protected static function boot()
    // {
    //     calendar::boot();

    //     static::creating(function ($model) {
    //         ReferenceIDHelper::setReferenceID($model);
    //     });
    // }
}
