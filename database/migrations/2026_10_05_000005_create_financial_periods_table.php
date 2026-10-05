<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_periods', function (Blueprint $table) {
            $table->id();
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedInteger('total_days');
            $table->enum('budget_mode', ['auto', 'manual'])->default('auto');
            $table->decimal('daily_budget', 15, 2)->nullable();
            $table->foreignId('linked_income_id')->nullable()
                ->constrained('transactions')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active', 'idx_financial_periods_active');
            $table->index(['start_date', 'end_date'], 'idx_financial_periods_dates');
        });

        // CHECK constraint seperti di schema.sql asli (MySQL 8.0.16+ / MariaDB 10.2+)
        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE financial_periods ADD CONSTRAINT chk_dates CHECK (end_date > start_date)');
            DB::statement('ALTER TABLE financial_periods ADD CONSTRAINT chk_days CHECK (total_days > 0)');
            DB::statement('ALTER TABLE financial_periods ADD CONSTRAINT chk_budget CHECK (daily_budget IS NULL OR daily_budget >= 0)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_periods');
    }
};
