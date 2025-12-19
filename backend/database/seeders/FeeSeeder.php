<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fee;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class FeeSeeder extends Seeder
{
    public function run()
    {
        $studentCount = User::whereHas('role', function (Builder $query) {
            $query->where('name', 'Student');
        })->count();

        Fee::factory($studentCount)->create();
    }
}
