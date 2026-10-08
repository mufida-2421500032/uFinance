<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Menambah kolom pemilik data (user_id) ke tabel-tabel keuangan.
 *
 * Kolom dibuat NULLABLE supaya data lama (yang belum punya pemilik) tidak hilang.
 * Data lama dipindahkan ke sebuah akun dengan:
 *     php artisan ufinance:claim-data email@anda.com
 */
return new class extends Migration
{
    private array $tables = ['transactions', 'goals', 'financial_periods', 'recurring_transactions'];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')
                    ->constrained('users')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropConstrainedForeignId('user_id');
            });
        }
    }
};
