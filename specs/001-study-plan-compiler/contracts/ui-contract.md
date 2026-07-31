# UI Component & Event Contract: University Study Plan Compiler

## 1. UI Event Contract

The application uses custom DOM events for internal communication between components, state store, and validation engine.

| Event Name | Dispatcher | Payload (`event.detail`) | Description |
| :--- | :--- | :--- | :--- |
| `studyplan:exam-toggled` | Exam Card / Table Component | `{ tableId: string, examCode: string, isSelected: boolean }` | Dispatched when user checks or unchecks an exam |
| `studyplan:state-changed` | State Store | `{ state: StudyPlanState, validationReport: ValidationReport }` | Dispatched when state updates and validation is recomputed |
| `studyplan:reset-requested` | Header / Actions Component | `{}` | Dispatched when user triggers reset action |
| `studyplan:reset-confirmed` | Header / Actions Component | `{}` | Dispatched after user confirms plan reset |

---

## 2. DOM Structure & Test Selectors

The UI components expose explicit `data-testid` and `id` attributes for testing and accessibility verification.

### Header & Summary Banner (`#summary-banner`)
- `data-testid="header-degree-title"`: Degree program title.
- `data-testid="summary-total-cfu"`: Display element showing selected vs required total CFU (e.g., `120 / 180 CFU`).
- `data-testid="summary-status-badge"`: Status indicator (`data-status="valid"` or `data-status="invalid"`).
- `data-testid="btn-reset-plan"`: Button to reset study plan.

### Curriculum Table Section (`.curriculum-table`)
- `data-testid="table-card-[tableId]"`: Container for a curriculum table.
- `data-testid="table-cfu-badge-[tableId]"`: Current table selected CFU vs range (e.g. `12 / 18 CFU`).
- `data-testid="table-error-container-[tableId]"`: Inline container displaying error/warning banners for this table.

### Exam Row / Checkbox (`.exam-item`)
- `data-testid="exam-checkbox-[examCode]"`: Standard HTML `<input type="checkbox">` element for exam selection.
- `data-testid="exam-title-[examCode]"`: Course title display.
- `data-testid="exam-cfu-[examCode]"`: Exam credit count badge.

### Validation Drawer / Error List (`#validation-drawer`)
- `data-testid="error-list"`: Unordered list containing active validation error items.
- `data-testid="error-item-[errorId]"`: Individual error item with jump link to affected table.
