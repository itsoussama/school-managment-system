<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TransactionDetailFactory extends Factory
{
    protected $model = TransactionDetail::class;

    public function definition()
    {
        return [
            'transaction_id' => Transaction::inRandomOrder()->first()->id,
            'budget_id' => Budget::inRandomOrder()->first()->id,
            'reference_type' => $this->faker->randomElement(['fee', 'payroll']),
            'fee_id' => null,
            'payroll_id' => null,
        ];
    }
}
