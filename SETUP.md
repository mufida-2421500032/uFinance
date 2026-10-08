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
Buka http://127.0.0.1:8000 — Anda akan diarahkan ke halaman **Masuk**.
Klik **Daftar** untuk membuat akun pertama. Setiap akun hanya melihat datanya sendiri.

## Sudah pernah menjalankan versi tanpa login? (upgrade)
1. Salin ulang isi zip ke project (timpa file yang ada).
2. Jalankan:

       php artisan migrate
       php artisan optimize:clear

3. Buka http://127.0.0.1:8000/register dan buat akun Anda.
4. Pindahkan data lama (yang belum punya pemilik) ke akun itu:

       php artisan ufinance:claim-data email@anda.com

   Perintah ini aman dijalankan ulang; hanya data tanpa pemilik yang dipindahkan.

## Memindahkan data lama (opsional)
Di phpMyAdmin, export database lama `personal_finance` -> Custom -> centang
**hanya "Data"** (tanpa struktur). Import ke database `db_ufinance` SETELAH `migrate`.
Nama kolom sama persis. Jika kategori lama ikut diimpor, jalankan `migrate` TANPA `--seed`.
Setelah itu daftar akun, lalu jalankan `php artisan ufinance:claim-data email@anda.com`
agar data hasil import menjadi milik akun Anda.

## Troubleshooting
- **419 / CSRF token mismatch** -> `php artisan optimize:clear`, lalu hard-refresh browser.
- **Access denied / Unknown database** -> cek DB_* di .env, lalu `php artisan config:clear`.
- **Setelah login balik lagi ke halaman Masuk** -> pastikan `SESSION_DRIVER=database` dan
  `php artisan migrate` sudah dijalankan (tabel `sessions` dibuat oleh migrate), lalu `php artisan config:clear`.
- **Data lama tidak muncul setelah upgrade** -> jalankan `php artisan ufinance:claim-data email@anda.com`.
- **Error `could not find driver`** -> aktifkan ekstensi `pdo_mysql` di php.ini.
