<?php

namespace App\Models;

use App\Models\Concerns\SerializesPlainDates;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use SerializesPlainDates;

    protected $fillable = ['type', 'amount', 'date', 'category_id', 'note'];
}
