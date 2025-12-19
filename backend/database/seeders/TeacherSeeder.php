<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\Group;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $grade = Grade::inRandomOrder()->first();
        $teacher_count = User::where('school_id', $grade->school_id)->whereHas('role', function (Builder $query) {
            $query->where('name', 'Teacher');
        })->count();
        Teacher::factory($teacher_count)->hasGroups(1)->create()->each(function ($teacher) {
            $subjects = Subject::inRandomOrder()->take(3)->pluck('id'); // Assign 3 random subjects
            $teacher->subjects()->attach($subjects);
        });
    }
}
