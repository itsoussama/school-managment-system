<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetCategory extends Model
{
    use HasFactory;
    protected $table = 'budget_categories';
    protected $fillable = ['id', 'label'];

    public function budgets()
    {
        return $this->hasMany(Budget::class, 'category_id');
    }
}
