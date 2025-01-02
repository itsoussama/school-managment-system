<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    // Fillable attributes
    protected $fillable = ['user_id', 'student_number', 'birthdate', 'address'];

    /**
     * Get the user that owns the student.
     */
    public function users()
    {
        return $this->belongsTo(User::class, 'user_id'); // One-to-one inverse relationship
    }
    public function grade()
    {
        return $this->belongsTo(Grade::class, 'grade_id'); // One-to-one inverse relationship
    }
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_student');
    }
}
