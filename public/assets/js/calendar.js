let calendarDate = new Date();
let calendarData = {};

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getYearMonth() {
  return `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}`;
}

function formatCompact(amount) {
  const value = Number(amount || 0);
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}jt`;
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000)}rb`;
  }
  return String(value);
}

async function fetchCalendarData(yearMonth) {
  return FinanceAPI.calendar(yearMonth);
}

async function loadCalendar() {
  await renderCalendar();
  document.querySelector('#prevMonth').addEventListener('click', async () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    await renderCalendar();
  });
  document.querySelector('#nextMonth').addEventListener('click', async () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    await renderCalendar();
  });
  document.querySelector('#closeDayModal').addEventListener('click', () => document.querySelector('#dayModal').classList.remove('open'));
}

async function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const grid = document.querySelector('#calendarGrid');

  calendarData = await fetchCalendarData(getYearMonth());
  document.querySelector('#monthLabel').textContent = first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  grid.innerHTML = '';
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((label) => {
    const head = document.createElement('strong');
    head.textContent = label;
    grid.appendChild(head);
  });

  for (let i = 0; i < first.getDay(); i += 1) {
    const empty = document.createElement('div');
    empty.className = 'cal-day muted';
    grid.appendChild(empty);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    grid.appendChild(renderCalendarDay(iso, calendarData[iso], day));
  }
}

function renderCalendarDay(dateStr, dayData, dateNum) {
  const div = document.createElement('button');
  div.type = 'button';
  div.className = 'cal-day';
  div.dataset.date = dateStr;

  if (dayData) {
    if (dayData.has_income) div.classList.add('has-income');
    if (dayData.has_expense) div.classList.add('has-expense');
    if (Number(dayData.net) > 0) div.classList.add('net-positive');
    if (Number(dayData.net) < 0) div.classList.add('net-negative');
  }

  if (dateStr === getTodayStr()) div.classList.add('today');

  const dateSpan = document.createElement('span');
  dateSpan.className = 'cal-date';
  dateSpan.textContent = dateNum;
  div.appendChild(dateSpan);

  if (dayData) {
    const wrap = document.createElement('div');
    wrap.className = 'cal-badges';

    if (dayData.has_income) {
      const badge = document.createElement('span');
      badge.className = 'cal-badge income';
      badge.textContent = `↑ ${formatCompact(dayData.total_income)}`;
      wrap.appendChild(badge);
    }

    if (dayData.has_expense) {
      const badge = document.createElement('span');
      badge.className = 'cal-badge expense';
      badge.textContent = `↓ ${formatCompact(dayData.total_expense)}`;
      wrap.appendChild(badge);
    }

    div.appendChild(wrap);
  }

  div.addEventListener('click', () => openDayModal(dateStr));
  return div;
}

async function openDayModal(dateStr) {
  const items = await FinanceAPI.transactions(dateStr);
  const incomes = items.filter((tx) => tx.type === 'income');
  const expenses = items.filter((tx) => tx.type === 'expense');
  const totalIn = incomes.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalOut = expenses.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const net = totalIn - totalOut;

  renderDayModal({ dateStr, incomes, expenses, totalIn, totalOut, net });
}

function renderDayModal({ dateStr, incomes, expenses, totalIn, totalOut, net }) {
  const readable = new Date(`${dateStr}T00:00:00`)
    .toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  document.querySelector('#dayTitle').textContent = readable;
  document.querySelector('#dayList').innerHTML = `
    ${renderModalSection('income', 'INCOME', incomes, totalIn)}
    ${renderModalSection('expense', 'EXPENSE', expenses, totalOut)}
    <div class="modal-net ${net >= 0 ? 'positive' : 'negative'}">
      <span>NET TODAY</span>
      <strong>${net >= 0 ? '+' : ''}${rupiah(net)}</strong>
    </div>
  `;
  document.querySelector('#dayModal').classList.add('open');
}

function renderModalSection(type, title, items, total) {
  const icon = type === 'income' ? '↑' : '↓';
  return `
    <div class="modal-section">
      <div class="modal-section-header ${type}">
        <span>${title}</span>
        <strong>${rupiah(total)}</strong>
      </div>
      <div class="modal-list">
        ${items.length ? items.map((item) => `
          <div class="modal-item ${type}">
            <span class="modal-item-icon">${icon}</span>
            <span class="modal-item-label">${item.note || 'No note'} - ${item.category || 'Uncategorized'}</span>
            <span class="modal-item-amount">${rupiah(item.amount)}</span>
          </div>
        `).join('') : `<div class="u-empty">No ${type === 'income' ? 'income' : 'expense'}.</div>`}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => loadCalendar().catch((error) => alert(error.message)));
