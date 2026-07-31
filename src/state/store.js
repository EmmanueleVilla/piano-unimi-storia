import { persistence } from '../storage/persistence.js';

class StudyPlanStore extends EventTarget {
  constructor() {
    super();
    this.state = {
      degreeConfig: null,
      trackId: 'antica', // default track
      freeChoiceOption: 'two-6cfu', // 'two-6cfu' | 'one-9cfu-lab3'
      selectedExams: {} // { tableId: ['code1', 'code2'] }
    };
  }

  init(degreeConfig) {
    this.state.degreeConfig = degreeConfig;

    // Restore from LocalStorage if available
    const saved = persistence.loadPlan();
    if (saved) {
      this.state.trackId = saved.trackId || 'antica';
      this.state.freeChoiceOption = saved.freeChoiceOption || 'two-6cfu';
      this.state.selectedExams = saved.selectedExams || {};
    } else {
      this.state.trackId = 'antica';
      this.state.freeChoiceOption = 'two-6cfu';
      this.state.selectedExams = {};
    }

    this.notifyStateChanged();
  }

  setTrack(trackId) {
    if (this.state.trackId === trackId) return;
    this.state.trackId = trackId;
    this.saveAndNotify();
  }

  setFreeChoiceOption(optionKey) {
    if (this.state.freeChoiceOption === optionKey) return;
    this.state.freeChoiceOption = optionKey;
    this.saveAndNotify();
  }

  toggleExam(tableId, examCode) {
    const currentTableSelections = this.state.selectedExams[tableId] || [];
    const index = currentTableSelections.indexOf(examCode);

    if (index >= 0) {
      // Remove selection
      this.state.selectedExams[tableId] = currentTableSelections.filter(c => c !== examCode);
    } else {
      // Add selection
      this.state.selectedExams[tableId] = [...currentTableSelections, examCode];
    }

    this.saveAndNotify();
  }

  resetPlan() {
    this.state.trackId = 'antica';
    this.state.freeChoiceOption = 'two-6cfu';
    this.state.selectedExams = {};
    persistence.clearPlan();
    this.notifyStateChanged();
  }

  saveAndNotify() {
    persistence.savePlan(this.state);
    this.notifyStateChanged();
  }

  notifyStateChanged() {
    this.dispatchEvent(new CustomEvent('state:changed', {
      detail: {
        trackId: this.state.trackId,
        freeChoiceOption: this.state.freeChoiceOption,
        selectedExams: { ...this.state.selectedExams },
        degreeConfig: this.state.degreeConfig
      }
    }));
  }

  getState() {
    return {
      trackId: this.state.trackId,
      freeChoiceOption: this.state.freeChoiceOption,
      selectedExams: { ...this.state.selectedExams },
      degreeConfig: this.state.degreeConfig
    };
  }
}

export const store = new StudyPlanStore();
