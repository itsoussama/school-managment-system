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
        return [
            'user_id' => $this->getUniqueUserId(),
            // 'group_id' => Group::inRandomOrder()->first()->id, // Creates a user and associates the ID
            'teacher_number' => strtoupper(Str::random(10)), // Unique teacher number
            'birthdate' => $this->faker->date('Y-m-d', '-30 years'), // Adult
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
        ];
    }


    public function getUniqueUserId(): int
    {
        $grade = Grade::inRandomOrder()->first();
        static $collectionIds = [];
        $userId = User::where('school_id', $grade->school_id)
            ->whereHas('role', function (Builder $query) {
                $query->where('name', 'Teacher');
            })
            ->whereNotIn('id', $collectionIds)
            ->inRandomOrder()
            ->value('id');
        array_push($collectionIds, $userId);
        return $userId;
    }
}
