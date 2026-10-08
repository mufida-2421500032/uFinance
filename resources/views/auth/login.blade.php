@extends('layouts.guest')
@section('title', 'Masuk')

@section('content')
<h1 class="auth-title">Masuk</h1>
<p class="auth-sub">Selamat datang kembali. Masuk untuk melihat keuangan Anda.</p>

@if ($errors->any())
  <div class="u-alert u-alert--warning auth-error">
    <ul>@foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul>
  </div>
@endif

<form method="POST" action="{{ route('login.attempt') }}" class="auth-form">
  @csrf
  <label class="u-label">Email
    <input class="u-input" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="email" placeholder="nama@email.com">
  </label>
  <label class="u-label">Password
    <input class="u-input" type="password" name="password" required autocomplete="current-password" placeholder="Password Anda">
  </label>
  <label class="auth-check">
    <input type="checkbox" name="remember" value="1"> Ingat saya
  </label>
  <button type="submit" class="u-btn u-btn--primary">Masuk</button>
</form>

<p class="auth-foot">Belum punya akun? <a href="{{ route('register') }}">Daftar</a></p>
@endsection
