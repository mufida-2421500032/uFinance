<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClaimData extends Command
{
    protected $signature = 'ufinance:claim-data {email : Email akun yang akan menjadi pemilik data lama}';

    protected $description = 'Pindahkan semua data keuangan yang belum punya pemilik (data lama) ke sebuah akun';

    public function handle(): int
    {
        $user = User::where('email', $this->argument('email'))->first();

        if (!$user) {
            $this->error('Akun dengan email itu tidak ditemukan. Daftar dulu lewat halaman /register.');

            return self::FAILURE;
        }

        $labels = [
            'transactions'           => 'transaksi',
            'goals'                  => 'goal',
            'financial_periods'      => 'periode budget',
            'recurring_transactions' => 'transaksi berulang',
        ];

        $total = 0;
        foreach ($labels as $table => $label) {
            $count = DB::table($table)->whereNull('user_id')->update(['user_id' => $user->id]);
            $total += $count;
            $this->line(sprintf('  %-20s %d data dipindahkan', $label, $count));
        }

        $this->info("Selesai. {$total} data sekarang menjadi milik {$user->email}.");

        return self::SUCCESS;
    }
}
