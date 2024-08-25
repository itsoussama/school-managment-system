<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use PhpOffice\PhpSpreadsheet\Calculation\Category;

class resource extends Model
{
    use HasFactory;

    protected $fillable = ['label', 'qty', 'school_id', 'category_id'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'id', 'category_id');
    }
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'id', 'school_id');
    }
}
