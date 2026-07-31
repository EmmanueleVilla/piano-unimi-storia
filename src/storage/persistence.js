const STORAGE_KEY = 'piano_storia_active_plan_v1';

export const persistence = {
  savePlan(state) {
    try {
      const payload = {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        trackId: state.trackId,
        freeChoiceOption: state.freeChoiceOption,
        selectedExams: state.selectedExams
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
      return false;
    }
  },

  loadPlan() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.selectedExams) {
        return {
          trackId: parsed.trackId || 'antica',
          freeChoiceOption: parsed.freeChoiceOption || 'two-6cfu',
          selectedExams: parsed.selectedExams || {}
        };
      }
      return null;
    } catch (e) {
      console.warn('LocalStorage load failed or corrupt:', e);
      return null;
    }
  },

  clearPlan() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.warn('LocalStorage clear failed:', e);
      return false;
    }
  }
};
