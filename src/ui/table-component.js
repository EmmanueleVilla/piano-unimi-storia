export function renderTableComponent(table, selectedCodes = [], tableValidation = null) {
  const container = document.createElement('div');
  container.className = 'card table-card';
  container.id = `table-card-${table.id}`;
  container.setAttribute('data-testid', `table-card-${table.id}`);

  const selectedCFU = tableValidation ? tableValidation.selectedCFU : 0;
  const isTableValid = tableValidation ? tableValidation.isValid : true;

  let badgeClass = 'badge-warning';
  if (tableValidation) {
    if (isTableValid && selectedCFU >= table.minCFU && selectedCFU <= table.maxCFU) {
      badgeClass = 'badge-success';
    } else if (selectedCFU > table.maxCFU || !isTableValid) {
      badgeClass = 'badge-error';
    }
  }

  container.innerHTML = `
    <div class="table-card-header">
      <div class="table-title-area">
        <h3 class="table-title">${escapeHTML(table.name)}</h3>
        ${table.description ? `<p class="table-desc">${escapeHTML(table.description)}</p>` : ''}
      </div>
      <span class="table-cfu-badge ${badgeClass}" data-testid="table-cfu-badge-${table.id}">
        ${selectedCFU} / ${table.minCFU} CFU
      </span>
    </div>

    <div class="table-error-container" id="table-error-container-${table.id}" data-testid="table-error-container-${table.id}">
      ${renderInlineErrors(tableValidation ? tableValidation.errors : [])}
    </div>

    <div class="exam-list">
      ${table.exams.map(exam => renderExamRow(table.id, exam, selectedCodes.includes(exam.code))).join('')}
    </div>
  `;

  return container;
}

function renderExamRow(tableId, exam, isSelected) {
  return `
    <label class="exam-item ${isSelected ? 'selected' : ''}" for="exam-${tableId}-${exam.code}">
      <div class="exam-left">
        <input 
          type="checkbox" 
          id="exam-${tableId}-${exam.code}" 
          class="exam-checkbox"
          data-table-id="${tableId}"
          data-exam-code="${exam.code}"
          data-testid="exam-checkbox-${exam.code}"
          ${isSelected ? 'checked' : ''}
        />
        <div class="exam-info">
          <div class="exam-title-row">
            <span class="exam-title" data-testid="exam-title-${exam.code}">${escapeHTML(exam.title)}</span>
            ${exam.ssd ? `<span class="exam-ssd">${escapeHTML(exam.ssd)}</span>` : ''}
          </div>
          <div class="exam-meta">
            ${exam.period ? `<span>${escapeHTML(exam.period)}</span>` : ''}
            ${exam.hours ? ` • <span>${exam.hours} ore</span>` : ''}
            ${exam.language ? ` • <span>${escapeHTML(exam.language)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="exam-right">
        <span class="exam-cfu-pill" data-testid="exam-cfu-${exam.code}">${exam.cfu} CFU</span>
      </div>
    </label>
  `;
}

function renderInlineErrors(errors) {
  if (!errors || errors.length === 0) return '';
  return errors.map(err => `
    <div class="error-banner">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>${escapeHTML(err.message)}</span>
    </div>
  `).join('');
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
