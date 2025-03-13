<?php

namespace App\Models;

use App\Traits\HasReferenceID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Administrator extends Model
{
    use HasFactory, HasReferenceID;
    protected $fillable = ['ref', 'address'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getSchoolID()
    {
        return $this->user; // define custom resolveSchool function to use in the HasReferenceID trait
    }
}
