<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'start',
        'end',
    ];

    // If you need to work with date fields
    protected $dates = [
        'start',
        'end',
    ];

    public function users() : BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
