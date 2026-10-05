@extends('layouts.app')
@section('title', 'Statistics')

@push('vendor')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
@endpush

@section('content')
<div class="topbar">
  <h1><span class="material-symbols-rounded">bar_chart</span>Statistics</h1>
  <div class="u-row-actions">
    <button class="u-btn u-btn--primary u-btn--sm active" data-period="daily" data-tooltip="Daily chart">Daily</button>
    <button class="u-btn u-btn--secondary u-btn--sm" data-period="monthly" data-tooltip="Monthly chart">Monthly</button>
    <button class="u-btn u-btn--secondary u-btn--sm" data-period="yearly" data-tooltip="Yearly chart">Yearly</button>
  </div>
</div>
<section class="grid two-col">
  <div class="u-panel"><h2><span class="material-symbols-rounded icon-sm">show_chart</span>Income vs Expense</h2><canvas id="incomeExpenseChart"></canvas></div>
  <div class="u-panel"><h2><span class="material-symbols-rounded icon-sm">donut_large</span>Expense by Category</h2><canvas id="categoryChart"></canvas></div>
</section>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/stats.js') }}"></script>
@endpush
