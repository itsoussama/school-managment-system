<?php

namespace Database\Factories;

use App\Models\BudgetCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BudgetCategoryFactory extends Factory
{
    protected $model = BudgetCategory::class;

    public function definition()
    {
        return [
            'label' => $this->faker->word,
        ];
    }
}
