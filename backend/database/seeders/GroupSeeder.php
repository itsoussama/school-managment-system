<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Student;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    public function run()
    {
        Group::factory(10)->create()->each(function ($group) {
            $students = Student::inRandomOrder()->take(5)->pluck('id');
            $group->students()->attach($students);
        });
    }
}
