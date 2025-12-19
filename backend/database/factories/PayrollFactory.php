<?php

namespace Database\Factories;

use App\Models\Payroll;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PayrollFactory extends Factory
{
    protected $model = Payroll::class;

    public function definition()
    {
        $salaryType = $this->faker->randomElement(['hourly', 'monthly']);
        $hourlyRate = $this->faker->randomFloat(2, 100, 500);
        return [
            'payroll_frequency' => $salaryType,
            'hourly_rate' => $salaryType === 'hourly' ? $hourlyRate : null,
            'net_salary' => $salaryType === 'hourly' ? $hourlyRate * 30 : $this->faker->randomFloat(2, 3000, 20000),
            'payment_status' => $this->faker->randomElement(['paid', 'pending']),
            'pay_date' => Carbon::now()->add("day", $this->faker->numberBetween(5, 30)),
            'user_id' => $this->getUniqueUserId(),
        ];
    }

    public function getUniqueUserId(): int
    {
        static $collectionIds = [];
        $userId = User::whereHas('role', function (Builder $query) {
            $query->whereIn('name', ['Teacher', 'Administrator', 'Administrator Staff']);
        })
            ->whereNotIn('id', $collectionIds)
            ->inRandomOrder()
            ->value('id');
        array_push($collectionIds, $userId);
        return $userId;
    }
}
