import { rules } from './rules.js';

export function validatePlan(state, degreeConfig) {
  if (!degreeConfig || !degreeConfig.year2Tables) {
    return {
      isValid: false,
      totalCFU: 0,
      requiredCFU: 180,
      tableReports: {},
      globalErrors: [{ id: 'CONFIG_MISSING', message: 'Configurazione piano didattico mancante', severity: 'ERROR' }]
    };
  }

  const { trackId = 'antica', freeChoiceOption = 'two-6cfu', selectedExams = {} } = state;
  const activeTrack = degreeConfig.year3Tracks?.[trackId];
  const year3Tables = activeTrack ? activeTrack.tables : [];

  // Active tables = Year 2 tables + Active Year 3 Track tables
  const activeTables = [...degreeConfig.year2Tables, ...year3Tables];

  // Global helper map of all exam objects by code
  const allExamsMap = {};
  activeTables.forEach(table => {
    table.exams.forEach(exam => {
      if (!allExamsMap[exam.code]) {
        allExamsMap[exam.code] = exam;
      }
    });
  });

  let overallTotalCFU = 0;
  const tableReports = {};
  const globalErrors = [];

  // 1. Validate individual tables
  activeTables.forEach(table => {
    const selectedCodes = selectedExams[table.id] || [];

    // Table-specific map so 9 CFU vs 6 CFU definitions in different tables don't overwrite each other
    const tableExamsMap = {};
    table.exams.forEach(exam => {
      tableExamsMap[exam.code] = exam;
    });

    const selectedExamObjs = selectedCodes.map(c => tableExamsMap[c] || allExamsMap[c]).filter(Boolean);
    const tableCFU = selectedExamObjs.reduce((sum, e) => sum + (e.cfu || 0), 0);
    overallTotalCFU += tableCFU;

    const tableErrors = [];

    // Min CFU check
    if (table.isMandatory && tableCFU < table.minCFU) {
      tableErrors.push({
        id: `CFU_DEFICIT_${table.id}`,
        type: 'CFU_DEFICIT',
        severity: 'ERROR',
        tableId: table.id,
        message: `Tavola "${table.name}": selezionati ${tableCFU} CFU su un minimo richiesto di ${table.minCFU} CFU.`
      });
    }

    // Max CFU check
    if (tableCFU > table.maxCFU) {
      tableErrors.push({
        id: `CFU_EXCESS_${table.id}`,
        type: 'CFU_EXCESS',
        severity: 'ERROR',
        tableId: table.id,
        message: `Tavola "${table.name}": selezionati ${tableCFU} CFU, superando il massimo consentito di ${table.maxCFU} CFU.`
      });
    }

    // Min/Max Exam count checks if configured
    if (table.minExams && selectedCodes.length < table.minExams) {
      tableErrors.push({
        id: `EXAM_DEFICIT_${table.id}`,
        type: 'EXAM_COUNT',
        severity: 'ERROR',
        tableId: table.id,
        message: `Tavola "${table.name}": selezionati ${selectedCodes.length} insegnamenti su un minimo di ${table.minExams}.`
      });
    }

    tableReports[table.id] = {
      tableId: table.id,
      tableName: table.name,
      selectedCFU: tableCFU,
      minCFU: table.minCFU,
      maxCFU: table.maxCFU,
      isValid: tableErrors.length === 0,
      errors: tableErrors
    };
  });

  // 2. Group K Validation (Fixed 21 CFU: 12 CFU Free Choice option + 9 CFU Mandatory Activities)
  if (degreeConfig.groupK) {
    const kTableId = degreeConfig.groupK.id;
    const kCFU = 21; // 12 CFU Scelta libera + 9 CFU Obbligatori fissi
    overallTotalCFU += kCFU;

    const kErrors = [];
    if (!freeChoiceOption) {
      kErrors.push({
        id: `FREE_CHOICE_OPTION_MISSING`,
        type: 'RULE_VIOLATION',
        severity: 'ERROR',
        tableId: kTableId,
        message: 'Seleziona una modalità per i 12 CFU a scelta libera.'
      });
    }

    tableReports[kTableId] = {
      tableId: kTableId,
      tableName: degreeConfig.groupK.name,
      selectedCFU: kCFU,
      minCFU: 21,
      maxCFU: 21,
      isValid: kErrors.length === 0,
      errors: kErrors
    };
  }

  // 3. Global Rule Checks (Duplicates & Cross-Year SSD Complement)
  const duplicateErrors = rules.checkCrossTableUnicity(selectedExams, allExamsMap);
  globalErrors.push(...duplicateErrors);

  const ssdComplementError = rules.checkCrossYearSSDComplement(selectedExams, allExamsMap);
  if (ssdComplementError) {
    globalErrors.push(ssdComplementError);
    if (tableReports[ssdComplementError.tableId]) {
      tableReports[ssdComplementError.tableId].errors.push(ssdComplementError);
      tableReports[ssdComplementError.tableId].isValid = false;
    }
  }

  // 4. Calculate Overall Validity
  const hasTableErrors = Object.values(tableReports).some(tr => !tr.isValid);
  const isValid = !hasTableErrors && globalErrors.length === 0;

  return {
    isValid,
    totalCFU: overallTotalCFU,
    requiredCFU: degreeConfig.totalRequiredCFU || 180,
    tableReports,
    globalErrors
  };
}
