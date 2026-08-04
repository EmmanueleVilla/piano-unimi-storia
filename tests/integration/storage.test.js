import { describe, it, expect, beforeEach } from 'vitest';
import { persistence } from '../../src/storage/persistence.js';

// Simple in-memory mock for LocalStorage in test environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('LocalStorage & URL Hash Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    delete global.window?.location;
  });

  it('encodes and decodes plan state to base64 hash accurately', () => {
    const originalState = {
      trackId: 'moderna',
      freeChoiceOption: 'one-9cfu-lab3',
      selectedExams: {
        'table-a': ['HIST-04C-ARCH'],
        'table-c': ['STEC-1']
      }
    };

    const hashStr = persistence.encodeStateToHash(originalState);
    expect(hashStr).toBeTruthy();

    const decoded = persistence.decodeStateFromHash(`#plan=${hashStr}`);
    expect(decoded).not.toBeNull();
    expect(decoded.trackId).toBe('moderna');
    expect(decoded.freeChoiceOption).toBe('one-9cfu-lab3');
    expect(decoded.selectedExams['table-a']).toEqual(['HIST-04C-ARCH']);
  });

  it('saves and restores study plan state accurately from localStorage when no hash is present', () => {
    const stateToSave = {
      trackId: 'medievale',
      freeChoiceOption: 'two-6cfu',
      selectedExams: {
        'table-a': ['HIST-04C-ARCH'],
        'table-h1': ['HIST-01A-ITAMED']
      }
    };

    const savedSuccess = persistence.savePlan(stateToSave);
    expect(savedSuccess).toBe(true);

    const loadedState = persistence.loadPlan();
    expect(loadedState).not.toBeNull();
    expect(loadedState.trackId).toBe('medievale');
    expect(loadedState.selectedExams['table-a']).toContain('HIST-04C-ARCH');
  });

  it('prioritizes loading state from URL hash over LocalStorage', () => {
    // LocalStorage state
    persistence.savePlan({
      trackId: 'antica',
      selectedExams: { 'table-a': ['OLD-EXAM'] }
    });

    // Mock window with hash
    const hashState = {
      trackId: 'contemporanea',
      freeChoiceOption: 'two-6cfu',
      selectedExams: { 'table-a': ['NEW-HASH-EXAM'] }
    };
    const hashStr = persistence.encodeStateToHash(hashState);

    global.window = {
      location: { hash: `#plan=${hashStr}`, pathname: '/', search: '' },
      history: { replaceState: () => {} }
    };

    const loadedState = persistence.loadPlan();
    expect(loadedState).not.toBeNull();
    expect(loadedState.trackId).toBe('contemporanea');
    expect(loadedState.selectedExams['table-a']).toEqual(['NEW-HASH-EXAM']);
  });

  it('clears saved state on reset', () => {
    const stateToSave = {
      trackId: 'moderna',
      selectedExams: { 'table-a': ['HIST-04C-ARCH'] }
    };

    persistence.savePlan(stateToSave);
    persistence.clearPlan();

    const loadedState = persistence.loadPlan();
    expect(loadedState).toBeNull();
  });
});
