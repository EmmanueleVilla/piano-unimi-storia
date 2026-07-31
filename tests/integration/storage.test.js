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

describe('LocalStorage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and restores study plan state accurately', () => {
    const stateToSave = {
      trackId: 'medievale',
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
