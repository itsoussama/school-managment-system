<?php

namespace Database\Seeders;

use App\Models\Calendar;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CalendarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $calendars = Calendar::factory(50)->create();

        $calendars->each(function ($calendar) {
            // Assign many students to each calendar ensuring unique assignments
            $calendar->students()->attach(
                \App\Models\Student::inRandomOrder()->take(rand(5, 15))->pluck('id')->toArray()
            );

            // Assign many teachers to each calendar ensuring unique assignments
            $calendar->teachers()->attach(
                \App\Models\Teacher::inRandomOrder()->take(rand(2, 5))->pluck('id')->toArray()
            );

            // Assign one unique administrator to each calendar
            $calendar->administrators()->attach(
                \App\Models\Administrator::inRandomOrder()->distinct()->first()
            );
        });
    }
}
