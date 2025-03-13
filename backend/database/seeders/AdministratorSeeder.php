<?php

namespace Database\Seeders;

use App\Models\Administrator;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class AdministratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $administratorCount = User::whereHas('role', function (Builder $query) {
            $query->whereIn('name', ['Administrator', 'Administrator Staff']);
        })->count();
        Administrator::factory($administratorCount)->create();
    }
}
