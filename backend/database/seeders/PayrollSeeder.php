<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payroll;
use App\Models\User;

class PayrollSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        foreach ($users as $user) {
            Payroll::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
