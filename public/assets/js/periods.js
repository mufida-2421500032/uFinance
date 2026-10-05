function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + Number(days));
  return date.toISOString().slice(0, 10);
}

function diffDays(startDate, endDate) {
  return Math.round((new Date(`${endDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000);
}

function periodFormHtml(prefix = 'period') {
  return `
    <div class="period-form grid">
      <label class="u-label">Start Date <input id="${prefix}Start" type="date" class="u-input" required></label>
      <label class="u-label">Duration
        <div class="period-duration-row">
          <button type="button" class="u-btn u-btn--secondary u-btn--sm" data-duration="7">7</button>
          <button type="button" class="u-btn u-btn--secondary u-btn--sm" data-duration="14">14</button>
          <button type="button" class="u-btn u-btn--secondary u-btn--sm" data-duration="21">21</button>
          <input id="${prefix}Duration" type="number" min="1" placeholder="Custom" class="u-input">
        </div>
      </label>
      <label class="u-label">End Date <input id="${prefix}End" type="date" class="u-input" required></label>
      <label class="u-label">Budget Mode
        <select id="${prefix}Mode" class="u-select">
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
        </select>
      </label>
      <label class="u-label">Daily Budget <input id="${prefix}DailyBudget" type="number" min="0" step="1000" class="u-input" disabled></label>
      <p id="${prefix}Error" class="inline-error"></p>
    </div>
  `;
}

function bindPeriodForm(prefix = 'period', initial = {}) {
  const start = document.querySelector(`#${prefix}Start`);
  const end = document.querySelector(`#${prefix}End`);
  const duration = document.querySelector(`#${prefix}Duration`);
  const mode = document.querySelector(`#${prefix}Mode`);
  const dailyBudget = document.querySelector(`#${prefix}DailyBudget`);

  start.value = initial.start_date || new Date().toISOString().slice(0, 10);
  end.value = initial.end_date || addDays(start.value, initial.total_days || 14);
  duration.value = initial.total_days || diffDays(start.value, end.value);
  mode.value = initial.budget_mode || 'auto';
  dailyBudget.value = initial.daily_budget || '';
  dailyBudget.disabled = mode.value === 'auto';

  const container = start.closest('.period-form');
  container.querySelectorAll(`[data-duration]`).forEach((button) => {
    button.addEventListener('click', () => {
      duration.value = button.dataset.duration;
      end.value = addDays(start.value, duration.value);
    });
  });

  duration.addEventListener('input', () => {
    if (Number(duration.value) > 0 && start.value) end.value = addDays(start.value, duration.value);
  });
  start.addEventListener('change', () => {
    if (Number(duration.value) > 0) end.value = addDays(start.value, duration.value);
  });
  end.addEventListener('change', () => {
    if (start.value && end.value) duration.value = Math.max(0, diffDays(start.value, end.value));
  });
  mode.addEventListener('change', () => {
    dailyBudget.disabled = mode.value === 'auto';
    dailyBudget.toggleAttribute('required', mode.value === 'manual');
  });
}

function readPeriodForm(prefix = 'period') {
  const data = {
    start_date: document.querySelector(`#${prefix}Start`).value,
    end_date: document.querySelector(`#${prefix}End`).value,
    budget_mode: document.querySelector(`#${prefix}Mode`).value,
    daily_budget: document.querySelector(`#${prefix}DailyBudget`).value,
  };
  const error = document.querySelector(`#${prefix}Error`);
  error.textContent = '';

  if (!data.start_date || !data.end_date) {
    error.textContent = 'Start and end dates are required.';
    return null;
  }
  if (diffDays(data.start_date, data.end_date) <= 0) {
    error.textContent = 'End date must be after start date.';
    return null;
  }
  if (data.budget_mode === 'manual' && Number(data.daily_budget) <= 0) {
    error.textContent = 'Manual daily budget must be greater than 0.';
    return null;
  }
  if (data.budget_mode === 'auto') data.daily_budget = null;
  return data;
}

async function renderPeriodCard(selector = '#periodCard') {
  const card = document.querySelector(selector);
  if (!card) return;
  const summary = await FinanceAPI.summary();
  const period = summary.period;

  if (!period) {
    card.innerHTML = `
      <section class="period-card period-muted">
        <div class="period-head"><h2>NO ACTIVE PERIOD</h2><button type="button" class="u-btn u-btn--primary" data-open-period data-tooltip="Create new budget period">+ Set Period</button></div>
        <p class="period-card__body">Budget calculation is disabled until a period is created.</p>
      </section>
    `;
  } else if (period.periode_status === 'EXPIRED') {
    card.innerHTML = `
      <section class="period-card period-expired">
        <div class="period-head"><h2>PERIOD EXPIRED</h2><button type="button" class="u-btn u-btn--primary" data-open-period data-tooltip="Create new budget period">+ New Period</button></div>
        <p class="period-card__body">Expired on ${period.end_date}. Please set a new period to continue.</p>
      </section>
    `;
  } else {
    const elapsed = Math.max(0, period.total_days - period.sisa_hari);
    const progress = pct(elapsed, period.total_days);
    card.innerHTML = `
      <section class="period-card">
        <div class="period-head">
          <h2>ACTIVE PERIOD</h2>
          <div class="u-row-actions"><button type="button" class="u-btn u-btn--secondary u-btn--sm" data-edit-period data-tooltip="Edit dates or budget">Edit</button><button type="button" class="u-btn u-btn--danger u-btn--sm" data-close-period data-tooltip="End active period">Close Period</button></div>
        </div>
        <p class="period-card__body">${period.start_date} → ${period.end_date} · ${period.total_days} total days</p>
        <div class="period-meta">
          <span>Left: ${period.sisa_hari} days</span>
          <span class="u-badge ${period.budget_mode === 'auto' ? 'u-badge--auto' : 'u-badge--manual'}" data-tooltip="${period.budget_mode === 'auto' ? 'Auto-calculated Budget' : 'Budget set manually by you'}">${period.budget_mode.toUpperCase()}</span>
          <span>Daily Budget: ${rupiah(period.daily_budget)}</span>
        </div>
        <div class="period-bar-track"><div class="period-bar-fill" style="width:${progress}%"></div></div>
        <p class="period-card__elapsed">${elapsed} days passed out of ${period.total_days}</p>
      </section>
    `;
  }

  card.querySelectorAll('[data-open-period]').forEach((button) => button.addEventListener('click', () => openPeriodModal()));
  card.querySelectorAll('[data-edit-period]').forEach((button) => button.addEventListener('click', () => openPeriodModal(summary.period)));
  card.querySelectorAll('[data-close-period]').forEach((button) => button.addEventListener('click', async () => {
    if (confirm('Close active period?')) {
      await FinanceAPI.closeActivePeriod();
      await renderPeriodCard(selector);
      if (window.loadDashboard) await window.loadDashboard();
    }
  }));
}

function ensurePeriodModal() {
  if (document.querySelector('#periodModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="periodModal" class="u-modal-overlay">
      <div class="u-modal">
        <div class="u-modal__head"><h2 id="periodModalTitle" class="u-modal__title">Set Period</h2><button id="closePeriodModal" type="button" class="u-btn u-btn--icon" data-tooltip="Close"><span class="material-symbols-rounded icon-sm">close</span></button></div>
        <form id="periodModalForm" class="grid">
          ${periodFormHtml('modalPeriod')}
          <button type="submit" class="u-btn u-btn--primary" style="width:100%">Save Period</button>
        </form>
      </div>
    </div>
  `);
  document.querySelector('#closePeriodModal').addEventListener('click', () => document.querySelector('#periodModal').classList.remove('open'));
}

function openPeriodModal(initial = null) {
  ensurePeriodModal();
  document.querySelector('#periodModalTitle').textContent = initial ? 'Edit Period' : 'Set Period';
  bindPeriodForm('modalPeriod', initial || {});
  const form = document.querySelector('#periodModalForm');
  form.onsubmit = async (event) => {
    event.preventDefault();
    const data = readPeriodForm('modalPeriod');
    if (!data) return;
    if (initial) {
      await FinanceAPI.updateActivePeriod(data);
    } else {
      try {
        const active = await FinanceAPI.activePeriod();
        if (active?.id && !confirm('Active period will be replaced. Continue?')) return;
      } catch (error) {
        // No active period is a valid state.
      }
      await FinanceAPI.createPeriod(data);
    }
    document.querySelector('#periodModal').classList.remove('open');
    await renderPeriodCard();
    if (window.loadDashboard) await window.loadDashboard();
  };
  document.querySelector('#periodModal').classList.add('open');
}

window.Periods = {
  addDays,
  diffDays,
  periodFormHtml,
  bindPeriodForm,
  readPeriodForm,
  renderPeriodCard,
  openPeriodModal,
};

document.addEventListener('DOMContentLoaded', () => renderPeriodCard().catch((error) => console.warn(error.message)));
