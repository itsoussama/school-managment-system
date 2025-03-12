<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    use HasFactory;
    protected $table = 'fee';
    protected $fillable = ['id', 'type', 'amount', 'status', 'due_date', 'student_id'];

    public function transactions()
    {
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
