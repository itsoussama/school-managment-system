<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Builder;
use App\Models\Grade;
use App\Models\Group;
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
        $grade = Grade::inRandomOrder()->first();
        return [
            'user_id' => User::where('school_id', $grade->school_id)->whereHas('role', function (Builder $query) {
                $query->where('name', 'Teacher');
            })->inRandomOrder()->distinct()->first()->id, // Assumes a User factory exists
            // 'group_id' => Group::inRandomOrder()->first()->id, // Creates a user and associates the ID
            'teacher_number' => strtoupper(Str::random(10)), // Unique teacher number
            'birthdate' => $this->faker->date('Y-m-d', '-30 years'), // Adult
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
        ];
    }
}
