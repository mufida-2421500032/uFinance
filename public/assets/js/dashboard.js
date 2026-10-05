let expense7Chart;
let donutChart;

async function loadDashboard() {
  const metricWrap = document.querySelector('#metrics');
  const latestWrap = document.querySelector('#latest');
  const goalsWrap = document.querySelector('#goalProgress');
  setLoading(metricWrap);
  setLoading(latestWrap);

  const [summary, transactions, goals, stats] = await Promise.all([
    FinanceAPI.summary(),
    FinanceAPI.transactions(),
    FinanceAPI.goals(),
    FinanceAPI.stats('daily'),
  ]);

  const alert = document.querySelector('#todayAlert');
  alert.className = `u-alert ${summary.alert_status === 'WARNING' ? 'u-alert--warning' : summary.alert_status === 'SAFE' ? 'u-alert--safe' : 'u-alert--neutral'}`;
  if (summary.period_status === 'NO_PERIOD') {
    alert.textContent = 'Budget inactive - set a period first.';
  } else if (summary.period_status === 'EXPIRED') {
    alert.textContent = 'Period expired - create a new period.';
  } else if (summary.alert_status === 'WARNING') {
    alert.textContent = `WARNING: today's expense ${rupiah(summary.today_expense)} exceeds daily budget ${rupiah(summary.daily_budget)}`;
  } else {
    alert.textContent = `SAFE: today's expense ${rupiah(summary.today_expense)} is within the limit ${rupiah(summary.daily_budget)}`;
  }

  const tooltips = {
    'Balance': 'Total income minus total expense',
    'Income': 'Total income from all transactions',
    'Expense': 'Total expense from all transactions',
    'Daily Budget': 'Daily expense limit based on period',
    'Remaining Period Days': 'Days left in active budget period',
    'Remaining Days': 'Days left this month',
  };
  metricWrap.innerHTML = [
    ['Balance', summary.balance],
    ['Income', summary.income],
    ['Expense', summary.expense],
    ['Daily Budget', summary.daily_budget],
    [summary.period ? 'Remaining Period Days' : 'Remaining Days', summary.remaining_days],
  ].map(([label, value]) => `
    <article class="u-card u-metric animate-in" data-tooltip="${tooltips[label] || ''}" data-tooltip-pos="bottom">
      <div class="u-metric__label">${label}</div>
      <div class="u-metric__value">${label === 'Remaining Days' || label === 'Remaining Period Days' ? value : rupiah(value)}</div>
    </article>
  `).join('');

  latestWrap.innerHTML = transactions.length
    ? transactions.slice(0, 5).map((tx) => `
      <div class="u-tx-item">
        <span class="u-badge ${tx.type === 'income' ? 'u-badge--income' : 'u-badge--expense'}">${tx.type}</span>
        <span class="u-tx-amount">${rupiah(tx.amount)}</span>
        <span class="u-tx-meta">${tx.category || 'Uncategorized'}</span>
        <span class="u-tx-date">${tx.date}</span>
      </div>
    `).join('')
    : emptyState('No transactions yet.');

  goalsWrap.innerHTML = goals.filter((goal) => goal.status === 'active').length
    ? goals.filter((goal) => goal.status === 'active').map((goal) => {
      const progress = pct(Number(goal.current_amount), Number(goal.target_amount));
      return `
        <div class="u-goal-mini">
          <div class="u-goal-mini__head">
            <span>${goal.name}</span>
            <span class="u-goal-mini__pct">${Math.round(progress)}%</span>
          </div>
          <div class="u-progress u-progress--sm">
            <div class="u-progress__fill u-progress__fill--secondary" style="width:${progress}%"></div>
          </div>
        </div>
      `;
    }).join('')
    : emptyState('No active goals yet.');

  const last7 = stats.series.slice(-7);
  const categories = stats.categories;
  expense7Chart?.destroy();
  donutChart?.destroy();

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#9B96B0' : '#6B6680';

  expense7Chart = new Chart(document.querySelector('#expense7'), {
    type: 'bar',
    data: {
      labels: last7.map((x) => x.label),
      datasets: [{
        label: 'Expense',
        data: last7.map((x) => Number(x.expense)),
        backgroundColor: 'rgba(255, 45, 120, 0.7)',
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter' } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter' } } },
      },
    },
  });

  donutChart = new Chart(document.querySelector('#categoryDonut'), {
    type: 'doughnut',
    data: {
      labels: categories.map((x) => x.category),
      datasets: [{
        data: categories.map((x) => Number(x.total)),
        backgroundColor: ['#FF2D78', '#7C3AED', '#10B981', '#F59E0B', '#3B82F6', '#A78BFA'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', size: 12 }, padding: 16, usePointStyle: true, pointStyleWidth: 8 } },
      },
    },
  });
}

window.loadDashboard = loadDashboard;
document.addEventListener('DOMContentLoaded', () => loadDashboard().catch((error) => alert(error.message)));
