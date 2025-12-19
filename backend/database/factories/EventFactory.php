<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3), // Random event title
            'description' => $this->faker->sentence(3), // Random event title
            'start' => $this->faker->dateTimeBetween('+1 days', '+1 month'), // Random start date within the next month
            'end' => $this->faker->dateTimeBetween('+1 month', '+2 months'), // Random end date after the start date
        ];
    }
}
