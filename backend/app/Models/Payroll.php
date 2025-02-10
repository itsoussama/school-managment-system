<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;
    protected $table = 'payrolls';
    protected $fillable = [
        'id', 'pay_period', 'salary_type', 'base_salary', 'hourly_rate', 'hours_worked',
        'total_allowances', 'total_deductions', 'net_salary', 'payment_status', 'pay_date', 'user_id'
    ];

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class, 'payroll_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
