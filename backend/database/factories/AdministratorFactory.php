<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class AdministratorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => $this->getUniqueUserId(),
            // 'group_id' => Group::inRandomOrder()->first()->id, // Creates a user and associates the ID
            'birthdate' => $this->faker->date('Y-m-d', '-30 years'), // Adult
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
        ];
    }


    public function getUniqueUserId(): int
    {
        static $collectionIds = [];
        $userId = User::whereHas('role', function (Builder $query) {
            $query->whereIn('name', ['Administrator', 'Administrator Staff']);
        })
            ->whereNotIn('id', $collectionIds)
            ->inRandomOrder()
            ->value('id');
        array_push($collectionIds, $userId);
        info($collectionIds);
        return $userId;
    }
}
