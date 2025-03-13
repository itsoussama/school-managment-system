<?php

namespace Database\Factories;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\School>
 */
class SchoolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $schoolName = fake()->company();
        return [
            'name' =>  $schoolName,
            'ref' => School::generateURN($schoolName),
            'address' => fake()->address(),
            // 'phone' => fake()->phoneNumber(),
            // 'email' => fake()->unique()->safeEmail(),
            // 'logo' => 'default.png',
            // 'status' => 'active',
        ];
    }
}
