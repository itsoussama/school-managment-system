<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $table = 'transactions';
    protected $fillable = ['id', 'type', 'amount', 'transactionable_id', 'transactionable_type', 'status', 'date'];
    protected $hidden = ['transactionable_type'];

    public function transactionable()
    {
        return $this->morphTo();
    }
}
