<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->string('pay_period');
            $table->string('salary_type');
            $table->float('base_salary');
            $table->float('hourly_rate')->nullable();
            $table->float('hours_worked')->nullable();
            $table->float('total_allowances');
            $table->float('total_deductions');
            $table->float('net_salary');
            $table->string('payment_status');
            $table->date('pay_date');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
