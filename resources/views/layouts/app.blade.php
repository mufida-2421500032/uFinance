@php
    $nav = [
        ['dashboard',    'Dashboard',    'dashboard',      'Financial summary'],
        ['transactions', 'Transactions', 'receipt_long',   'Manage Transactions'],
        ['calendar',     'Calendar',     'calendar_month', 'Daily Calendar'],
        ['stats',        'Statistics',   'bar_chart',      'Statistics'],
        ['budget',       'Budget',       'savings',        'Budget Control'],
        ['goals',        'Goals',        'emoji_events',   'Savings Goals'],
    ];
@endphp
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>uFinance — @yield('title')</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="{{ asset('assets/css/tokens.css') }}">
  <link rel="stylesheet" href="{{ asset('assets/css/components.css') }}">
  <link rel="stylesheet" href="{{ asset('assets/css/layout.css') }}">
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon"><span class="material-symbols-rounded">account_balance_wallet</span></div>
        <span>uFinance</span>
      </div>
      <nav class="nav">
        @foreach ($nav as [$name, $label, $icon, $tip])
          <a href="{{ route($name) }}" @class(['active' => request()->routeIs($name)]) data-tooltip="{{ $tip }}" data-tooltip-pos="right"><span class="material-symbols-rounded nav-icon">{{ $icon }}</span> {{ $label }}</a>
        @endforeach
      </nav>
      <div class="sidebar-footer">
        <button class="theme-switch" type="button" data-toggle-theme data-tooltip="Toggle Theme" data-tooltip-pos="right">
          <span class="theme-switch-label">Dark Mode</span>
          <span class="material-symbols-rounded theme-switch-icon">dark_mode</span>
        </button>
        <form method="POST" action="{{ route('logout') }}">
          @csrf
          <button class="theme-switch" type="submit" data-tooltip="Masuk sebagai {{ auth()->user()->email }}" data-tooltip-pos="right">
            <span class="theme-switch-label">Logout</span>
            <span class="material-symbols-rounded theme-switch-icon">logout</span>
          </button>
        </form>
      </div>
    </aside>
    <main class="content">
      @yield('content')
    </main>
  </div>
  @yield('modals')

  <script>
    window.APP = {
      apiBase: @json(url('/api')),
      loginUrl: @json(route('login')),
      userId: @json(auth()->id()),
      userName: @json(auth()->user()->name),
    };
  </script>
  <script src="https://cdn.jsdelivr.net/npm/@floating-ui/core@1.6.0"></script>
  <script src="https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.3"></script>
  @stack('vendor')
  <script src="{{ asset('assets/js/tooltip.js') }}"></script>
  <script src="{{ asset('assets/js/api.js') }}"></script>
  <script src="{{ asset('assets/js/theme.js') }}"></script>
  @stack('scripts')
</body>
</html>
