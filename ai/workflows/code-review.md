# Code Review Workflow

## Objective

Review the implementation to ensure it follows the DeployX architecture, coding standards, and quality guidelines before it is considered complete.

Never review code in isolation. Always understand the surrounding architecture first.

---

## Phase 1 — Understand

Understand

- Requirement
- Expected behavior
- Acceptance criteria
- Implementation approach

---

## Phase 2 — Inspect

Inspect the existing project before reviewing.

Verify

- Existing architecture
- Similar implementations
- Existing components
- Existing hooks
- Existing Redux slices
- Existing services
- Existing utilities

Determine whether existing implementations were reused appropriately.

---

## Phase 3 — Review

Review the implementation using

- code-review-checklist
- performance-checklist
- security-checklist
- testing-checklist

Evaluate

- Architecture
- Code quality
- Readability
- Maintainability
- Reusability
- Performance
- Accessibility
- Security

---

## Phase 4 — Identify Issues

Categorize findings

### Critical

Issues that must be fixed before approval.

### Major

Important improvements that affect maintainability or reliability.

### Minor

Style, readability, or consistency improvements.

### Suggestions

Optional improvements.

Never approve

- Duplicate logic
- Duplicate components
- Hardcoded values
- Dead code
- Unused imports
- Broken architecture
- Unnecessary complexity

---

## Phase 5 — Verify

Confirm

- Existing functionality preserved
- No regressions introduced
- Build succeeds
- No lint errors
- No console errors

---

## Phase 6 — Output

Provide

- Review summary
- Strengths
- Issues found
- Suggested improvements
- Approval status