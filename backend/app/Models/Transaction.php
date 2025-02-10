<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $table = 'transactions';
    protected $fillable = ['id', 'type', 'amount', 'source', 'destination', 'date'];

    public function details()
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_id');
    }
}
