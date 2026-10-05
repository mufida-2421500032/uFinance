let lineChart;
let barChart;

async function renderStats(period = 'daily') {
  const stats = await FinanceAPI.stats(period);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#9B96B0' : '#6B6680';

  lineChart?.destroy();
  barChart?.destroy();

  lineChart = new Chart(document.querySelector('#incomeExpenseChart'), {
    type: 'line',
    data: {
      labels: stats.series.map((item) => item.label),
      datasets: [
        {
          label: 'Income',
          data: stats.series.map((item) => Number(item.income)),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#10B981',
        },
        {
          label: 'Expense',
          data: stats.series.map((item) => Number(item.expense)),
          borderColor: '#FF2D78',
          backgroundColor: 'rgba(255, 45, 120, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#FF2D78',
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { intersect: false, mode: 'index' },
      plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', size: 12 }, padding: 16, usePointStyle: true, pointStyleWidth: 8 } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter' } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter' } } },
      },
    },
  });

  barChart = new Chart(document.querySelector('#categoryChart'), {
    type: 'bar',
    data: {
      labels: stats.categories.map((item) => item.category),
      datasets: [{
        label: 'Expense',
        data: stats.categories.map((item) => Number(item.total)),
        backgroundColor: ['#FF2D78', '#7C3AED', '#10B981', '#F59E0B', '#3B82F6', '#A78BFA'],
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
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-period]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-period]').forEach((btn) => btn.classList.toggle('active', btn === button));
      renderStats(button.dataset.period).catch((error) => alert(error.message));
    });
  });
  renderStats().catch((error) => alert(error.message));
});
