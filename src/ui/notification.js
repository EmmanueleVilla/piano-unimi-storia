export function renderErrorDrawer(validationReport) {
  const container = document.getElementById('validation-error-list');
  const statusBadge = document.getElementById('drawer-status-badge');
  if (!container) return;

  if (validationReport.isValid) {
    statusBadge.textContent = 'Valido';
    statusBadge.className = 'status-pill status-valid';
    container.innerHTML = `
      <div class="empty-state">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p>Nessun errore di compilazione. Il piano di studi rispetta tutti i vincoli della didattica.</p>
      </div>
    `;
    return;
  }

  statusBadge.textContent = 'Non Valido';
  statusBadge.className = 'status-pill status-invalid';

  // Aggregate all errors across tables and global rules
  const allErrors = [];

  if (validationReport.globalErrors) {
    allErrors.push(...validationReport.globalErrors);
  }

  Object.values(validationReport.tableReports || {}).forEach(tr => {
    if (tr.errors && tr.errors.length > 0) {
      tr.errors.forEach(err => {
        // avoid duplicating global errors
        if (!allErrors.some(e => e.id === err.id)) {
          allErrors.push(err);
        }
      });
    }
  });

  container.innerHTML = allErrors.map(err => `
    <a href="${err.tableId ? `#table-card-${err.tableId}` : '#'}" class="error-item" data-testid="error-item-${err.id}">
      <span class="error-item-title">${getSeverityTitle(err.type)}</span>
      <span>${escapeHTML(err.message)}</span>
    </a>
  `).join('');
}

function getSeverityTitle(type) {
  switch (type) {
    case 'DUPLICATE_EXAM': return 'Errore: Insegnamento Duplicato';
    case 'CFU_DEFICIT': return 'Avviso: Crediti (CFU) Insufficienti';
    case 'CFU_EXCESS': return 'Errore: Crediti (CFU) In Eccesso';
    case 'RULE_VIOLATION': return 'Errore: Regola Didattica Violata';
    default: return 'Incongruenza Rilevata';
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
