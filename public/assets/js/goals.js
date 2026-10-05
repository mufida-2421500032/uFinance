async function bootGoals() {
  document.querySelector('#goalForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await FinanceAPI.createGoal({
      name: document.querySelector('#goalName').value,
      target_amount: document.querySelector('#targetAmount').value,
      deadline: document.querySelector('#deadline').value || null,
    });
    event.target.reset();
    await renderGoals();
  });
  await renderGoals();
}

async function renderGoals() {
  const wrap = document.querySelector('#goalsList');
  setLoading(wrap);
  const goals = await FinanceAPI.goals();
  wrap.innerHTML = goals.length ? goals.map((goal) => {
    const progress = pct(Number(goal.current_amount), Number(goal.target_amount));
    return `
      <article class="u-card">
        <div class="u-goal-card__header">
          <h2 class="u-goal-card__name">${goal.name}</h2>
          <span class="u-badge ${goal.status === 'achieved' ? 'u-badge--active' : 'u-badge--primary'}">${goal.status === 'achieved' ? 'Achieved' : 'Active'}</span>
        </div>
        <p class="u-goal-card__meta">${rupiah(goal.current_amount)} / ${rupiah(goal.target_amount)} ${goal.deadline ? `— ${goal.deadline}` : ''}</p>
        <div class="u-progress"><div class="u-progress__fill u-progress__fill--secondary" style="width:${progress}%"></div></div>
        <p class="u-goal-card__pct">${Math.round(progress)}%</p>
        <div class="u-row-actions u-goal-card__actions">
          <input type="number" min="0" step="1000" placeholder="Top-up" class="u-input u-goal-card__topup" data-topup-input="${goal.id}" data-tooltip="Enter top-up amount" data-tooltip-pos="bottom">
          <button type="button" class="u-btn u-btn--primary u-btn--sm" data-topup="${goal.id}" data-tooltip="Add balance to this goal">Top-up</button>
          <button type="button" class="u-btn u-btn--danger u-btn--sm" data-delete-goal="${goal.id}" data-tooltip="Delete goal permanently">Delete</button>
        </div>
      </article>
    `;
  }).join('') : emptyState('No savings goals yet.');

  wrap.querySelectorAll('[data-topup]').forEach((button) => button.addEventListener('click', async () => {
    const input = wrap.querySelector(`[data-topup-input="${button.dataset.topup}"]`);
    if (Number(input.value) > 0) {
      await FinanceAPI.updateGoal(button.dataset.topup, { top_up: Number(input.value) });
      await renderGoals();
    }
  }));

  wrap.querySelectorAll('[data-delete-goal]').forEach((button) => button.addEventListener('click', async () => {
    if (confirm('Delete this goal?')) {
      await FinanceAPI.deleteGoal(button.dataset.deleteGoal);
      await renderGoals();
    }
  }));
}

document.addEventListener('DOMContentLoaded', () => bootGoals().catch((error) => alert(error.message)));
