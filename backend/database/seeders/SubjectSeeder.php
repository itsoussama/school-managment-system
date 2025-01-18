<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [['name' => 'Math'], ['name' => 'Science'], ['name' => 'Physics'], ['name' => 'Lecture'], ['name' => 'IT'], ['name' => 'Sport']];
        Subject::factory(count($subjects))->sequence(...$subjects)->hasGrades(1)->hasSchools(1)->create();
    }
}
