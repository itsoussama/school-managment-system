<?php

namespace App\Models;

use App\Traits\HasReferenceID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory, HasReferenceID;
    protected $table = 'payrolls';
    protected $fillable = [
        'id',
        'payroll_frequency',
        'hourly_rate',
        'net_salary',
        'payment_status',
        'pay_date',
        'user_id'
    ];

    public function transactions()
    {
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getSchoolID()
    {
        return $this->user; // define custom resolveSchool function to use in the HasReferenceID trait
    }
}
