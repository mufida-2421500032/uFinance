<?php

namespace App\Models;

use App\Models\Concerns\SerializesPlainDates;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use SerializesPlainDates;

    protected $fillable = ['name', 'target_amount', 'current_amount', 'deadline', 'status'];
}
