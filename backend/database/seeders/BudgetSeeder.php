<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Budget;
use App\Models\BudgetCategory;
use App\Models\School;

class BudgetSeeder extends Seeder
{
    public function run()
    {
        $categories = BudgetCategory::all();

        foreach ($categories as $category) {
            Budget::factory()->create([
                'category_id' => $category->id,
                'school_id' => School::inRandomOrder()->first()->id,
            ]);
        }
    }
}
