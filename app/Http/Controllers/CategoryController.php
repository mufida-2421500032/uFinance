<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\RespondsWithJson;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        return $this->success(
            Category::orderBy('name')->get(['id', 'name']),
            'Kategori berhasil dimuat.'
        );
    }
}
