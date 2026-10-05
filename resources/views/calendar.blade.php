@extends('layouts.app')
@section('title', 'Calendar')

@section('content')
<div class="topbar">
  <h1><span class="material-symbols-rounded">calendar_month</span>Calendar</h1>
  <div class="u-row-actions">
    <button id="prevMonth" class="u-btn u-btn--secondary u-btn--sm" data-tooltip="Previous month"><span class="material-symbols-rounded icon-sm">chevron_left</span> Prev</button>
    <button id="nextMonth" class="u-btn u-btn--secondary u-btn--sm" data-tooltip="Next month">Next <span class="material-symbols-rounded icon-sm">chevron_right</span></button>
  </div>
</div>
<h2 id="monthLabel"></h2>
<div class="cal-legend">
  <span class="cal-legend-item" data-tooltip="Days with income" data-tooltip-pos="bottom"><span class="cal-badge income">↑</span> Income</span>
  <span class="cal-legend-item" data-tooltip="Days with expense" data-tooltip-pos="bottom"><span class="cal-badge expense">↓</span> Expense</span>
  <span class="cal-legend-item" data-tooltip="Income is greater than expense" data-tooltip-pos="bottom"><span class="legend-box net-positive"></span> Net positive</span>
  <span class="cal-legend-item" data-tooltip="Expense is greater than income" data-tooltip-pos="bottom"><span class="legend-box net-negative"></span> Net negative</span>
</div>
<section id="calendarGrid" class="calendar-grid"></section>
@endsection

@section('modals')
  <div id="dayModal" class="u-modal-overlay">
    <div class="u-modal">
      <div class="u-modal__head">
        <h2 id="dayTitle" class="u-modal__title"></h2>
        <button id="closeDayModal" type="button" class="u-btn u-btn--icon" data-tooltip="Close"><span class="material-symbols-rounded icon-sm">close</span></button>
      </div>
      <div id="dayList"></div>
    </div>
  </div>
  
@endsection

@push('scripts')
<script src="{{ asset('assets/js/calendar.js') }}"></script>
@endpush
