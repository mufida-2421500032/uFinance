<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

/**
 * Format respons sama persis dengan API PHP native sebelumnya:
 * { "status": "success|error", "data": ..., "message": "..." }
 * sehingga JavaScript frontend tidak perlu diubah.
 */
trait RespondsWithJson
{
    protected function success(mixed $data = null, string $message = '', int $code = 200): JsonResponse
    {
        return response()->json(
            ['status' => 'success', 'data' => $data, 'message' => $message],
            $code,
            [],
            JSON_UNESCAPED_UNICODE
        );
    }

    protected function error(string $message, int $code = 400): JsonResponse
    {
        return response()->json(
            ['status' => 'error', 'data' => null, 'message' => $message],
            $code,
            [],
            JSON_UNESCAPED_UNICODE
        );
    }

    /** Hentikan request dan kirim respons error. */
    protected function fail(string $message, int $code = 400): never
    {
        throw new HttpResponseException($this->error($message, $code));
    }

    /** Validasi dengan pesan berbahasa Indonesia; gagal => respons 422 berformat di atas. */
    protected function validated(array $input, array $rules, array $messages = []): array
    {
        $validator = Validator::make($input, $rules, $messages + [
            'required'    => 'Field :attribute wajib diisi.',
            'numeric'     => 'Field :attribute harus berupa angka.',
            'integer'     => 'Field :attribute harus berupa bilangan bulat.',
            'min'         => ['numeric' => 'Field :attribute minimal :min.', 'string' => 'Field :attribute minimal :min karakter.'],
            'max'         => ['string' => 'Field :attribute maksimal :max karakter.'],
            'in'          => 'Field :attribute tidak valid.',
            'date_format' => 'Field :attribute harus berformat :format.',
            'exists'      => 'Field :attribute tidak ditemukan.',
            'string'      => 'Field :attribute harus berupa teks.',
        ]);

        if ($validator->fails()) {
            $this->fail($validator->errors()->first(), 422);
        }

        return $validator->validated();
    }
}
