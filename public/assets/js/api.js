const API_BASE = (window.APP && window.APP.apiBase) || '/api';

async function request(path, options = {}) {
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrf,
      ...(options.headers || {}),
    },
  });
  if (response.status === 401 || response.status === 419) {
    // Sesi login habis -> kembali ke halaman login
    window.location.href = (window.APP && window.APP.loginUrl) || '/login';
    throw new Error('Sesi berakhir. Silakan masuk kembali.');
  }
  let payload = null;
  try { payload = await response.json(); } catch (e) { /* bukan JSON */ }
  if (!response.ok || !payload || payload.status === 'error') {
    throw new Error((payload && payload.message) || `Request gagal (${response.status})`);
  }
  return payload.data;
}

const FinanceAPI = {
  categories: () => request('/categories'),
  transactions: (date = '') => request(`/transactions${date ? `?date=${date}` : ''}`),
  calendar: (month) => request(`/calendar?month=${encodeURIComponent(month)}`),
  createTransaction: (data) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id, data) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
  summary: (days = '') => request(`/summary${days ? `?days=${encodeURIComponent(days)}` : ''}`),
  activePeriod: () => request('/periods/active'),
  createPeriod: (data) => request('/periods', { method: 'POST', body: JSON.stringify(data) }),
  updateActivePeriod: (data) => request('/periods/active', { method: 'PUT', body: JSON.stringify(data) }),
  closeActivePeriod: () => request('/periods/active', { method: 'DELETE' }),
  goals: () => request('/goals'),
  createGoal: (data) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateGoal: (id, data) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
  stats: (period = 'daily') => request(`/stats?period=${period}`),
};

const rupiah = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const pct = (current, target) => Math.max(0, Math.min(100, target > 0 ? (current / target) * 100 : 0));

function budgetDaysOverride() {
  const value = Number(localStorage.getItem('budget_days_override') || 0);
  return value > 0 ? value : '';
}

function setLoading(el, text = 'Memuat data...') {
  el.innerHTML = `<div class="u-loading">${text}</div>`;
}

function emptyState(text) {
  return `<div class="u-empty">${text}</div>`;
}
