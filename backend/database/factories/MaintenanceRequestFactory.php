<?php

namespace Database\Factories;

use App\Models\MaintenanceRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MaintenanceRequest>
 */
class MaintenanceRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = MaintenanceRequest::getStatuses();
        $ran_int = array_rand($status);
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status' => $status[$ran_int],
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
