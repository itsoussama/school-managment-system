<?php

namespace Database\Factories;

use App\Models\Fee;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FeeFactory extends Factory
{
    protected $model = Fee::class;

    public function definition()
    {
        $type = $this->faker->randomElement(['Tuition', 'Assurance', 'Transportation']);
        return [
            'type' => $type,
            'frequency' => !Str::contains($type, 'Tuition', 'Assurance') ? 'yearly' : $this->faker->randomElement(['montly', '3 month', '6 month']),
            'amount' => !Str::contains($type, 'Tuition') ? $this->faker->randomFloat(2, 50, 200) : $this->faker->randomFloat(2, 700, 3000),
            'status' => $this->faker->randomElement(['pending', 'paid']),
            'due_date' => Carbon::now()->add('day', 5),
            'student_id' => $this->getUniqueUserId(),
        ];
    }

    public function getUniqueUserId(): int
    {
        static $collectionIds = [];
        $userId = User::whereHas('role', function (Builder $query) {
            $query->where('name', 'Student');
        })
            ->whereNotIn('id', $collectionIds)
            ->inRandomOrder()
            ->value('id');
        array_push($collectionIds, $userId);
        return $userId;
    }
}
