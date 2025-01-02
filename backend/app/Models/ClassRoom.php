<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'capacity', 'school_id'];

    // Define the relationship with the School model
    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
