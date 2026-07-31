# Implementation Plan: University Study Plan Compiler

**Branch**: `001-study-plan-compiler` | **Date**: 2026-07-31 | **Spec**: [spec.md](file:///Users/emmanuele.villa/piano-storia/specs/001-study-plan-compiler/spec.md)

**Input**: Feature specification from `/specs/001-study-plan-compiler/spec.md`

## Summary

The **University Study Plan Compiler** is a lightweight, fully client-side web application built with Vite and Vanilla HTML, CSS, and JavaScript. It enables university students to interactively select exams from predefined curriculum tables, dynamically validates their selections against credit (CFU) limits and combination rules, highlights errors in real time, and persists progress locally via `window.localStorage`.

The system strictly decouples JSON curriculum configuration, stateless validation logic, reactive state management, DOM rendering, and persistence.

---

## Technical Context

**Language/Version**: ES2022+ JavaScript (Vanilla JS with ES Modules)

**Primary Dependencies**: Vite (development & build tool only), zero runtime UI framework dependencies

**Storage**: Browser `window.localStorage` (with graceful fallback to in-memory state)

**Testing**: Vitest (or Node native test runner) for unit testing pure validation functions

**Target Platform**: Evergreen mobile and desktop web browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: Single-page client-side web application (Static site output)

**Performance Goals**: Validation execution < 5ms, dynamic UI render update < 50ms, initial gzipped bundle < 50KB

**Constraints**: Fully offline capable, 100% client-side execution, no external backend or API dependencies, strict data privacy (no personal data transmitted)

**Scale/Scope**: Support 4–10 curriculum tables, 50–200 total available exams per degree program

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance Status | Justification / Implementation Strategy |
| :--- | :--- | :--- |
| **I. Code Quality & Architectural Integrity** | ✅ PASS | Strict separation of concerns into `config/`, `domain/`, `state/`, `storage/`, and `ui/`. Pure functional validation engine with explicit error handling. |
| **II. Testing Standards & Verification Discipline** | ✅ PASS | Validation engine is pure and state-decoupled, enabling fast unit testing. Runnable verification scenarios documented in `quickstart.md`. |
| **III. UX Consistency & Aesthetic Excellence** | ✅ PASS | Modern CSS design tokens, responsive CSS Grid/Flexbox layout, clear visual color coding for validation feedback, accessible (WCAG AA). |
| **IV. Performance Requirements & System Efficiency** | ✅ PASS | Zero framework runtime footprint. Real-time validation completes in <5ms. LocalStorage sync is lightweight (<2KB payload). |

*Gate Status*: **PASS** (No constitution violations).

---

## Project Structure

### Documentation (this feature)

```text
specs/001-study-plan-compiler/
├── plan.md              # Implementation plan
├── research.md          # Technical research & decisions
├── data-model.md        # Entities, schemas & state transitions
├── quickstart.md        # Runnable validation scenarios
├── contracts/           # Interfaces & Config schema
│   ├── config-schema.json
│   └── ui-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
public/
└── data/
    └── degree-rules.json     # Configurable degree rules & exam tables

src/
├── main.js                   # Application entry point
├── styles/
│   ├── main.css              # Main stylesheet & CSS tokens
│   ├── components.css        # Table, card, badge, and summary styles
│   └── responsive.css        # Mobile viewport breakpoints
├── domain/
│   ├── validator.js          # Pure validation logic (CFU, duplicates, rules)
│   └── rules.js              # Specific rule checkers (mutual exclusion, prerequisites)
├── state/
│   └── store.js              # Centralized reactive state store
├── storage/
│   └── persistence.js        # LocalStorage wrapper & schema validator
└── ui/
    ├── renderer.js           # Main UI renderer
    ├── table-component.js    # Curriculum table component renderer
    ├── summary-component.js  # Header & summary status banner renderer
    └── notification.js       # Validation error drawer renderer

tests/
├── unit/
│   └── validator.test.js     # Unit tests for domain validation engine
└── integration/
    └── storage.test.js       # Tests for storage persistence & fallback
```

**Structure Decision**: Single-project static web application using standard Vite directory structure with modular ES source files organized by architectural layer.

---

## Complexity Tracking

> **No Constitution Check violations identified. Standard lightweight web architecture.**

| Feature Requirement | Technical Choice | Complexity Justification |
| :--- | :--- | :--- |
| Client-side persistence | `window.localStorage` | Simple key-value browser storage; avoids database complexity or network API dependencies. |
| UI Rendering | Vanilla DOM Manipulation | Avoids framework bundle overhead (React/Vue), keeping static output under 50KB. |
| Rule Engine | Functional JavaScript Validators | Pure JavaScript functions provide instant execution without heavy rule-engine libraries. |
