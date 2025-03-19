<?php

namespace App\Models;

use App\Helpers\ReferenceIDHelper;
use App\Traits\HasReferenceID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    use HasFactory;
    protected $table = 'budget';
    protected $fillable = ['id', 'allocated_amount', 'spent_amount', 'category_id', 'remaining_amount', 'school_id'];

    public function category()
    {
        return $this->belongsTo(BudgetCategory::class, 'category_id');
    }

    public function transactions()
    {
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            ReferenceIDHelper::setReferenceID($model);
        });
    }
}
