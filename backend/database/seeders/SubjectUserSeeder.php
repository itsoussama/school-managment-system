<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the Teacher role
        $teacherRole = Role::where('name', 'Teacher')->first();

        // Fetch all users with the Teacher role
        $teachers = User::whereHas('roles', function ($query) use ($teacherRole) {
            $query->where('id', $teacherRole->id);
        })->get();

        // Assign subjects to teachers
        foreach ($teachers as $teacher) {
            // Randomly assign 1-3 subjects to each teacher
            $assignedSubjects = Subject::inRandomOrder()->limit(rand(1, 3))->pluck('id');

            // Attach the subjects to the teacher
            $teacher->subjects()->attach($assignedSubjects);
        }
    }
}
