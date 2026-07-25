# Refactor Code Workflow

## Objective

Improve code quality, readability, maintainability, and reusability without changing application behavior.

Never introduce new features while refactoring.

---

## Phase 1 — Understand

Understand

- Current implementation
- Business purpose
- Existing architecture
- Refactoring objective

Define clear goals

- Reduce duplication
- Simplify logic
- Improve readability
- Improve maintainability
- Improve reusability

---

## Phase 2 — Inspect

Inspect

- Components
- Hooks
- Redux slices
- Services
- Utilities

Identify

- Duplicate logic
- Large components
- Complex functions
- Repeated patterns
- Unused code

Reuse existing implementations whenever possible.

---

## Phase 3 — Plan

Prepare

- Files to modify
- Reusable logic to extract
- Risks
- Expected improvements
- Potential side effects

Preserve existing API contracts whenever possible.

---

## Phase 4 — Refactor

Perform small, incremental improvements.

Improve

- Readability
- Maintainability
- Reusability
- Code organization

Never

- Change business logic
- Break public APIs
- Modify unrelated files
- Introduce new features
- Duplicate existing logic

---

## Phase 5 — Review

Review using

- code-review-checklist
- performance-checklist
- testing-checklist

Verify

- Project architecture preserved
- Existing patterns followed
- Code duplication reduced

---

## Phase 6 — Verify

Confirm

- Existing functionality preserved
- No regressions
- Build succeeds
- No lint errors
- No console errors

Update or add automated tests where appropriate.

---

## Phase 7 — Output

Provide

- Summary
- Files modified
- Improvements made
- Verification results
- Remaining risks (if any)