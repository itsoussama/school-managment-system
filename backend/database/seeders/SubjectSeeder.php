<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\Subject;
use App\Models\User;
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
        Subject::factory(6)->sequence(...$subjects)->hasSchools(1)->create();
    }
}
