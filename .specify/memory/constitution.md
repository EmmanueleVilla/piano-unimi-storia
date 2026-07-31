<!--
# Sync Impact Report
- Version change: initial template -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Code Quality & Architectural Integrity
  - [PRINCIPLE_2_NAME] -> II. Testing Standards & Verification Discipline
  - [PRINCIPLE_3_NAME] -> III. User Experience Consistency & Aesthetic Excellence
  - [PRINCIPLE_4_NAME] -> IV. Performance Requirements & System Efficiency
- Added sections:
  - Technical & Performance Constraints
  - Quality Gates & Development Workflow
  - Governance
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ aligned with constitution check gates)
  - .specify/templates/spec-template.md (✅ aligned with user scenarios, FR, and success criteria)
  - .specify/templates/tasks-template.md (✅ aligned with test-driven and quality task phases)
- Follow-up TODOs: None
-->

# Piano Storia Constitution

## Core Principles

### I. Code Quality & Architectural Integrity
Code MUST maintain high readability, strict modularity, and explicit domain abstractions. 
- All code MUST strictly adhere to static type checking and zero-warning linting standards.
- Functions and components MUST have single, well-defined responsibilities with explicit, minimal public APIs.
- Errors MUST be handled explicitly; swallowing exceptions, returning silent fallbacks, or masking failures is strictly prohibited.
- Dead code, commented-out logic, and unverified workarounds MUST NOT be committed to the repository.

*Rationale*: Clean, modular code prevents technical debt accumulation, reduces bug density, and ensures long-term codebase maintainability.

### II. Testing Standards & Verification Discipline
Testing and empirical verification are non-negotiable prerequisites for code completion.
- Automated tests (unit, integration, or contract) MUST be implemented for all core domain logic and critical paths.
- Test suites MUST verify both happy paths and edge cases / error conditions.
- Tests MUST NOT be modified or disabled to bypass build failures; root causes MUST be identified and fixed.
- Empirical runtime verification MUST be performed and documented before declaring any feature or bug fix complete.

*Rationale*: Robust test suites and empirical verification guarantee system correctness, prevent regressions, and provide immediate feedback during refactoring.

### III. User Experience Consistency & Aesthetic Excellence
User interfaces MUST deliver cohesive, visual excellence, intuitive interaction patterns, and responsive design across all viewports.
- UI elements MUST strictly utilize defined design tokens for typography, spacing, color palettes, and component hierarchy.
- Standardized UI micro-interactions, smooth state transitions, and accessible visual feedback MUST be consistently applied.
- Placeholders, generic unstyled elements, and broken layout alignment MUST NOT be deployed.
- Accessibility standards (WCAG 2.1 AA compliant contrast, aria attributes, and keyboard navigation) MUST be enforced across all interactive elements.

*Rationale*: Consistent, polished, and accessible UI design builds user trust, reduces cognitive load, and elevates the overall quality of the product experience.

### IV. Performance Requirements & System Efficiency
Systems and interfaces MUST be optimized for low latency, efficient resource utilization, and snappy responsiveness.
- Interactive UI responses MUST execute within 100ms; network endpoints MUST maintain a p95 response time under 200ms under standard loads.
- Bundle sizes, asset footprints, and third-party dependencies MUST be minimized and actively monitored.
- Memory usage MUST be deterministic; event listeners, timers, and heavy object allocations MUST be explicitly cleaned up to prevent leaks.
- Database queries and asynchronous operations MUST avoid N+1 problems and blocking calls on UI dispatch threads.

*Rationale*: Performance is a primary user experience feature; fast and lightweight software maximizes usability, scales effectively, and minimizes operational costs.

## Technical & Performance Constraints

- Architecture MUST maintain clear separation between UI layer, domain services, and data management.
- External dependencies MUST be evaluated for maintenance, security vulnerabilities, and bundle footprint prior to adoption.
- State management MUST remain predictable and localized where possible, avoiding global mutable side-effects.

## Quality Gates & Development Workflow

- **Pre-Commit / Pre-PR Gate**: Static linting, type validation, and automated unit tests MUST pass cleanly.
- **Review Gate**: Code reviews MUST explicitly verify adherence to all four Core Principles.
- **Verification Gate**: Concrete, empirical verification output MUST be captured prior to merging.

## Governance

- The Constitution supersedes all conflicting informal practices or temporary conventions.
- Amendments to this Constitution require formal documentation of rationale, consensus approval, and a propagation check across template files.
- Versioning Policy:
  - **MAJOR** version bumps for breaking policy shifts or principle removal/redefinition.
  - **MINOR** version bumps for new principles or expanded governance guidelines.
  - **PATCH** version bumps for clarifications, typo fixes, or non-semantic edits.
- Compliance review MUST be conducted during plan, spec, and task execution checkpoints.

**Version**: 1.0.0 | **Ratified**: 2026-07-31 | **Last Amended**: 2026-07-31
