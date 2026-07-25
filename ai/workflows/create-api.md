# Create API Workflow

## Objective

Create or extend REST APIs while following the existing DeployX backend architecture.

Always extend existing implementations before creating new ones.

---

## Phase 1 — Understand

Understand

- Business requirement
- Expected behavior
- Request flow
- Response format

---

## Phase 2 — Inspect

Inspect existing project.

Search for

- Routes
- Controllers
- Services
- Models
- Validation
- Middleware
- Response format

Reuse existing implementations whenever possible.

Never duplicate endpoints.

---

## Phase 3 — Plan

Prepare

- Routes to modify
- Controllers to modify
- Services to modify
- Models to update (if required)
- Validation changes
- Authentication requirements
- Potential risks

---

## Phase 4 — Implement

Follow

Route

↓

Controller

↓

Service

↓

Model

Keep controllers thin.

Business logic belongs inside services.

Use the project's existing validation and error-handling patterns.

Never

- Duplicate business logic
- Hardcode values
- Modify unrelated APIs

---

## Phase 5 — Review

Run

- api-checklist
- backend-checklist
- security-checklist
- performance-checklist
- testing-checklist

---

## Phase 6 — Verify

Confirm

- API works correctly
- Validation works
- Authentication works (when applicable)
- Error handling is consistent
- Existing APIs are unaffected
- Build succeeds

---

## Phase 7 — Output

Provide

- API summary
- Files modified
- Endpoints created or updated
- Validation changes
- Verification results