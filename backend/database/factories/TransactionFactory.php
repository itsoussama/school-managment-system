<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\Fee;
use App\Models\Payroll;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    protected $models = [
        Fee::class,
        Payroll::class,
        Budget::class,
    ];

    // Pick a random model

    public function definition()
    {
        $transactionableType = $this->faker->randomElement($this->models);

        return [
            'type' => $this->faker->randomElement(['debit', 'credit']),
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'transactionable_id' => $this->getUniqueId($transactionableType),
            'transactionable_type' => $transactionableType,
            'status' => $this->faker->randomElement(['pending', 'failed', 'completed']),
            'date' => $this->faker->date(),
        ];
    }

    public function getUniqueId($model): int
    {
        static $collectionIds = [];
        $id = $model::whereNotIn('id', $collectionIds)
            ->inRandomOrder()->value('id');

        array_push($collectionIds, $id);
        return $id;
    }
}
