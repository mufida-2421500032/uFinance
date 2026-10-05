# uFinance — versi Laravel

Zip ini adalah **file tambahan** untuk project Laravel baru (bukan project Laravel utuh).
Struktur folder sudah sama dengan Laravel, tinggal digabung/ditimpa.

## 1. Prasyarat
- PHP 8.2+ dan Composer  (cek: `php -v` dan `composer -V`)
- MySQL / MariaDB (XAMPP, Laragon, atau lainnya)

## 2. Buat project Laravel baru
    composer create-project laravel/laravel ufinance
    cd ufinance

## 3. Salin isi zip ini ke dalam project
Copy folder `app`, `database`, `public`, `resources`, `routes` ke root project
(pilih "Replace/Timpa" jika ditanya). Dua file bawaan yang memang ikut tertimpa:
- `routes/web.php`
- `database/seeders/DatabaseSeeder.php`

## 4. Buat database
Buka phpMyAdmin -> tab SQL, lalu jalankan isi `database/create_database.sql`
(atau cukup: `CREATE DATABASE db_ufinance;`).

## 5. Atur .env
    APP_NAME=uFinance
    APP_TIMEZONE=Asia/Jakarta
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=db_ufinance
    DB_USERNAME=root
    DB_PASSWORD=

## 6. Migrate + isi kategori awal
    php artisan migrate --seed

## 7. Jalankan
    php artisan serve
Buka http://127.0.0.1:8000

## Memindahkan data lama (opsional)
Di phpMyAdmin, export database lama `personal_finance` -> Custom -> centang
**hanya "Data"** (tanpa struktur). Import ke database `db_ufinance` SETELAH `migrate`.
Nama kolom sama persis. Jika kategori lama ikut diimpor, jalankan `migrate` TANPA `--seed`.

## Troubleshooting
- **419 / CSRF token mismatch** -> `php artisan optimize:clear`, lalu hard-refresh browser.
- **Access denied / Unknown database** -> cek DB_* di .env, lalu `php artisan config:clear`.
- **Error `could not find driver`** -> aktifkan ekstensi `pdo_mysql` di php.ini.
