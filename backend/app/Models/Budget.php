<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;
    protected $table = 'budget';
    protected $fillable = ['id', 'allocated_amount', 'spent_amount', 'category_id', 'remaining_amount', 'school_id'];

    public function category()
    {
        return $this->belongsTo(BudgetCategory::class, 'category_id');
    }

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class, 'budget_id');
    }
}
