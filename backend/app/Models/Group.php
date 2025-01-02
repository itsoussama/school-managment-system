<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'grade_id'];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'group_student');
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
