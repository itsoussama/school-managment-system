<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\School;

class UserRoleSeeder extends Seeder
{
    public function run()
    {
        // Create roles
        $roles = ['Administrator', 'Teacher', 'Student'];
        $schools = [];

        // Create schools
        for ($i = 1; $i <= 3; $i++) {
            $schools = School::factory(2)->create();
            // $schools[] = School::create(['name' => 'School ' . $i, 'address' => 'address ' . $i]);
        }

        foreach ($roles as $roleName) {
            $role = Role::create(['name' => $roleName]);

            foreach ($schools as $school) {
                // Create users and attach roles
                $userCount = $roleName === 'admin' ? 2 : ($roleName === 'teacher' ? 3 : 5);

                User::factory($userCount)->create([
                    'school_id' => $school->id
                ])->each(function ($user) use ($role) {
                    $user->role()->attach($role);
                });
            }
        }
    }
}
