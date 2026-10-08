<?php

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

/**
 * Membuat sebuah model "milik pengguna":
 *  - Semua query otomatis difilter ke data milik pengguna yang sedang login.
 *  - Saat membuat data baru, user_id otomatis diisi dengan pengguna yang login.
 *
 * Jadi pengguna A tidak mungkin melihat / mengubah / menghapus data pengguna B,
 * walaupun menebak ID-nya.
 *
 * Catatan: query yang memakai DB::table() TIDAK terkena filter ini,
 * sehingga di sana filter user_id ditulis manual.
 */
trait BelongsToUser
{
    protected static function bootBelongsToUser(): void
    {
        static::addGlobalScope('owner', function (Builder $builder) {
            if (Auth::check()) {
                $builder->where($builder->getModel()->qualifyColumn('user_id'), Auth::id());
            } else {
                // Tidak ada yang login => jangan kembalikan data apa pun.
                $builder->whereRaw('1 = 0');
            }
        });

        static::creating(function ($model) {
            if (empty($model->user_id) && Auth::check()) {
                $model->user_id = Auth::id();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
