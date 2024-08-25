<?php

namespace Database\Seeders;

use App\Models\category;
use App\Models\resource;
use App\Models\School;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = category::factory(4)->create();
        $schools = School::all();

        foreach ($schools as $school) {
            foreach ($categories as $category) {
                resource::factory(3)->create([
                    'category_id' => $category->id,
                    'school_id' => $school->id
                ]);

            }
        }
    }
}
