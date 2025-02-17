<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fee;
use App\Models\Student;

class FeeSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();

        foreach ($students as $student) {
            Fee::factory()->create([
                'student_id' => $student->id,
            ]);
        }
    }
}
