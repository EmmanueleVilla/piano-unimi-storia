import { store } from '../state/store.js';
import { validatePlan } from '../domain/validator.js';
import { renderTableComponent } from './table-component.js';
import { renderErrorDrawer, showToastNotification } from './notification.js';
import { renderSummaryBanner } from './summary-component.js';

export function initUI() {
  // Listen for state changes
  store.addEventListener('state:changed', (e) => {
    const { trackId, freeChoiceOption, selectedExams, degreeConfig } = e.detail;
    if (!degreeConfig) return;

    // 1. Run pure validation engine
    const validationReport = validatePlan({ trackId, freeChoiceOption, selectedExams }, degreeConfig);

    // 2. Render UI sub-components
    renderTrackOptions(degreeConfig, trackId);
    renderYear2Tables(degreeConfig, selectedExams, validationReport);
    renderYear3Tables(degreeConfig, trackId, selectedExams, validationReport);
    renderGroupKSection(degreeConfig, freeChoiceOption, validationReport);
    renderSummaryBanner(validationReport);
    renderErrorDrawer(validationReport);
  });

  // Attach event delegation for exam checkboxes
  document.getElementById('study-plan-form')?.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('exam-checkbox')) {
      const tableId = e.target.dataset.tableId;
      const examCode = e.target.dataset.examCode;
      if (tableId && examCode) {
        store.toggleExam(tableId, examCode);
      }
    }
  });

  // Attach Share Button Handler
  const shareBtn = document.getElementById('btn-share-plan');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      try {
        const currentUrl = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(currentUrl);
        } else {
          const input = document.createElement('input');
          input.value = currentUrl;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        }
        showToastNotification('Link del piano copiato negli appunti!');
      } catch (err) {
        console.error('Errore durante la copia del link:', err);
        showToastNotification('Impossibile copiare il link negli appunti.');
      }
    });
  }

  // Attach Reset Modal Handlers
  const resetBtn = document.getElementById('btn-reset-plan');
  const resetModal = document.getElementById('reset-modal');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');

  if (resetBtn && resetModal) {
    resetBtn.addEventListener('click', () => resetModal.showModal());
    cancelBtn?.addEventListener('click', () => resetModal.close());
    confirmBtn?.addEventListener('click', () => {
      store.resetPlan();
      resetModal.close();
    });
  }
}

function renderTrackOptions(degreeConfig, currentTrackId) {
  const container = document.getElementById('track-options-container');
  if (!container || !degreeConfig.year3Tracks) return;

  const tracks = Object.values(degreeConfig.year3Tracks);

  container.innerHTML = tracks.map(track => {
    const isSelected = track.id === `track-${currentTrackId}` || track.id === currentTrackId;
    return `
      <label class="track-option-card ${isSelected ? 'selected' : ''}" for="radio-${track.id}">
        <input 
          type="radio" 
          name="year3-track" 
          id="radio-${track.id}" 
          value="${track.id.replace('track-', '')}"
          ${isSelected ? 'checked' : ''}
        />
        <div>
          <span class="track-title">${escapeHTML(track.name)}</span>
          <span class="track-desc">Tabelle d'insegnamento per ${escapeHTML(track.name)}</span>
        </div>
      </label>
    `;
  }).join('');

  // Attach radio change listener
  container.querySelectorAll('input[name="year3-track"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        store.setTrack(e.target.value);
      }
    });
  });
}

function renderYear2Tables(degreeConfig, selectedExams, validationReport) {
  const container = document.getElementById('year2-tables-container');
  if (!container || !degreeConfig.year2Tables) return;

  container.innerHTML = '';
  degreeConfig.year2Tables.forEach(table => {
    const selectedCodes = selectedExams[table.id] || [];
    const tableValidation = validationReport.tableReports[table.id];
    const component = renderTableComponent(table, selectedCodes, tableValidation);
    container.appendChild(component);
  });
}

