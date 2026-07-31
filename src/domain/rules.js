export const rules = {
  /**
   * Check cross-year SSD complement rule between Year 2 table-c and Year 3 complement table (g4/h4/i5/j4).
   * If Year 2 table-c selection contains STEC-01/B, Year 3 selection MUST contain GSPS-03 (and vice versa).
   */
  checkCrossYearSSDComplement(selectedExams, allExamsMap) {
    const year2Selections = selectedExams['table-c'] || [];
    if (year2Selections.length === 0) return null; // No Year 2 choice yet

    // Determine Year 2 choice SSD
    const year2SelectedExams = year2Selections.map(code => allExamsMap[code]).filter(Boolean);
    const hasSTECInYear2 = year2SelectedExams.some(e => e.ssd === 'STEC-01/B');
    const hasGSPSInYear2 = year2SelectedExams.some(e => e.ssd && e.ssd.startsWith('GSPS-03'));

    // Find Year 3 complement table selection
    const year3TableId = Object.keys(selectedExams).find(tId => tId.startsWith('table-g4') || tId.startsWith('table-h4') || tId.startsWith('table-i5') || tId.startsWith('table-j4'));
    if (!year3TableId) return null;

    const year3Selections = selectedExams[year3TableId] || [];
    if (year3Selections.length === 0) return null;

    const year3SelectedExams = year3Selections.map(code => allExamsMap[code]).filter(Boolean);
    const hasSTECInYear3 = year3SelectedExams.some(e => e.ssd === 'STEC-01/B');
    const hasGSPSInYear3 = year3SelectedExams.some(e => e.ssd && e.ssd.startsWith('GSPS-03'));

    if (hasSTECInYear2 && !hasGSPSInYear3) {
      return {
        id: 'RULE_CROSS_YEAR_SSD_MISMATCH',
        type: 'RULE_VIOLATION',
        severity: 'ERROR',
        tableId: year3TableId,
        message: "Avendo scelto un insegnamento STEC-01/B al 2° anno (tavola c), al 3° anno devi selezionare un insegnamento GSPS-03/A o GSPS-03/B."
      };
    }

    if (hasGSPSInYear2 && !hasSTECInYear3) {
      return {
        id: 'RULE_CROSS_YEAR_SSD_MISMATCH',
        type: 'RULE_VIOLATION',
        severity: 'ERROR',
        tableId: year3TableId,
        message: "Avendo scelto un insegnamento GSPS-03 al 2° anno (tavola c), al 3° anno devi selezionare l'insegnamento STEC-01/B."
      };
    }

    return null;
  },

  /**
   * Check cross-table unicity rule ("purché non scelti in altri gruppi").
   * Returns list of duplicate selection errors if an exam code is selected in >1 table.
   */
  checkCrossTableUnicity(selectedExams, allExamsMap) {
    const errors = [];
    const codeToTables = {};

    Object.entries(selectedExams).forEach(([tableId, examCodes]) => {
      examCodes.forEach(code => {
        if (!codeToTables[code]) {
          codeToTables[code] = [];
        }
        codeToTables[code].push(tableId);
      });
    });

    Object.entries(codeToTables).forEach(([code, tableIds]) => {
      if (tableIds.length > 1) {
        const examObj = allExamsMap[code];
        const examName = examObj ? examObj.title : code;
        errors.push({
          id: `DUPLICATE_${code}`,
          type: 'DUPLICATE_EXAM',
          severity: 'ERROR',
          examCode: code,
          tableIds,
          message: `L'insegnamento "${examName}" è stato selezionato in più tabelle distinti (${tableIds.join(', ')}). È obbligatorio sceglierlo una sola volta.`
        });
      }
    });

    return errors;
  }
};
