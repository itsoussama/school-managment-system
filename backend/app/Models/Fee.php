<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    use HasFactory;
    protected $table = 'fee';
    protected $fillable = ['id', 'type', 'amount', 'status', 'due_date', 'student_id'];

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class, 'fee_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
