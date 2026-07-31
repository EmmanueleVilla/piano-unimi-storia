import { describe, it, expect } from 'vitest';
import { validatePlan } from '../../src/domain/validator.js';

const mockDegreeConfig = {
  degreeId: 'storia-l42',
  degreeTitle: 'Laurea in Storia',
  totalRequiredCFU: 180,
  year2Tables: [
    {
      id: 'table-a',
      name: 'a) Archivistica',
      minCFU: 9,
      maxCFU: 9,
      isMandatory: true,
      exams: [
        { code: 'HIST-04D-MANO', title: 'Storia del libro manoscritto', cfu: 9, ssd: 'HIST-04/D' },
        { code: 'ARCH-1', title: 'Archivistica', cfu: 9, ssd: 'HIST-04/C' }
      ]
    },
    {
      id: 'table-c',
      name: 'c) Politica',
      minCFU: 9,
      maxCFU: 9,
      isMandatory: true,
      exams: [
        { code: 'STEC-1', title: 'Storia dell Economia', cfu: 9, ssd: 'STEC-01/B' },
        { code: 'GSPS-1', title: 'Storia Istituzioni', cfu: 9, ssd: 'GSPS-03/B' }
      ]
    }
  ],
  year3Tracks: {
    antica: {
      id: 'track-antica',
      name: 'Percorso Antico',
      tables: [
        {
          id: 'table-g2',
          name: 'g2) Integrativo Antico',
          minCFU: 6,
          maxCFU: 6,
          isMandatory: true,
          exams: [
            { code: 'HIST-04D-MANO', title: 'Storia del libro manoscritto', cfu: 6, ssd: 'HIST-04/D' }
          ]
        },
        {
          id: 'table-g4',
          name: 'g4) Complementare',
          minCFU: 9,
          maxCFU: 9,
          isMandatory: true,
          exams: [
            { code: 'STEC-GLOB', title: 'Globalizzazione', cfu: 9, ssd: 'STEC-01/B' },
            { code: 'GSPS-DOTTR', title: 'Dottrine Politiche', cfu: 9, ssd: 'GSPS-03/A' }
          ]
        }
      ]
    }
  }
};

describe('validatePlan Engine', () => {
  it('flags deficit when mandatory table has 0 selections', () => {
    const state = { trackId: 'antica', selectedExams: {} };
    const report = validatePlan(state, mockDegreeConfig);
    expect(report.isValid).toBe(false);
    expect(report.tableReports['table-a'].isValid).toBe(false);
  });

  it('validates a correct selection and correctly attributes 9 CFU to table-a for Storia del libro manoscritto', () => {
    const state = {
      trackId: 'antica',
      selectedExams: {
        'table-a': ['HIST-04D-MANO'],
        'table-c': ['STEC-1'],
        'table-g4': ['GSPS-DOTTR']
      }
    };
    const report = validatePlan(state, mockDegreeConfig);
    expect(report.tableReports['table-a'].selectedCFU).toBe(9);
    expect(report.tableReports['table-a'].isValid).toBe(true);
  });

  it('detects duplicate exam selections across tables', () => {
    const state = {
      trackId: 'antica',
      selectedExams: {
        'table-a': ['ARCH-1'],
        'table-c': ['ARCH-1']
      }
    };
    const report = validatePlan(state, mockDegreeConfig);
    expect(report.isValid).toBe(false);
    expect(report.globalErrors.some(e => e.type === 'DUPLICATE_EXAM')).toBe(true);
  });

  it('enforces cross-year SSD complement rule (STEC in Year 2 requires GSPS in Year 3)', () => {
    const state = {
      trackId: 'antica',
      selectedExams: {
        'table-a': ['ARCH-1'],
        'table-c': ['STEC-1'],
        'table-g4': ['STEC-GLOB'] // Mismatch! Should be GSPS
      }
    };
    const report = validatePlan(state, mockDegreeConfig);
    expect(report.isValid).toBe(false);
    expect(report.globalErrors.some(e => e.id === 'RULE_CROSS_YEAR_SSD_MISMATCH')).toBe(true);
  });
});
