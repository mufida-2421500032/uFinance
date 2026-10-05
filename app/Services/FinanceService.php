<?php

namespace App\Services;

use App\Models\FinancialPeriod;
use DateTimeImmutable;
use Illuminate\Support\Facades\DB;

class FinanceService
{
    /** Total pemasukan & pengeluaran seluruh transaksi. */
    public function totals(): array
    {
        $row = DB::table('transactions')->selectRaw("
            COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
        ")->first();

        return ['income' => (float) $row->income, 'expense' => (float) $row->expense];
    }

    public function balance(): float
    {
        $t = $this->totals();

        return $t['income'] - $t['expense'];
    }

    public function activePeriod(): ?FinancialPeriod
    {
        return FinancialPeriod::where('is_active', 1)->orderByDesc('id')->first();
    }

    /** Selisih hari dari hari ini ke $date (negatif jika sudah lewat). */
    public function daysUntil(string $date): int
    {
        return (int) (new DateTimeImmutable('today'))
            ->diff(new DateTimeImmutable($date))
            ->format('%r%a');
    }

    /** Payload periode untuk endpoint /api/periods/active. */
    public function periodPayload(?FinancialPeriod $period, float $balance = 0): ?array
    {
        if (!$period) {
            return null;
        }

        $today = new DateTimeImmutable('today');
        $start = new DateTimeImmutable($period->start_date);
        $end   = new DateTimeImmutable($period->end_date);

        $sisaHari  = max(0, $this->daysUntil($period->end_date));
        $isInRange = $today >= $start && $today <= $end;
        $status    = $isInRange ? 'ACTIVE' : ($today > $end ? 'EXPIRED' : 'NO_PERIOD');

        $dailyBudget = $period->budget_mode === 'auto'
            ? ($sisaHari > 0 ? $balance / $sisaHari : 0)
            : (float) $period->daily_budget;

        $payload = $period->toArray();
        $payload['sisa_hari']       = $sisaHari;
        $payload['periode_aktif']   = $status === 'ACTIVE';
        $payload['periode_status']  = $status;
        $payload['daily_budget']    = round($dailyBudget, 2);

        return $payload;
    }
}
