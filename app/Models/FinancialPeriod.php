<?php

namespace App\Models;

use App\Models\Concerns\SerializesPlainDates;
use Illuminate\Database\Eloquent\Model;

class FinancialPeriod extends Model
{
    use SerializesPlainDates;

    protected $fillable = [
        'start_date', 'end_date', 'total_days', 'budget_mode',
        'daily_budget', 'linked_income_id', 'is_active',
    ];
}
