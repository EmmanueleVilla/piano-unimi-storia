const STORAGE_KEY = 'piano_storia_active_plan_v1';

export function encodeStateToHash(state) {
  if (!state) return '';
  const payload = {
    t: state.trackId || 'antica',
    f: state.freeChoiceOption || 'two-6cfu',
    e: state.selectedExams || {}
  };
  try {
    const json = JSON.stringify(payload);
    const base64 = btoa(encodeURIComponent(json));
    return base64;
  } catch (err) {
    console.warn('Errore nella codifica base64 dello stato:', err);
    return '';
  }
}

export function decodeStateFromHash(hashString) {
  if (!hashString) return null;
  let clean = hashString.replace(/^#/, '');
  if (clean.startsWith('plan=')) {
    clean = clean.slice(5);
  }
  if (!clean) return null;

  try {
    const json = decodeURIComponent(atob(clean));
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      trackId: parsed.t || parsed.trackId || 'antica',
      freeChoiceOption: parsed.f || parsed.freeChoiceOption || 'two-6cfu',
      selectedExams: parsed.e || parsed.selectedExams || {}
    };
  } catch (err) {
    console.warn('Impossibile decodificare lo stato dall\'URL hash:', err);
    return null;
  }
}

export const persistence = {
  encodeStateToHash,
  decodeStateFromHash,

  savePlan(state) {
    try {
      const payload = {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        trackId: state.trackId,
        freeChoiceOption: state.freeChoiceOption,
        selectedExams: state.selectedExams
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }

      // Update URL Hash without scroll jump or page reload
      const hashStr = encodeStateToHash(state);
      if (hashStr && typeof window !== 'undefined' && window.location && window.history) {
        const pathname = window.location.pathname || '';
        const search = window.location.search || '';
        const newUrl = `${pathname}${search}#plan=${hashStr}`;
        window.history.replaceState(null, '', newUrl);
      }

      return true;
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
      return false;
    }
  },

  loadPlan() {
    try {
      // 1. Priority: URL Hash
      if (typeof window !== 'undefined' && window.location && window.location.hash) {
        const fromHash = decodeStateFromHash(window.location.hash);
        if (fromHash) {
          return fromHash;
        }
      }

      // 2. Fallback: LocalStorage
      if (typeof localStorage !== 'undefined') {
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
      }

      return null;
    } catch (e) {
      console.warn('LocalStorage load failed or corrupt:', e);
      return null;
    }
  },

  clearPlan() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      if (typeof window !== 'undefined' && window.location && window.history) {
        const pathname = window.location.pathname || '';
        const search = window.location.search || '';
        const cleanUrl = `${pathname}${search}`;
        window.history.replaceState(null, '', cleanUrl);
      }
      return true;
    } catch (e) {
      console.warn('LocalStorage clear failed:', e);
      return false;
    }
  }
};

