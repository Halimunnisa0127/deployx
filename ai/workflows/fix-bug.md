# Fix Bug Workflow

## Objective

Identify, fix, and verify bugs while preserving existing functionality and project architecture.

Never guess the cause of a bug.

Always identify the root cause before implementing a fix.

---

## Phase 1 — Understand

Understand

- Reported issue
- Expected behavior
- Actual behavior
- Steps to reproduce

---

## Phase 2 — Inspect

Inspect the existing project.

Search for

- Related components
- Related hooks
- Redux slices
- Services
- APIs
- Utilities

Reuse existing implementations whenever possible.

---

## Phase 3 — Analyze

Identify

- Root cause
- Affected files
- Possible side effects
- Existing reusable logic

Never fix symptoms without understanding the underlying cause.

---

## Phase 4 — Implement

Apply the smallest correct fix.

Never

- Modify unrelated files
- Introduce new features
- Duplicate logic
- Break existing APIs
- Change business logic unnecessarily

Update or add automated tests where appropriate.

---

## Phase 5 — Review

Run

- bugfix-checklist
- testing-checklist
- code-review-checklist

---

## Phase 6 — Verify

Confirm

- Original issue resolved
- Existing functionality preserved
- No regressions
- Build succeeds
- No console errors

---

## Phase 7 — Output

Provide

- Root cause
- Summary of the fix
- Files modified
- Verification results
- Remaining risks (if any)