<?php

namespace App\Models;

use App\Helpers\ReferenceIDHelper;
use App\Traits\HasReferenceID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'teacher_number', 'birthdate', 'address', 'phone'];

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'teacher_subject');
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function calendars()
    {
        return $this->morphToMany(Calendar::class, 'calendarable', "calendarables", "calendar_id", "user_id");
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            ReferenceIDHelper::setReferenceID($model, $model->user);
        });
    }
}
