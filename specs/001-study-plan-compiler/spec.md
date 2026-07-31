# Feature Specification: University Study Plan Compiler

**Feature Branch**: `001-study-plan-compiler`

**Created**: 2026-07-31

**Status**: Draft

**Input**: User description: "Build an application that allows university students to compile their study plan through a simple web interface while respecting predefined university curriculum tables."

## Clarifications

### Session 2026-07-31
- Q: What are the concrete Year 2 curriculum tables and exam choices? → A: The default curriculum configuration will include the 5 Year 2 tables (a: 9 CFU Archival/Library Science, b: 9 CFU Ancient History, c: 9 CFU Political & Economic History, d: 9 CFU Philosophy & History of Christianity, e: 6 CFU Economics & Anthropology) with their exact course options, SSDs, and semester metadata.
- Q: How does Year 3 (Terzo Anno) curriculum selection work? → A: Students MUST select 1 of 4 specialization tracks ("percorsi": Storia Antica, Storia Medievale, Storia Moderna, Storia Contemporanea). Selecting a track dynamically alters and loads the specific curriculum tables and exam options for Year 3.
- Q: What are the tables and rules for "Percorso sull'Età Antica" (Track 1)? → A: Includes tables g1 (18 CFU = 2x9 CFU in STAN-01/A, STAN-01/B), g2 (6 CFU in Epigraphy, Philosophy, Latin Lit, Numismatics, etc.), g3 (9 CFU in Ancient Philosophy PHIL-05/B), and g4 (9 CFU in Economic/Political History with a cross-year SSD complement constraint relative to Year 2 group c choice). All g groups strictly enforce cross-group exclusion ("purché non scelti in altri gruppi").
- Q: What are the tables and rules for "Percorso sull'Età Medievale" (Track 2)? → A: Includes tables h1 (18 CFU = 2x9 CFU in Medieval History HIST-01/A), h2 (6 CFU in Legal History, Paleography, Medieval Art, Gender Studies, Visual Science), h3 (9 CFU in Philosophy & History of Christianity), and h4 (9 CFU in Economic/Political History with the Year 2 group c SSD complement constraint). Enforces cross-group exclusion.
- Q: What are the tables and rules for "Percorso sull'Età Moderna" (Track 3)? → A: Includes tables i1 (9 CFU Renaissance History HIST-02/A), i2 (9 CFU Enlightenment & Revolutions HIST-02/A), i3 (6 CFU in Legal, Risorgimento, Art, Publishing, Gender, Political Institutions, Visual Science), i4 (9 CFU Philosophy & Church History), and i5 (9 CFU in Economic/Political History with Year 2 group c SSD complement constraint). Enforces cross-group exclusion.
- Q: What are the tables and rules for "Percorso sull'Età Contemporanea" (Track 4)? → A: Includes tables j1 (18 CFU = 2x9 CFU in Journalism, Risorgimento, Radio/TV HIST-03/A), j2 (6 CFU in Archival, Globalization, European History, Cinema, Melodrama, etc.), j3 (9 CFU Philosophy & Church History), and j4 (9 CFU in Economic/Political History with Year 2 group c SSD complement constraint). Enforces cross-group exclusion.
- Q: What are the requirements for Group k (Altre Attività Formative Obbligatorie)? → A: Group k requires 12 CFU of Free Choice electives (scelta libera: 2x6 CFU, 1x9 CFU + 3 CFU module, or 3 CFU additions up to course limits) plus 9 CFU of mandatory activities (3 CFU Laboratorio verso l'elaborato finale, 3 CFU Laboratorio/Tirocinio, 3 CFU AI Literacy).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Exam Selection & Real-Time Validation (Priority: P1) 🎯 MVP

As a university student, I want to select exams from structured curriculum tables and receive instant feedback on validation rules so that I can draft a compliant study plan without manual calculations or spreadsheet errors.

**Why this priority**: Core functionality of the application. Allows students to view curriculum tables, select exams, and get real-time validationfeedback.

**Independent Test**: Can be tested by opening the web application, selecting/deselecting exams in various tables, and verifying that total credits (CFU) and validation warnings update instantly.

**Acceptance Scenarios**:

1. **Given** a student viewing the curriculum tables, **When** they select an exam option in a table, **Then** the total selected CFU updates dynamically and validation rules for that table and overall plan are evaluated immediately.
2. **Given** a student selects the same exam in two different curriculum tables, **When** the duplicate selection occurs, **Then** both affected tables and a summary banner highlight the duplicate exam error clearly.
3. **Given** a student has selected fewer CFU than required or exceeded the maximum allowed CFU in a table/plan, **When** validation executes, **Then** an explicit error message specifies the exact deficit or excess credit count.
4. **Given** a student selects a combination of exams restricted by curriculum rules (e.g., mutually exclusive courses), **When** the invalid combination is detected, **Then** an error message details the rule violation and highlights the conflicting exams.
5. **Given** a student configuring their Year 3 study plan, **When** they choose a track ("Percorso"), **Then** the corresponding Year 3 tables and exam options update dynamically.
6. **Given** a student selecting Year 3 group g4/h4/i5/j4, **When** they selected STEC-01/B in Year 2 group c, **Then** the system requires a GSPS-03 selection in Year 3 (and vice versa for GSPS-03 in Year 2).

---

### User Story 2 - Automatic Plan Persistence & Restoration (Priority: P2)

As a university student, I want my active study plan selections to automatically save as I make changes so that I can close my browser and return later without losing my progress.

**Why this priority**: Prevents data loss during plan compilation and provides seamless user experience across sessions.

**Independent Test**: Select several exams, refresh or re-open the browser tab, and verify that all previous selections, total CFU, and validation states are fully restored.

**Acceptance Scenarios**:

1. **Given** a student with active exam selections, **When** any choice is modified, **Then** the state is saved instantly to browser LocalStorage.
2. **Given** a returning student who previously compiled a partial or complete study plan, **When** they re-open the application, **Then** all previously selected exams are automatically reloaded and validated.
3. **Given** a student who wants to start over, **When** they click "Reset Plan", **Then** all stored selections are cleared after confirmation and the UI resets to an empty initial state.

---

### User Story 3 - Curriculum Summary & Export Readiness (Priority: P3)

As a university student, I want to view a concise summary of my compiled study plan and compliance status so that I can verify my choices before formal submission.

**Why this priority**: Helps students double-check their complete study plan, total credits per category, and overall validity at a glance.

**Independent Test**: Compile a valid plan and check that the summary panel displays a complete breakdown of credits per table and indicates 100% rule compliance.

**Acceptance Scenarios**:

1. **Given** a valid study plan with zero errors, **When** viewing the summary panel, **Then** a green "Plan Valid & Ready" indicator is shown along with total CFU breakdown.
2. **Given** a study plan with active validation errors, **When** viewing the summary panel, **Then** submission status is marked as invalid and a clickable list of blocking errors is displayed.

---

### Edge Cases

- What happens when browser storage is disabled or blocked by user privacy settings? The application MUST gracefully fall back to in-memory state and notify the user that auto-save is unavailable.
- How does the application handle corrupt or incompatible local storage data from previous versions? The application MUST validate stored JSON schemas, discard invalid state gracefully, and notify the user with an option to reset.
- What happens if curriculum rules JSON contains zero available exams for a mandatory category? The system MUST display an administrative rule load error instead of breaking validation logic.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST load university curriculum tables, exam options, credit values (CFU), and rule constraints from a configurable JSON data structure.
- **FR-002**: System MUST render a responsive form-based UI displaying curriculum tables grouped by category (e.g., Mandatory Core, Restricted Electives, Free Electives, including Year 2 choice tables a–e).
- **FR-003**: System MUST calculate and display total selected CFU per table and for the entire study plan in real-time.
- **FR-004**: System MUST validate the study plan on every user interaction (selection, deselection, or reset).
- **FR-005**: System MUST detect and visually flag duplicate exam selections across different curriculum tables.
- **FR-006**: System MUST enforce minimum and maximum CFU constraints per table and for the total study plan, highlighting credit deficits or excesses.
- **FR-007**: System MUST validate prerequisite or mutually exclusive course combinations as defined in the curriculum rules data.
- **FR-008**: System MUST display validation feedback inline near the affected table/exam and in an aggregate summary banner.
- **FR-009**: System MUST persist the active study plan state locally in browser storage (LocalStorage) on every modification.
- **FR-010**: System MUST automatically restore the saved study plan on application launch.
- **FR-011**: System MUST provide a "Reset Study Plan" action with user confirmation to clear stored data.
- **FR-012**: System MUST operate entirely client-side without requiring a backend server or network API requests.
- **FR-013**: System MUST support Year 3 track selection ("percorsi": Storia Antica, Storia Medievale, Storia Moderna, Storia Contemporanea) that dynamically alters the rendered tables and available exam options for the third year.
- **FR-014**: System MUST validate cross-year SSD dependency constraints (e.g. Year 2 group c vs Year 3 group g4/h4/i5/j4 complement rule: STEC-01/B requires GSPS-03 and vice versa).
- **FR-015**: System MUST enforce cross-table unicity rules ("purché non scelti in altri gruppi") preventing any exam from being selected if already chosen in another group/year.
- **FR-016**: System MUST support Group k (Altre Attività Formative Obbligatorie) including flexible 12 CFU Free Choice selection (2x6 CFU, 9+3 CFU, or 3 CFU modules) and 9 CFU mandatory activities (Laboratorio Tesi 3 CFU, Laboratorio/Tirocinio 3 CFU, AI Literacy 3 CFU).

### Key Entities

- **Curriculum Rule**: Defines a category/table, required minimum/maximum CFU, mandatory course IDs, and invalid combination rules.
- **Exam Option**: Represents an individual course with code, title, CFU (credits), scientific sector (SSD), language, semester, and optional prerequisites or mutual exclusions.
- **Study Plan Track ("Percorso")**: Represents a Year 3 specialization (Storia Antica, Storia Medievale, Storia Moderna, Storia Contemporanea) mapping to specific Year 3 tables.
- **Study Plan**: The user's active selections mapping track choice and table IDs to chosen exam code lists, along with calculated total CFU and current validation status.
- **Validation Result**: Contains overall validity status (`isValid`), total CFU breakdown, and a list of specific error items (table ID, rule type, error message).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students receive dynamic validation updates within 50 milliseconds of selecting or deselecting an exam.
- **SC-002**: 100% of study plan rule violations (duplicates, credit mismatches, invalid combinations) are detected and visually flagged before plan completion.
- **SC-003**: 100% of valid exam selections persist across browser refreshes and tab restarts via local storage.
- **SC-004**: The application interface is 100% responsive and usable on screen widths ranging from 320px (mobile) to 2560px (4K desktop).

## Assumptions

- Predefined university curriculum rules and exam catalogs can be fully represented in structured JSON files loaded client-side.
- Students use modern browsers that support LocalStorage and standard ES6 JavaScript features.
- A standard study plan totals approximately 180 CFU for Bachelor's (Laurea Triennale) or 120 CFU for Master's (Laurea Magistrale), organized into 4 to 8 curriculum tables.
