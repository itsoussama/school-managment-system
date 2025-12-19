<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\BudgetCategory;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BudgetFactory extends Factory
{
    protected $model = Budget::class;

    public function definition()
    {
        return [
            'allocated_amount' => $this->faker->randomFloat(2, 1000, 100000),
            'spent_amount' => $this->faker->randomFloat(2, 0, 1000),
            'category_id' => BudgetCategory::inRandomOrder()->first()->id,
            'remaining_amount' => $this->faker->randomFloat(2, 0, 1000),
            'school_id' => School::inRandomOrder()->first()->id,
        ];
    }
}
