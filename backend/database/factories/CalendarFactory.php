<?php

namespace Database\Factories;

use App\Models\Administrator;
use App\Models\Calendar;
use App\Models\ClassRoom;
use App\Models\Group;
use App\Models\School;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Calendar>
 */
class CalendarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {

        return [
            'group_id' => Group::inRandomOrder()->first()->id,
            'classroom_id' => ClassRoom::inRandomOrder()->first()->id,
            'subject_id' => Subject::inRandomOrder()->first()->id,
            'school_id' => School::inRandomOrder()->first()->id,
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->sentence(3),
            'event_type' => $this->faker->randomElement(['timetable', 'exam', 'meeting', 'holiday']),
            'start_date' => $startDate = $this->faker->dateTimeBetween('+10 hours', '+30 hours')->setTime(rand(6, 19), rand(0, 59)),
            'end_date' => $this->faker->dateTimeBetween($startDate, $startDate->modify('+2 hours')),
        ];
    }
}
