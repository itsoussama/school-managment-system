<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = Event::factory(10)->create();

        // Loop through each event and assign random users
        $events->each(function ($event) {
            // Attach 2 random users to each event
            $users = User::inRandomOrder()->take(2)->pluck('id');
            $event->users()->sync($users); // Sync the users to the event (this will insert into the pivot table)
        });
    }
}
