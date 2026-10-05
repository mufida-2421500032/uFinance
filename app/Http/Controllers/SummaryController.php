<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\RespondsWithJson;
use App\Models\Transaction;
use App\Services\FinanceService;
use Carbon\Carbon;
use DateTimeImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    use RespondsWithJson;

    public function __invoke(Request $request, FinanceService $finance): JsonResponse
    {
        ['income' => $income, 'expense' => $expense] = $finance->totals();
        $balance = $income - $expense;

        $today = Carbon::today();
        $todayExpense = (float) Transaction::where('type', 'expense')
            ->where('date', $today->toDateString())
            ->sum('amount');

        $calendarRemainingDays = $today->daysInMonth - $today->day + 1;
        $requestedDays = (int) $request->query('days', 0);
        $remainingDays = $requestedDays > 0 ? $requestedDays : $calendarRemainingDays;
        $dailyBudget   = $remainingDays > 0 ? $balance / $remainingDays : $balance;

        $activePeriod = $finance->activePeriod();
        $period       = null;
        $periodStatus = 'NO_PERIOD';
        $alertStatus  = 'NO_PERIOD';

        if ($activePeriod) {
            $now   = new DateTimeImmutable('today');
            $start = new DateTimeImmutable($activePeriod->start_date);
            $end   = new DateTimeImmutable($activePeriod->end_date);

            $periodRemainingDays = max(0, $finance->daysUntil($activePeriod->end_date));
            $periodStatus = ($now >= $start && $now <= $end) ? 'ACTIVE' : ($now > $end ? 'EXPIRED' : 'PENDING');
            $periodDailyBudget = $activePeriod->budget_mode === 'auto'
                ? ($periodRemainingDays > 0 ? $balance / $periodRemainingDays : 0)
                : (float) $activePeriod->daily_budget;

            $period = [
                'id'               => (int) $activePeriod->id,
                'start_date'       => $activePeriod->start_date,
                'end_date'         => $activePeriod->end_date,
                'total_days'       => (int) $activePeriod->total_days,
                'sisa_hari'        => $periodRemainingDays,
                'budget_mode'      => $activePeriod->budget_mode,
                'daily_budget'     => round($periodDailyBudget, 2),
                'linked_income_id' => $activePeriod->linked_income_id === null ? null : (int) $activePeriod->linked_income_id,
                'periode_aktif'    => $periodStatus === 'ACTIVE',
                'periode_status'   => $periodStatus,
            ];

            $dailyBudget   = $periodDailyBudget;
            $remainingDays = $periodRemainingDays;
            $alertStatus   = $periodStatus === 'ACTIVE'
                ? ($todayExpense > $periodDailyBudget ? 'WARNING' : 'SAFE')
                : $periodStatus;
        } else {
            $dailyBudget   = 0;
            $remainingDays = 0;
        }

        return $this->success([
            'saldo'                   => round($balance, 2),
            'total_income'            => round($income, 2),
            'total_expense'           => round($expense, 2),
            'income'                  => round($income, 2),
            'expense'                 => round($expense, 2),
            'balance'                 => round($balance, 2),
            'remaining_days'          => $remainingDays,
            'calendar_remaining_days' => $calendarRemainingDays,
            'is_custom_days'          => $requestedDays > 0,
            'daily_budget'            => round($dailyBudget, 2),
            'period'                  => $period,
            'sisa_hari'               => $remainingDays,
            'budget_mode'             => $period['budget_mode'] ?? null,
            'period_status'           => $periodStatus,
            'today_expense'           => round($todayExpense, 2),
            'alert_status'            => $alertStatus,
            'status_today'            => $alertStatus === 'WARNING' ? 'warning' : ($alertStatus === 'SAFE' ? 'safe' : 'no_period'),
        ], 'Ringkasan berhasil dihitung.');
    }
}
