@extends('layouts.app')
@section('title', 'Budget')

@section('content')
<h1><span class="material-symbols-rounded">savings</span>Today's Budget</h1>
<div id="budgetStatus" class="u-alert u-alert--safe" data-tooltip="Today's expense vs daily budget" data-tooltip-pos="bottom">Loading budget status...</div>
<section id="periodCard" class="u-mb-section"></section>
<section id="budgetWrap" class="grid cards"></section>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/periods.js') }}"></script>
<script src="{{ asset('assets/js/budget.js') }}"></script>
@endpush
