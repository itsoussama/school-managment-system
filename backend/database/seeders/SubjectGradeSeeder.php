<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all grades
        $subjects = Subject::all();

        // Assign subjects to grades
        foreach ($subjects as $subject) {
            // Randomly assign 1-3 subjects to each grade
            $assignedGrades = Grade::inRandomOrder()->limit(rand(1, 3))->pluck('id');

            // Attach the subjects to the grade
            $subject->grades()->attach($assignedGrades);
        }
    }
}
