<?php

namespace Database\Factories;

use App\Models\Calendar;
use App\Models\ClassRoom;
use App\Models\Group;
use App\Models\School;
use App\Models\Subject;
use App\Models\Teacher;
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
    protected $model = Calendar::class;
    public function definition(): array
    {

        return [
            'teacher_id' => Teacher::inRandomOrder()->first()->id,
            'group_id' => Group::inRandomOrder()->first()->id,
            'classroom_id' => ClassRoom::inRandomOrder()->first()->id,
            'subject_id' => Subject::inRandomOrder()->first()->id,
            'school_id' => School::inRandomOrder()->first()->id,
            'start_date' => $this->faker->dateTimeBetween('+1 days', '+1 month'),
            'end_date' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
        ];
    }
}
