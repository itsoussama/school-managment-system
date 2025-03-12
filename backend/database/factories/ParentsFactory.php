<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Parents>
 */
class ParentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => $this->getUniqueUserId(),
        ];
    }

    public function getUniqueUserId(): int
    {
        static $collectionIds = [];
        $userId = User::whereHas('role', function (Builder $query) {
            $query->where('name', 'Parent');
        })
            ->whereNotIn('id', $collectionIds)
            ->inRandomOrder()
            ->value('id');
        array_push($collectionIds, $userId);
        return $userId;
    }
}
