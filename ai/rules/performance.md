# Performance Rules

## Purpose

Build fast, efficient, and scalable applications without sacrificing readability or maintainability.

Optimize only when there is a clear benefit.

---

# Rendering

Prefer

- Small components
- Reusable components
- Efficient rendering
- Stable component structure

Avoid

- Unnecessary re-renders
- Large monolithic components
- Expensive computations during rendering

---

# Lazy Loading

Use lazy loading for

- Large pages
- Heavy components
- Route-based code splitting

Avoid lazy loading small, frequently used components.

---

# Memoization

Use memoization only when it provides measurable performance benefits.

Examples

- React.memo
- useMemo
- useCallback

Never add memoization unnecessarily.

---

# Lists

For large datasets

Prefer

- Pagination
- Virtualization

Avoid rendering large collections all at once.

---

# API Requests

Always

- Prevent duplicate requests
- Reuse existing data when appropriate
- Handle loading and error states

Avoid

- Unnecessary API calls
- Fetching the same data repeatedly

---

# User Input

Use

- Debounce for search inputs
- Throttle for high-frequency events such as scrolling or resizing

Avoid triggering expensive operations on every event.

---

# Bundle Optimization

Prefer

- Code splitting
- Dynamic imports
- Lazy loading where appropriate

Avoid

- Importing unnecessary libraries
- Large unused dependencies

---

# Database & Backend

Prefer

- Pagination
- Efficient queries
- Returning only required data

Avoid

- Over-fetching
- Duplicate database queries

---

# Rules

Always

- Optimize only when beneficial
- Prefer simple solutions first
- Measure before introducing complex optimizations
- Follow existing project patterns

Never

- Prematurely optimize
- Add unnecessary memoization
- Duplicate API requests
- Render unnecessary components