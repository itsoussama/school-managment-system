<?php

namespace Database\Factories;

use App\Models\Grade;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Student::class;
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id, // Creates a user and associates the ID
            'grade_id' => Grade::inRandomOrder()->first()->id, // Creates a user and associates the ID
            'student_number' => strtoupper(Str::random(10)), // Random unique string for student number
            'birthdate' => $this->faker->date('Y-m-d', '-18 years'), // Random date for an adult
            'address' => $this->faker->address(),
        ];
    }
}
