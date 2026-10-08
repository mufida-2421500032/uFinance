<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\RespondsWithJson;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecurringController extends Controller
{
    use RespondsWithJson;

    /** Read-only, sama seperti versi sebelumnya. */
    public function index(): JsonResponse
    {
        $rows = DB::table('recurring_transactions as r')
            ->leftJoin('categories as c', 'c.id', '=', 'r.category_id')
            ->where('r.user_id', Auth::id())
            ->select('r.*', 'c.name as category')
            ->orderByDesc('r.start_date')
            ->get();

        return $this->success($rows, 'Recurring transactions berhasil dimuat.');
    }
}
