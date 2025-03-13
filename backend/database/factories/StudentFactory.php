<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Builder;
use App\Models\Grade;
use App\Models\Group;
use App\Models\Parents;
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
            'user_id' => $this->getUniqueUserId(),
            'ref' => strtoupper(Str::random(10)),
            'grade_id' => Grade::inRandomOrder()->first()->id, // Creates a user and associates the ID
            'parent_id' => Parents::inRandomOrder()->first()->id, // Creates a user and associates the ID
            'group_id' => Group::inRandomOrder()->first()->id,
            'student_number' => strtoupper(Str::random(10)), // Random unique string for student number
            'birthdate' => $this->faker->date('Y-m-d', '-18 years'), // Random date for an adult
            'address' => $this->faker->address(),
        ];
    }

    public function getUniqueUserId(): int
    {
        $grade = Grade::inRandomOrder()->first();
        static $collectionIds = [];
        $userId = User::where('school_id', $grade->school_id)
            ->whereHas('role', function (Builder $query) {
                $query->where('name', 'Student');
            })
            ->whereNotIn('id', $collectionIds)
            ->inRandomOrder()
            ->value('id');
        array_push($collectionIds, $userId);
        return $userId;
    }
}
