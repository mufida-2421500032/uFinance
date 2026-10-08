let txType = 'expense';
let editingId = null;
let categories = [];
let activePeriod = null;

async function bootTransactions() {
  categories = await FinanceAPI.categories();
  activePeriod = await FinanceAPI.activePeriod().catch(() => null);
  fillCategories(document.querySelector('#category'));
  fillCategories(document.querySelector('#editCategory'));
  document.querySelector('#incomePeriodFields').innerHTML = Periods.periodFormHtml('incomePeriod');
  Periods.bindPeriodForm('incomePeriod');
  document.querySelector('#date').valueAsDate = new Date();
  bindTransactionEvents();
  await renderTransactions();
}

function fillCategories(select) {
  select.innerHTML = '<option value="">Uncategorized</option>' + categories.map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

function bindTransactionEvents() {
  document.querySelectorAll('[data-type]').forEach((button) => {
    button.addEventListener('click', () => {
      txType = button.dataset.type;
      document.querySelectorAll('[data-type]').forEach((btn) => btn.classList.toggle('active', btn.dataset.type === txType));
      document.querySelector('#incomePeriodSection').hidden = txType !== 'income';
    });
  });
  document.querySelector('#resetPeriodToggle').addEventListener('change', (event) => {
    document.querySelector('#incomePeriodFields').hidden = !event.target.checked;
  });

  document.querySelector('#transactionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    let period = null;
    if (txType === 'income' && document.querySelector('#resetPeriodToggle').checked) {
      period = Periods.readPeriodForm('incomePeriod');
      if (!period) return;
      if (activePeriod?.id && !confirm('Active period will be replaced. Continue?')) return;
    }

    const tx = await FinanceAPI.createTransaction(formData(''));
    if (period) {
      period.linked_income_id = tx.id;
      await FinanceAPI.createPeriod(period);
      activePeriod = await FinanceAPI.activePeriod().catch(() => null);
    }
    event.target.reset();
    document.querySelector('#incomePeriodSection').hidden = true;
    document.querySelector('#incomePeriodFields').hidden = true;
    document.querySelector('#date').valueAsDate = new Date();
    await renderTransactions();
  });

  document.querySelector('#editForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await FinanceAPI.updateTransaction(editingId, formData('edit'));
    activePeriod = await FinanceAPI.activePeriod().catch(() => null);
    closeModal();
    await renderTransactions();
  });

  document.querySelector('#closeModal').addEventListener('click', closeModal);
  document.querySelector('#editLinkedPeriod').addEventListener('click', () => Periods.openPeriodModal(activePeriod));
  document.querySelector('#resetLinkedPeriod').addEventListener('click', () => Periods.openPeriodModal());
}

function formData(prefix) {
  return {
    type: prefix ? document.querySelector('#editType').value : txType,
    amount: document.querySelector(`#${prefix ? 'editAmount' : 'amount'}`).value,
    date: document.querySelector(`#${prefix ? 'editDate' : 'date'}`).value,
    category_id: document.querySelector(`#${prefix ? 'editCategory' : 'category'}`).value,
    note: document.querySelector(`#${prefix ? 'editNote' : 'note'}`).value,
  };
}

async function renderTransactions() {
  const body = document.querySelector('#transactionRows');
  body.innerHTML = '<tr><td colspan="6" class="u-loading">Loading...</td></tr>';
  const transactions = await FinanceAPI.transactions();
  body.innerHTML = transactions.length ? transactions.map((tx) => `
    <tr>
      <td data-label="Type"><span class="u-badge ${tx.type === 'income' ? 'u-badge--income' : 'u-badge--expense'}">${tx.type}</span></td>
      <td data-label="Amount">${rupiah(tx.amount)}</td>
      <td data-label="Category">${tx.category || 'Uncategorized'}</td>
      <td data-label="Date">${tx.date}</td>
      <td data-label="Note" class="col-note">${tx.note || '-'}</td>
      <td data-label="Action" class="col-action">
        <div class="u-row-actions">
          <button type="button" class="u-btn u-btn--secondary u-btn--sm" data-edit="${tx.id}" data-tooltip="Edit this transaction">Edit</button>
          <button type="button" class="u-btn u-btn--danger u-btn--sm" data-delete="${tx.id}" data-tooltip="Delete permanently">Delete</button>
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="6"><div class="u-empty">No transactions yet.</div></td></tr>';

  body.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => openEdit(transactions.find((tx) => Number(tx.id) === Number(button.dataset.edit)))));
  body.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', async () => {
    if (confirm('Delete this transaction?')) {
      await FinanceAPI.deleteTransaction(button.dataset.delete);
      await renderTransactions();
    }
  }));
}

function openEdit(tx) {
  editingId = tx.id;
  document.querySelector('#editType').value = tx.type;
  document.querySelector('#editAmount').value = tx.amount;
  document.querySelector('#editDate').value = tx.date;
  document.querySelector('#editCategory').value = tx.category_id || '';
  document.querySelector('#editNote').value = tx.note || '';
  const linked = activePeriod?.linked_income_id && Number(activePeriod.linked_income_id) === Number(tx.id);
  document.querySelector('#linkedPeriodNotice').hidden = !linked;
  document.querySelector('#editModal').classList.add('open');
}

function closeModal() {
  document.querySelector('#editModal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => bootTransactions().catch((error) => alert(error.message)));
