<?php

namespace App\Models;

use App\Models\Concerns\BelongsToUser;
use Illuminate\Database\Eloquent\Model;

class RecurringTransaction extends Model
{
    use BelongsToUser;

    public $timestamps = false;

    protected $fillable = ['amount', 'interval_days', 'start_date', 'category_id', 'note'];
}
