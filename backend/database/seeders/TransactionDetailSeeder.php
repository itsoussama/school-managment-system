<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Budget;
use App\Models\Fee;
use App\Models\Payroll;

class TransactionDetailSeeder extends Seeder
{
    public function run()
    {
        $transactions = Transaction::all();
        $budgets = Budget::all();
        $fees = Fee::all();
        $payrolls = Payroll::all();

        foreach ($transactions as $transaction) {
            TransactionDetail::factory()->create([
                'transaction_id' => $transaction->id,
                'budget_id' => $budgets->random()->id,
                'reference_type' => 'fee',
                'fee_id' => $fees->random()->id,
                'payroll_id' => $payrolls->random()->id,
            ]);
        }
    }
}
