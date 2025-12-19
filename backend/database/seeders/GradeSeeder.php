<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\School;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $schools = School::all();
        $grades = [['label' => 'Grade 1'], ['label' => 'Grade 2'], ['label' => 'Grade 3'], ['label' => 'Grade 4'], ['label' => 'Grade 5']];

        Grade::factory(5)->sequence(...$grades)->hasSchool(1)->hasStage(1)->create();
        // foreach ($schools as $school) {
        // }
    }
}
