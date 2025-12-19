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
        $roles = ['Administrator Staff', 'Administrator', 'Teacher', 'Student', 'Parent'];
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
                    if ($user->role()->where('name', 'Teacher')->exists()) {

                        // Attach the subjects to the teacher
                        $subjects = Subject::inRandomOrder()->limit(rand(1, 5))->pluck('id')->toArray();
                        $user->subjects()->sync($subjects);
                    }
                    $grades = Grade::where('school_id', $school->id)->inRandomOrder()->limit(rand(1, 5))->pluck('id')->toArray();
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

        $admin_staff = User::create([
            'name' => 'admin_staff',
            'email' => 'admin_staff@example.com',
            'phone' => fake()->phoneNumber(),
            // 'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'school_id' => 1,
        ]);

        $admin_staff->role()->attach(Role::where('name', 'Administrator Staff')->first()->id);

        User::each(function ($user) {

            if ($user->role()->where('name', 'Student')->exists()) {
                $parent = User::whereHas('role', function ($query) {
                    $query->where('name', 'Parent');
                })->inRandomOrder()->first();
                // Get a random parent

                // Set guardian_id
                $user->guardian_id = $parent ? $parent->id : null;
                $user->save();
            }
        });
    }
}
