@extends('layouts.app')
@section('title', 'Transactions')

@section('content')
<div class="page-header-row">
  <h1 class="page-title">Transactions</h1>
  <div class="user-greeting-inline">
    Hello, <span class="user-name-display"></span>
    <button class="btn-edit-name" type="button" onclick="openNameModal()" data-tooltip="Edit Display Name">
      <span class="material-symbols-rounded" style="font-size:16px">edit</span>
    </button>
  </div>
</div>
<section class="u-panel">
  <form id="transactionForm" class="u-form-grid">
    <div class="u-type-toggle">
      <button type="button" class="u-btn u-btn--secondary" data-type="income" data-tooltip="Income (Salary, bonuses, etc.)" data-tooltip-pos="bottom"><span class="material-symbols-rounded icon-sm">trending_up</span> Income</button>
      <button type="button" class="u-btn u-btn--secondary active" data-type="expense" data-tooltip="Expense (Shopping, food, etc.)" data-tooltip-pos="bottom"><span class="material-symbols-rounded icon-sm">trending_down</span> Expense</button>
    </div>
    <label class="u-label" data-tooltip="Amount in IDR" data-tooltip-pos="bottom">Amount <input id="amount" type="number" min="0" step="1000" class="u-input" required></label>
    <label class="u-label" data-tooltip="Date of transaction" data-tooltip-pos="bottom">Date <input id="date" type="date" class="u-input" required></label>
    <label class="u-label" data-tooltip="Group by category" data-tooltip-pos="bottom">Category <select id="category" class="u-select"></select></label>
    <section id="incomePeriodSection" class="period-inline" hidden>
      <label class="check-row" data-tooltip="Auto-create budget period" data-tooltip-pos="bottom"><input id="resetPeriodToggle" type="checkbox"> Use this income to reset the period</label>
      <p class="period-warning">If there is an active period, it will be replaced.</p>
      <div id="incomePeriodFields" hidden></div>
    </section>
    <label class="u-label" style="grid-column:1/-2" data-tooltip="Additional note (optional)" data-tooltip-pos="bottom">Note <textarea id="note" class="u-textarea"></textarea></label>
    <button type="submit" class="u-btn u-btn--primary" data-tooltip="Save new transaction"><span class="material-symbols-rounded icon-sm">add</span> Add</button>
  </form>
</section>
<section class="u-panel u-mt-section">
  <div class="table-wrap">
    <table class="u-table">
      <thead>
        <tr>
          <th data-tooltip="Income or Expense" data-tooltip-pos="bottom">Type</th>
          <th data-tooltip="Transaction amount in IDR" data-tooltip-pos="bottom">Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th data-tooltip="Note or description" data-tooltip-pos="bottom">Note</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="transactionRows"></tbody>
    </table>
  </div>
</section>
@endsection

@section('modals')
  <div id="editModal" class="u-modal-overlay">
    <div class="u-modal">
      <div class="u-modal__head">
        <h2 class="u-modal__title">Edit Transaction</h2>
        <button id="closeModal" type="button" class="u-btn u-btn--icon" data-tooltip="Close"><span class="material-symbols-rounded icon-sm">close</span></button>
      </div>
      <div id="linkedPeriodNotice" class="period-linked-warning" hidden>
        <h3 style="margin:0 0 12px;font-size:15px">This transaction is linked to an active period</h3>
        <div class="u-row-actions">
          <button id="editLinkedPeriod" type="button" class="u-btn u-btn--secondary u-btn--sm" data-tooltip="Edit Period">Edit Period Only</button>
          <button id="resetLinkedPeriod" type="button" class="u-btn u-btn--primary u-btn--sm" data-tooltip="Reset & Create Period">Reset & Create New Period</button>
        </div>
      </div>
      <form id="editForm" class="grid">
        <label class="u-label">Type <select id="editType" class="u-select"><option value="income">Income</option><option value="expense">Expense</option></select></label>
        <label class="u-label">Amount <input id="editAmount" type="number" min="0" step="1000" class="u-input" required></label>
        <label class="u-label">Date <input id="editDate" type="date" class="u-input" required></label>
        <label class="u-label">Category <select id="editCategory" class="u-select"></select></label>
        <label class="u-label">Note <textarea id="editNote" class="u-textarea"></textarea></label>
        <button type="submit" class="u-btn u-btn--primary" style="width:100%"><span class="material-symbols-rounded icon-sm">save</span> Save</button>
      </form>
    </div>
  </div>
  
@endsection

@push('scripts')
<script src="{{ asset('assets/js/periods.js') }}"></script>
<script src="{{ asset('assets/js/transactions.js') }}"></script>
@endpush
