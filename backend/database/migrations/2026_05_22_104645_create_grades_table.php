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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();

            $table->decimal('grade', 5, 2)->nullable();
            $table->enum('quarter', ['Q1', 'Q2', 'Q3', 'Q4']);
            $table->boolean('is_final')->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->index('student_id');
            $table->index('subject_id');

            $table->unique(['student_id', 'subject_id', 'quarter']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
