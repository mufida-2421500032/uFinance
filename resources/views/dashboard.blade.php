@extends('layouts.app')
@section('title', 'Dashboard')

@push('vendor')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
@endpush

@section('content')
<div class="greeting-card animate-in">
  <div class="greeting-text">
    <span class="greeting-label">Welcome,</span>
    <span class="user-name-display greeting-name"></span>
  </div>
  <div class="greeting-meta">
    <span id="greeting-date"></span>
    <button class="btn-edit-name" type="button" onclick="openNameModal()" data-tooltip="Edit Display Name">
      <span class="material-symbols-rounded" style="font-size:16px">edit</span>
    </button>
  </div>
</div>
<div id="todayAlert" class="u-alert u-alert--safe animate-in" data-tooltip="Spending status vs daily budget" data-tooltip-pos="bottom">Loading today's status...</div>
<section id="metrics" class="grid cards"></section>
<section id="periodCard" class="u-mt-section"></section>
<section class="grid two-col u-mt-section">
  <div class="u-panel"><h2><span class="material-symbols-rounded icon-sm">trending_down</span>7-Day Expense</h2><canvas id="expense7"></canvas></div>
  <div class="u-panel"><h2><span class="material-symbols-rounded icon-sm">donut_large</span>Expense by Category</h2><canvas id="categoryDonut"></canvas></div>
  <div class="u-panel"><h2><span class="material-symbols-rounded icon-sm">receipt</span>5 Recent Transactions</h2><div id="latest"></div></div>
  <div class="u-panel"><h2><span class="material-symbols-rounded icon-sm">flag</span>Active Goals</h2><div id="goalProgress" class="grid"></div></div>
</section>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/periods.js') }}"></script>
<script src="{{ asset('assets/js/dashboard.js') }}"></script>
@endpush
