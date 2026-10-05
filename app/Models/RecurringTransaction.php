<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurringTransaction extends Model
{
    public $timestamps = false;

    protected $fillable = ['amount', 'interval_days', 'start_date', 'category_id', 'note'];
}
