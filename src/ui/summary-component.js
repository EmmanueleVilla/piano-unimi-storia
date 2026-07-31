export function renderSummaryBanner(validationReport) {
  const container = document.getElementById('summary-banner-container');
  if (!container) return;

  const { isValid, totalCFU, requiredCFU } = validationReport;
  const statusClass = isValid ? 'status-valid' : 'status-invalid';
  const statusText = isValid ? 'Piano Conforme' : 'Non Conforme';

  container.innerHTML = `
    <div class="summary-banner ${statusClass}" id="summary-banner" data-testid="summary-banner">
      <div class="summary-metrics">
        <div class="metric-group">
          <span class="metric-label">Crediti Totali Selezionati</span>
          <span class="metric-value" data-testid="summary-total-cfu">${totalCFU} / ${requiredCFU} CFU</span>
        </div>
      </div>
      <div class="summary-status">
        <span class="status-pill ${statusClass}" data-testid="summary-status-badge" data-status="${isValid ? 'valid' : 'invalid'}">
          ${statusText}
        </span>
      </div>
    </div>
  `;
}
