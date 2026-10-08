<?php

namespace App\Models;

use App\Models\Concerns\SerializesPlainDates;
use App\Models\Concerns\BelongsToUser;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use BelongsToUser, SerializesPlainDates;

    protected $fillable = ['type', 'amount', 'date', 'category_id', 'note'];
}
