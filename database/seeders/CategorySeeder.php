<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Salary', 'Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Savings', 'Other'] as $name) {
            Category::firstOrCreate(['name' => $name]);
        }
    }
}
