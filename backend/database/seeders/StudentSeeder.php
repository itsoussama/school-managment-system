<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\Group;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grade = Grade::inRandomOrder()->first();
        $student_count = User::where('school_id', $grade->school_id)->whereHas('role', function (Builder $query) {
            $query->where('name', 'Student');
        })->count();
        Student::factory($student_count)->create();
    }
}
