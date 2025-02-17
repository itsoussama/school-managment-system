<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BudgetCategory;

class BudgetCategorySeeder extends Seeder
{
    public function run()
    {
        BudgetCategory::factory()->count(10)->create();
    }
}
