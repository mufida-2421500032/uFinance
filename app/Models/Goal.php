<?php

namespace App\Models;

use App\Models\Concerns\SerializesPlainDates;
use App\Models\Concerns\BelongsToUser;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use BelongsToUser, SerializesPlainDates;

    protected $fillable = ['name', 'target_amount', 'current_amount', 'deadline', 'status'];
}
