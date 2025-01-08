<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parents extends Model
{
    /** @use HasFactory<\Database\Factories\ParentsFactory> */
    use HasFactory;

    protected $fillable = ['user_id'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function student()
    {
        return $this->hasOne(Student::class); // One-to-one relationship with Student
    }
}
