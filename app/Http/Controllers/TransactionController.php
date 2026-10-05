<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\RespondsWithJson;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    use RespondsWithJson;

    public function index(Request $request): JsonResponse
    {
        $query = DB::table('transactions as t')
            ->leftJoin('categories as c', 'c.id', '=', 't.category_id')
            ->selectRaw('t.id, t.type, CAST(t.amount AS DECIMAL(15,2)) AS amount, t.date, t.category_id, c.name AS category, t.note')
            ->orderByDesc('t.date')
            ->orderByDesc('t.id');

        if ($request->filled('date')) {
            $query->where('t.date', $request->query('date'));
        }

        return $this->success($query->get(), 'Transaksi berhasil dimuat.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->payload($request);

        $transaction = Transaction::create($data);

        return $this->success(['id' => $transaction->id], 'Transaksi ditambahkan.', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return $this->error('Transaksi tidak ditemukan.', 404);
        }

        $transaction->update($this->payload($request));

        return $this->success(['id' => $id], 'Transaksi diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return $this->error('Transaksi tidak ditemukan.', 404);
        }

        $transaction->delete();

        return $this->success(['id' => $id], 'Transaksi dihapus.');
    }

    private function payload(Request $request): array
    {
        $data = $this->validated($request->all(), [
            'type'        => ['required', 'in:income,expense'],
            'amount'      => ['required', 'numeric', 'min:0'],
            'date'        => ['required', 'date_format:Y-m-d'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'note'        => ['nullable', 'string'],
        ], [
            'type.in' => 'Tipe transaksi harus income atau expense.',
        ]);

        return [
            'type'        => $data['type'],
            'amount'      => (float) $data['amount'],
            'date'        => $data['date'],
            'category_id' => !empty($data['category_id']) ? (int) $data['category_id'] : null,
            'note'        => $data['note'] ?? null,
        ];
    }
}
