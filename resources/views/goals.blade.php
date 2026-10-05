@extends('layouts.app')
@section('title', 'Goals')

@section('content')
<h1><span class="material-symbols-rounded">emoji_events</span>Savings Goals</h1>
<section class="u-panel">
  <form id="goalForm" class="u-form-grid">
    <label class="u-label" data-tooltip="Savings goal name" data-tooltip-pos="bottom">Goal Name <input id="goalName" class="u-input" required></label>
    <label class="u-label" data-tooltip="Target amount in IDR" data-tooltip-pos="bottom">Target <input id="targetAmount" type="number" min="0" step="1000" class="u-input" required></label>
    <label class="u-label" data-tooltip="Target deadline (optional)" data-tooltip-pos="bottom">Deadline <input id="deadline" type="date" class="u-input"></label>
    <button type="submit" class="u-btn u-btn--primary" data-tooltip="Create new savings goal"><span class="material-symbols-rounded icon-sm">add</span> Add Goal</button>
  </form>
</section>
<section id="goalsList" class="grid two-col u-mt-section"></section>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/goals.js') }}"></script>
@endpush
