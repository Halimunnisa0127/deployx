# DeployX Project Rules

## Purpose

Define the core development principles for DeployX.

These rules apply to every feature, bug fix, refactor, and enhancement.

---

## Objectives

Always

- Build production-ready code
- Prefer readability over clever implementations
- Keep code modular and maintainable
- Preserve existing functionality
- Follow the project's architecture

Never

- Generate demo-quality code
- Introduce unnecessary complexity
- Break existing features

---

## General Rules

Always

- Reuse existing components
- Reuse existing hooks
- Reuse existing utilities
- Reuse existing services
- Reuse existing Redux slices
- Follow the existing folder structure
- Keep functions focused and small
- Remove unused imports
- Write maintainable code

Never

- Duplicate components
- Duplicate business logic
- Hardcode API URLs
- Hardcode colors
- Hardcode mock data
- Create unnecessary files

---

## Before Implementing

Always inspect the project first.

Check whether an existing implementation already exists for:

- Components
- Pages
- Hooks
- Utilities
- Services
- Redux slices
- API endpoints

If an implementation already exists:

- Extend it when appropriate
- Reuse it whenever possible

Create new files only when no suitable implementation exists.

---

## Architecture

Always

- Respect feature boundaries
- Follow existing project patterns
- Keep UI, business logic, and data access separated

Never

- Mix unrelated responsibilities
- Bypass the project's architecture

---

## Verification

Before considering work complete, verify:

- Build succeeds
- Existing functionality still works
- No unnecessary files were added
- No unused code remains

---

## Rules

Always

- Inspect before implementing
- Reuse before creating
- Keep changes focused
- Follow project conventions

Never

- Duplicate functionality
- Break architecture
- Modify unrelated files
- Leave temporary or debug code