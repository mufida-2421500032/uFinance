<?php

namespace App\Models\Concerns;

use DateTimeInterface;

/**
 * Supaya created_at / updated_at di JSON tetap berformat "Y-m-d H:i:s"
 * (sama seperti output API PHP native sebelumnya), bukan ISO-8601.
 */
trait SerializesPlainDates
{
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }
}
