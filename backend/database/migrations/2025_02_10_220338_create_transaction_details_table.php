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
        Schema::create('transaction_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_id');
            $table->unsignedBigInteger('budget_id');
            $table->string('reference_type');
            $table->unsignedBigInteger('fee_id')->nullable();
            $table->unsignedBigInteger('payroll_id')->nullable();
            $table->timestamps();

            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');
            $table->foreign('budget_id')->references('id')->on('budget')->onDelete('cascade');
            $table->foreign('fee_id')->references('id')->on('fee')->onDelete('set null');
            $table->foreign('payroll_id')->references('id')->on('payrolls')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_details');
    }
};
