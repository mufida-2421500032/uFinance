async function loadBudget() {
  const summary = await FinanceAPI.summary();
  const progress = pct(summary.today_expense, summary.daily_budget);
  document.querySelector('#budgetWrap').innerHTML = `
    <article class="u-card u-metric" data-tooltip="Daily expense limit from active period" data-tooltip-pos="bottom">
      <div class="u-metric__label">Today's Daily Budget</div>
      <div class="u-metric__value">${rupiah(summary.daily_budget)}</div>
    </article>
    <article class="u-card u-metric" data-tooltip="Your total expense today" data-tooltip-pos="bottom">
      <div class="u-metric__label">Today's Expense</div>
      <div class="u-metric__value">${rupiah(summary.today_expense)}</div>
      <div class="u-progress u-metric__progress"><div class="u-progress__fill" style="width:${progress}%"></div></div>
    </article>
    <article class="u-card u-metric" data-tooltip="Total income minus total expense" data-tooltip-pos="bottom">
      <div class="u-metric__label">Active Balance</div>
      <div class="u-metric__value">${rupiah(summary.balance)}</div>
    </article>
    <article class="u-card u-metric" data-tooltip="Days left in budget period" data-tooltip-pos="bottom">
      <div class="u-metric__label">Remaining Days This Month</div>
      <div class="u-metric__value">${summary.remaining_days}</div>
      <p class="u-metric__note">${summary.period ? `${summary.period.start_date} to ${summary.period.end_date}` : 'No active period.'}</p>
    </article>
  `;
  const status = document.querySelector('#budgetStatus');
  status.className = `u-alert ${summary.alert_status === 'WARNING' ? 'u-alert--warning' : summary.alert_status === 'SAFE' ? 'u-alert--safe' : 'u-alert--neutral'}`;
  if (summary.period_status === 'NO_PERIOD') {
    status.textContent = 'Budget inactive - set a period first.';
  } else if (summary.period_status === 'EXPIRED') {
    status.textContent = 'Period expired - create a new period.';
  } else if (summary.alert_status === 'WARNING') {
    status.textContent = 'WARNING: today\'s expense has exceeded the daily budget.';
  } else {
    status.textContent = 'SAFE: today\'s expense is under control.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBudget().catch((error) => alert(error.message));
});
