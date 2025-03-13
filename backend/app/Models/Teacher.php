<?php

namespace App\Models;

use App\Traits\HasReferenceID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory, HasReferenceID;

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
        return $this->hasMany(Calendar::class);
    }

    public function getSchoolID()
    {
        return $this->user; // define custom resolveSchool function to use in the HasReferenceID trait
    }
}