function renderYear3Tables(degreeConfig, trackId, selectedExams, validationReport) {
  const container = document.getElementById('year3-tables-container');
  if (!container || !degreeConfig.year3Tracks) return;

  const activeTrackKey = trackId.replace('track-', '');
  const activeTrack = degreeConfig.year3Tracks[activeTrackKey];
  if (!activeTrack) return;

  container.innerHTML = '';
  activeTrack.tables.forEach(table => {
    const selectedCodes = selectedExams[table.id] || [];
    const tableValidation = validationReport.tableReports[table.id];
    const component = renderTableComponent(table, selectedCodes, tableValidation);
    container.appendChild(component);
  });
}

function renderGroupKSection(degreeConfig, currentOption, validationReport) {
  const container = document.getElementById('groupk-tables-container');
  if (!container || !degreeConfig.groupK) return;

  container.innerHTML = `
    <!-- Free Choice Composition Options (12 CFU) -->
    <div class="card free-choice-card">
      <div class="table-card-header">
        <div class="table-title-area">
          <h3 class="table-title">Attività a Scelta Libera (12 CFU)</h3>
          <p class="table-desc">Seleziona la modalità di composizione per i 12 crediti a scelta libera di livello triennale.</p>
        </div>
        <span class="table-cfu-badge badge-success">12 / 12 CFU</span>
      </div>

      <div class="track-options-grid" style="margin-top: 1rem;">
        <label class="track-option-card ${currentOption === 'two-6cfu' ? 'selected' : ''}" for="radio-k-two-6cfu">
          <input 
            type="radio" 
            name="free-choice-option" 
            id="radio-k-two-6cfu" 
            value="two-6cfu"
            ${currentOption === 'two-6cfu' ? 'checked' : ''}
          />
          <div>
            <span class="track-title">2 esami da 6 CFU</span>
            <span class="track-desc">Destina i 12 CFU a due insegnamenti a scelta di livello triennale da 6 CFU ciascuno.</span>
          </div>
        </label>

        <label class="track-option-card ${currentOption === 'one-9cfu-lab3' ? 'selected' : ''}" for="radio-k-one-9cfu-lab3">
          <input 
            type="radio" 
            name="free-choice-option" 
            id="radio-k-one-9cfu-lab3" 
            value="one-9cfu-lab3"
            ${currentOption === 'one-9cfu-lab3' ? 'checked' : ''}
          />
          <div>
            <span class="track-title">1 esame da 9 CFU + laboratorio / modulo da 3 CFU</span>
            <span class="track-desc">Destina i 12 CFU a un insegnamento da 9 CFU e/o uno o più moduli/laboratori da 3 CFU.</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Mandatory Static Activities (9 CFU) -->
    <div class="card mandatory-activities-card" style="margin-top: 1.25rem;">
      <div class="table-card-header">
        <div class="table-title-area">
          <h3 class="table-title">Attività Formative Obbligatorie Fisse (9 CFU)</h3>
          <p class="table-desc">Attività obbligatorie per tutti gli studenti previste dal regolamento didattico (incluse automaticamente nel piano).</p>
        </div>
        <span class="table-cfu-badge badge-success">9 / 9 CFU</span>
      </div>

      <div class="mandatory-static-list" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div class="mandatory-static-item">
          <div class="mandatory-icon">📌</div>
          <div class="mandatory-details">
            <span class="mandatory-title">Laboratorio: Verso l'elaborato finale</span>
            <span class="mandatory-sub">Propedeutico alla stesura della tesi di laurea • 3 CFU</span>
          </div>
        </div>

        <div class="mandatory-static-item">
          <div class="mandatory-icon">📌</div>
          <div class="mandatory-details">
            <span class="mandatory-title">Laboratorio di approfondimento / Stage e tirocinio formativo</span>
            <span class="mandatory-sub">Attività laboratoriale o tirocinio formativo sul campo • 3 CFU</span>
          </div>
        </div>

        <div class="mandatory-static-item">
          <div class="mandatory-icon">📌</div>
          <div class="mandatory-details">
            <span class="mandatory-title">Accertamento delle competenze informatiche (AI Literacy)</span>
            <span class="mandatory-sub">Competenze informatiche di base e alfabetizzazione AI • 3 CFU</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach free choice option radio listener
  container.querySelectorAll('input[name="free-choice-option"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        store.setFreeChoiceOption(e.target.value);
      }
    });
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
