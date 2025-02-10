<?php

namespace Database\Factories;

use App\Models\Fee;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FeeFactory extends Factory
{
    protected $model = Fee::class;

    public function definition()
    {
        return [
            'type' => $this->faker->word,
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'status' => $this->faker->randomElement(['pending', 'paid']),
            'due_date' => $this->faker->date(),
            'student_id' => Student::inRandomOrder()->first()->id,
        ];
    }
}
