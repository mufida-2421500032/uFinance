<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>uFinance — @yield('title')</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="{{ asset('assets/css/tokens.css') }}">
  <link rel="stylesheet" href="{{ asset('assets/css/components.css') }}">
  <link rel="stylesheet" href="{{ asset('assets/css/auth.css') }}">
  <script>
    // Ikuti mode terang/gelap yang pernah dipilih di aplikasi.
    try {
      var s = JSON.parse(localStorage.getItem('ufinance_settings') || '{}');
      if (s.mode) document.documentElement.setAttribute('data-theme', s.mode);
    } catch (e) {}
  </script>
</head>
<body class="auth-body">
  <main class="auth-wrap">
    <div class="auth-card u-card">
      <div class="auth-brand">
        <div class="auth-brand-icon"><span class="material-symbols-rounded">account_balance_wallet</span></div>
        <span>uFinance</span>
      </div>
      @yield('content')
    </div>
  </main>
</body>
</html>
