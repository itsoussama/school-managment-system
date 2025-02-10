<?php

namespace Database\Seeders;

use App\Models\Stage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class StageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stages = [
            ['name' => 'Preschool'],
            ['name' => 'Primary'],
            ['name' => 'Secondary'],
            ['name' => 'High School'],
        ];
        Stage::factory()->count(4)->sequence(...$stages)->hasSchool(1)->create();
    }
}
