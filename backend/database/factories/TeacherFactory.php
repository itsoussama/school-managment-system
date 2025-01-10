<?php

namespace Database\Factories;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Teacher::class;

    public function definition()
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id, // Assumes a User factory exists
            'teacher_number' => strtoupper(Str::random(10)), // Unique teacher number
            'birthdate' => $this->faker->date('Y-m-d', '-30 years'), // Adult
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
        ];
    }
}
