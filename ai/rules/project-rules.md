# Project Rules

## Purpose

Define the core development principles for DeployX.

These rules apply to every feature, bug fix, refactor, and enhancement.

---

# Understand Before Implementing

Always

- Understand the complete requirement
- Inspect the existing project
- Identify reusable implementations
- Plan before making changes

Never

- Start coding without understanding the requirement
- Assume missing requirements

---

# Reuse Before Create

Always

- Reuse existing components
- Reuse existing hooks
- Reuse existing services
- Reuse existing Redux slices
- Reuse existing utilities

Create new files only when no suitable implementation exists.

Never duplicate existing functionality.

---

# Keep Changes Focused

Always

- Modify only the files related to the task
- Keep implementations simple
- Prefer small, incremental changes

Never

- Modify unrelated files
- Introduce unnecessary complexity
- Rewrite working code without a clear reason

---

# Architecture

Always

- Follow the existing project architecture
- Respect layer responsibilities
- Keep business logic separated from UI
- Keep feature boundaries clear

Never

- Break architectural boundaries
- Introduce tight coupling
- Duplicate business logic

---

# Code Quality

Always

- Write clean, readable code
- Follow naming conventions
- Remove unused code
- Keep implementations maintainable

Never

- Leave dead code
- Leave unused imports
- Hardcode values that should be configurable

---

# State Management

Always

- Use local state for component-specific data
- Use Redux only for shared application state

Never

- Duplicate state
- Store unnecessary global state

---

# API Integration

Always

- Reuse existing services
- Handle loading, success, and error states
- Validate responses

Never

- Call APIs directly from reusable UI components
- Duplicate API requests

---

# Security

Always

- Validate user input
- Protect sensitive data
- Use environment variables for secrets

Never

- Hardcode secrets
- Expose sensitive information

---

# Performance

Always

- Prefer reusable solutions
- Optimize only when beneficial
- Avoid unnecessary renders

Never

- Prematurely optimize
- Duplicate expensive operations

---

# Accessibility

Always

- Use semantic HTML
- Support keyboard navigation
- Follow accessibility standards

Never

- Ignore accessibility requirements

---

# Testing

Always

- Verify new functionality
- Verify existing functionality
- Check edge cases

Never

- Assume code works without verification

---

# Documentation

Always

- Explain significant architectural decisions
- Keep documentation consistent when changes affect it

---

# Rules

Always

- Follow existing project conventions
- Keep the project consistent
- Prefer maintainability over shortcuts
- Reuse before creating new code

Never

- Duplicate functionality
- Break existing behavior
- Introduce inconsistent patterns
- Sacrifice maintainability for speed