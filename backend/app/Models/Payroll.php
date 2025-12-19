<?php

namespace App\Models;

use App\Helpers\ReferenceIDHelper;
use App\Traits\HasReferenceID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;
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

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            ReferenceIDHelper::setReferenceID($model, $model->user);
        });
    }
}
