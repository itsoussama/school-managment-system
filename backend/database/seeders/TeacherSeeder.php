<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Teacher::factory(10)->hasGroups(1)->create()->each(function ($teacher) {
            $subjects = Subject::inRandomOrder()->take(3)->pluck('id'); // Assign 3 random subjects
            $teacher->subjects()->attach($subjects);
        });
    }
}
