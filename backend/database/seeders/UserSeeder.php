<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // DB::table('users')->insert([
        //     'name' => Str::random(5) . ' ' . Str::random(6),
        //     'email' => Str::random(10).'@gmail.com',
        //     'password' => Hash::make('password'),
        // ]);
        // User::factory()->count(10)->create()->each(function (User $User) {

        //     // $User->role()->save(Role::factory()->make());

        //     $roles = Role::inRandomOrder()->limit(rand(1, 3))->pluck('id')->toArray();
        //     $schools = School::inRandomOrder()->limit(rand(1,2))->pluck('id')->toArray()[0];
        //     $User->school()->associate($schools); // Associate School with User
        //     $User->save();

        //     $User->role()->sync($roles);
        //     // $User->school()->sync($schools);
        // });

        User::factory()->has(Role::factory()->sequence(['name' => 'Teacher'], ['name' => 'Student'], ['name' => 'Administrator']))->for(School::factory())->count(2)->create();
        User::factory(['name' => 'admin', 'email' => 'admin@example.com', 'school_id' => 1])->has(Role::factory(['name' => 'Administrator']))->createOne();
    }
}
