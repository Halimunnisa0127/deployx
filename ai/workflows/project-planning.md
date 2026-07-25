# Project Planning Workflow

## Objective

Prepare a complete implementation strategy before development begins.

Never generate code during the planning phase.

The goal is to understand the requirement, inspect the existing project, identify reusable implementations, and create a clear execution plan.

---

## Phase 1 — Understand

Understand

- Business requirement
- User goals
- Expected behavior
- Acceptance criteria
- Constraints

Clearly identify

- Goals
- Non-goals

---

## Phase 2 — Inspect

Inspect the existing project.

Search for

- Existing features
- Existing components
- Existing pages
- Existing hooks
- Existing Redux slices
- Existing services
- Existing APIs
- Existing database models
- Existing utilities

Determine whether the feature can extend existing functionality.

Never duplicate existing implementations.

---

## Phase 3 — Analyze

Identify

- Business flow
- User flow
- Data flow
- API requirements
- Database changes (if required)
- UI changes
- State management requirements

Determine

- Files to modify
- Files to create
- Dependencies
- Risks

---

## Phase 4 — Plan

Prepare

- Implementation strategy
- Development order
- Backend tasks (if applicable)
- Frontend tasks
- Redux changes (if applicable)
- Testing approach
- Deployment considerations

Prioritize reusable solutions over new implementations.

---

## Phase 5 — Review

Review the plan against

- project-rules
- architecture
- feature-checklist

Verify

- Existing architecture preserved
- No duplicated functionality
- Scope is clearly defined

---

## Phase 6 — Output

Provide

- Feature summary
- Implementation plan
- Development phases
- Files likely to change
- Reusable components
- Potential risks
- Estimated complexity