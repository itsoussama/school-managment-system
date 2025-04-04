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
        Schema::create('calendars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('classroom_id');
            $table->unsignedBigInteger('subject_id');
            $table->unsignedBigInteger('school_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('event_type', ['timetable', 'exam', 'meeting', 'holiday']);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->timestamps();

            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreign('classroom_id')->references('id')->on('class_rooms')->onDelete('cascade');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendars');
    }
};
