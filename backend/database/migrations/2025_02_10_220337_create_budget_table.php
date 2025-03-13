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
        Schema::create('budget', function (Blueprint $table) {
            $table->id();
            $table->string('ref')->unique(); // Foreign key reference to users table
            $table->float('allocated_amount');
            $table->float('spent_amount');
            $table->unsignedBigInteger('category_id');
            $table->float('remaining_amount');
            $table->unsignedBigInteger('school_id');
            $table->timestamps();
            $table->foreign('category_id')->references('id')->on('budget_categories')->onDelete('cascade');
            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget');
    }
};
