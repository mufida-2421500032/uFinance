<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recurring_transactions', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 15, 2);
            $table->integer('interval_days');
            $table->date('start_date');
            $table->foreignId('category_id')->nullable()
                ->constrained('categories')->cascadeOnUpdate()->nullOnDelete();
            $table->text('note')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recurring_transactions');
    }
};
