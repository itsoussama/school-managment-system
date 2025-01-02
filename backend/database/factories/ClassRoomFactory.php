<?php

namespace Database\Factories;

use App\Models\ClassRoom;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClassRoom>
 */
class ClassRoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = ClassRoom::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word(), // Random classroom name
            'capacity' => $this->faker->numberBetween(20, 50), // Random capacity between 20 and 50
            'school_id' => School::inRandomOrder()->first()->id, // Assign a random school ID from existing schools
        ];
    }
}
