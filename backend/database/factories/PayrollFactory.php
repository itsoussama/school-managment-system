<?php

namespace Database\Factories;

use App\Models\Payroll;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PayrollFactory extends Factory
{
    protected $model = Payroll::class;

    public function definition()
    {
        return [
            'pay_period' => $this->faker->monthName . ' ' . $this->faker->year,
            'salary_type' => $this->faker->randomElement(['hourly', 'monthly']),
            'base_salary' => $this->faker->randomFloat(2, 3000, 20000),
            'hourly_rate' => $this->faker->randomFloat(2, 100, 500),
            'hours_worked' => $this->faker->randomFloat(2, 0, 160),
            'total_allowances' => $this->faker->randomFloat(2, 100, 1000),
            'total_deductions' => $this->faker->randomFloat(2, 0, 500),
            'net_salary' => $this->faker->randomFloat(2, 3000, 20000),
            'payment_status' => $this->faker->randomElement(['paid', 'pending']),
            'pay_date' => $this->faker->date(),
            'user_id' => User::inRandomOrder()->first()->id,
        ];
    }
}
