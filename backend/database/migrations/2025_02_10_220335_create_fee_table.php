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
        Schema::create('fee', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('frequency'); //yearly, monthly, 3 month, 6 month
            $table->float('amount');
            $table->string('status');
            $table->date('due_date');
            $table->unsignedBigInteger('student_id');
            $table->timestamps();
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee');
    }
};
