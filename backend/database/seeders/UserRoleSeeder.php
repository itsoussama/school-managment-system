<?php

namespace Database\Seeders;

use App\Models\Grade;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\School;
use App\Models\Subject;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class UserRoleSeeder extends Seeder
{
    public function run()
    {
        // Create roles
        $roles = ['Administrator', 'Teacher', 'Student'];
        $schools = [];

        // Create schools
        for ($i = 1; $i <= 3; $i++) {
            $schools = School::all();
            // $schools[] = School::create(['name' => 'School ' . $i, 'address' => 'address ' . $i]);
        }

        foreach ($roles as $roleName) {
            $role = Role::create(['name' => $roleName]);

            foreach ($schools as $school) {
                // Create users and attach roles
                $userCount = $roleName === 'admin' ? 2 : ($roleName === 'teacher' ? 3 : 5);

                User::factory($userCount)->create([
                    'school_id' => $school->id
                ])->each(function ($user) use ($role, $school) {
                    $user->role()->attach($role);

                    $subjects = Subject::inRandomOrder()->limit(rand(1, 5))->pluck('id')->toArray();
                    $grades = Grade::where('school_id', $school->id)->inRandomOrder()->limit(rand(1, 5))->pluck('id')->toArray();
                    $user->subjects()->sync($subjects);
                    $user->grades()->sync($grades);

                });
            }
        }
        $admin = User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'phone' => fake()->phoneNumber(),
            // 'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'school_id' => 1,
        ]);

        $admin->role()->attach(Role::where('name', 'Administrator')->first()->id);
    }
}
