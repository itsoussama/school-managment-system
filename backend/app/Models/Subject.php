<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subject extends Model
{
    protected $table='subjects';
    use HasFactory;
    public function users() : BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_id', 'id');
    }
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_subject');
    }

}
