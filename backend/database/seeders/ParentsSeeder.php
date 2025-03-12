<?php

namespace Database\Seeders;

use App\Models\Parents;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class ParentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $parentCount = User::whereHas('role', function (Builder $query) {
            $query->where('name', 'Parent');
        })->count();
        Parents::factory($parentCount)->create();
    }
}
