<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['income', 'expense']);
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->foreignId('category_id')->nullable()
                ->constrained('categories')->cascadeOnUpdate()->nullOnDelete();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
