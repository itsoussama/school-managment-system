<?php

namespace App\Models;

use App\Traits\HasReferenceID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parents extends Model
{
    /** @use HasFactory<\Database\Factories\ParentsFactory> */
    use HasFactory, HasReferenceID;

    protected $fillable = ['user_id'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function student()
    {
        return $this->hasOne(Student::class); // One-to-one relationship with Student
    }

    public function getSchoolID()
    {
        return $this->user; // define custom resolveSchool function to use in the HasReferenceID trait
    }
}
