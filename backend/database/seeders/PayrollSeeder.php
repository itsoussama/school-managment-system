<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class PayrollSeeder extends Seeder
{
    public function run()
    {
        $userCount = User::whereHas('role', function (Builder $query) {
            $query->whereIn('name', ['Teacher', 'Administrator', 'Administrator Staff']);
        })->count();
        Payroll::factory($userCount)->create();
    }
}
