@extends('layouts.guest')
@section('title', 'Daftar')

@section('content')
<h1 class="auth-title">Buat akun</h1>
<p class="auth-sub">Data keuangan Anda hanya bisa dilihat oleh akun Anda sendiri.</p>

@if ($errors->any())
  <div class="u-alert u-alert--warning auth-error">
    <ul>@foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul>
  </div>
@endif

<form method="POST" action="{{ route('register.store') }}" class="auth-form">
  @csrf
  <label class="u-label">Nama
    <input class="u-input" type="text" name="name" value="{{ old('name') }}" required autofocus maxlength="100" autocomplete="name" placeholder="Nama Anda">
  </label>
  <label class="u-label">Email
    <input class="u-input" type="email" name="email" value="{{ old('email') }}" required autocomplete="email" placeholder="nama@email.com">
  </label>
  <label class="u-label">Password
    <input class="u-input" type="password" name="password" required minlength="8" autocomplete="new-password" placeholder="Minimal 8 karakter">
  </label>
  <label class="u-label">Ulangi password
    <input class="u-input" type="password" name="password_confirmation" required minlength="8" autocomplete="new-password" placeholder="Ketik ulang password">
  </label>
  <button type="submit" class="u-btn u-btn--primary">Daftar</button>
</form>

<p class="auth-foot">Sudah punya akun? <a href="{{ route('login') }}">Masuk</a></p>
@endsection
