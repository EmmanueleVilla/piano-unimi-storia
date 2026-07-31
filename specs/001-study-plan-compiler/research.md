# Technical Research: University Study Plan Compiler

## Overview
This document outlines key technical decisions, patterns, and architectural strategies for building the **University Study Plan Compiler** using Vite and Vanilla JavaScript.

---

## Technical Decisions

### 1. Build Tool & Module System
- **Decision**: Use Vite with native ES Modules (vanilla JavaScript).
- **Rationale**: Vite provides instant HMR during development and outputs a lightweight, optimized static bundle for production without requiring any runtime framework dependencies (React, Vue, etc.).
- **Alternatives Considered**:
  - *Webpack/Parcel*: More complex configuration overhead for a pure vanilla JS application.
  - *No build tool (raw static files)*: Lacks ESM bundling optimization, cache-busting, and CSS asset pipeline provided out-of-the-box by Vite.

### 2. Application Architecture & Separation of Concerns
- **Decision**: Use an event-driven Model-View-Presenter (MVP) / Store-Validator-Renderer pattern.
  - `config/`: JSON files for curriculum tables, exams, and validation rules.
  - `domain/`: Pure validation logic (functional, stateless data validators).
  - `state/`: Centralized reactive state store managing user choices.
  - `storage/`: Storage abstraction (LocalStorage wrapper with error handling).
  - `ui/`: DOM rendering components and event binding modules.
- **Rationale**: Decoupling validation and state management from DOM rendering ensures maximum testability, maintainability, and clean separation of concerns.
- **Alternatives Considered**:
  - *Monolithic DOM-coupled script*: Easy for small prototypes, but quickly becomes fragile and hard to test or extend.

### 3. Data Validation Engine
- **Decision**: Implement a functional, pure validation module `validatePlan(planState, curriculumConfig)` that outputs a structured `ValidationReport` object.
- **Validation Checks**:
  1. *Duplicate Exam Detection*: Map course codes across selected tables to detect multi-table duplicate selections.
  2. *Credit (CFU) Bounds*: Compare table total CFU and plan total CFU against `minCFU` and `maxCFU` limits defined in config.
  3. *Required Selections*: Ensure mandatory exams defined in config are selected.
  4. *Rule Constraints*: Evaluate mutual exclusion lists (e.g., `["CS101", "CS102"]` cannot both be chosen) and prerequisite requirements.
- **Rationale**: Pure functions are easy to unit-test, execute in `<5ms`, and have zero side effects on the DOM or persistent storage.

### 4. Persistence Layer (LocalStorage)
- **Decision**: Use `window.localStorage` with a fallback to in-memory state if storage is restricted or disabled.
- **Data Payload**:
  ```json
  {
    "version": "1.0",
    "lastUpdated": "2026-07-31T16:50:00Z",
    "selectedExams": {
      "table-core": ["MATH101", "PHYS101"],
      "table-electives-a": ["CS201"]
    }
  }
  ```
- **Rationale**: Storing only the mapping of table IDs to selected exam codes minimizes storage size (<2KB), preserves user privacy (zero external network requests), and simplifies schema migrations.

### 5. Styling & User Experience
- **Decision**: Vanilla CSS with modern features (CSS Grid, Flexbox, CSS Custom Properties for design tokens, system font stack).
- **Aesthetic Goals**: Premium visual styling featuring clear color coding for validation states (green = compliant, red = error, yellow = warning), responsive layout down to mobile viewports (`320px`), accessible visual feedback (WCAG 2.1 AA compliant contrast), and subtle micro-animations.
