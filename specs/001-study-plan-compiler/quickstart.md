# Quickstart & Runnable Validation Guide: Study Plan Compiler

## 1. Overview
This guide provides step-by-step instructions to set up, run, and empirically verify the **University Study Plan Compiler** static web application.

---

## 2. Project Setup & Execution

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Setup Commands
```bash
# Clone/navigate to project directory
cd /Users/emmanuele.villa/piano-storia

# Install dependencies (Vite)
npm install

# Start Vite development server
npm run dev
```

### Production Build Command
```bash
# Build lightweight static assets to dist/
npm run build

# Preview static production build locally
npm run preview
```

---

## 3. Empirical Verification Scenarios

### Scenario 1: Initial Load & Rendering
1. Launch application in browser via `npm run dev` (e.g. `http://localhost:5173`).
2. **Expected Outcome**:
   - Degree title ("Laurea in Informatica") displays at top.
   - Curriculum tables render with correct min/max CFU limits.
   - Initial total CFU displays `0 / 180 CFU` (or initial mandatory selections).

### Scenario 2: Dynamic Validation & Real-Time Calculation
1. Check exam `INF-01-MATH` (9 CFU) in Core Mathematics table.
2. **Expected Outcome**:
   - Table CFU badge updates immediately to `9 / 18 CFU`.
   - Plan Total CFU updates to `9 / 180 CFU`.
   - Table indicates deficit warning (missing 9 CFU to hit minimum 18 CFU).

### Scenario 3: Duplicate Exam Error Detection
1. Select exam `CS101` in Table A.
2. Select the same exam `CS101` in Table B (if allowed by UI selection or configured across options).
3. **Expected Outcome**:
   - Validation engine flags `DUPLICATE_EXAM` error.
   - Error alert appears at top summary banner and inline at both Table A and Table B.
   - Overall plan status badge updates to `INVALID PLAN`.

### Scenario 4: LocalStorage Persistence & Restoration
1. Select 3 exams across different tables.
2. Refresh the browser page (`Cmd+R` / `F5`).
3. **Expected Outcome**:
   - Application reloads with all 3 exams remaining checked.
   - Calculated CFU and validation status match pre-refresh state.

### Scenario 5: Plan Reset Action
1. Click "Reset Plan" button in header.
2. Confirm reset modal prompt.
3. **Expected Outcome**:
   - All checkboxes uncheck.
   - LocalStorage key is cleared.
   - Summary badge returns to initial state.
