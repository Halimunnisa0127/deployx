# Frontend Rules

## Purpose

Define the frontend development standards for DeployX.

All frontend implementations should follow these standards to maintain consistency, reusability, and long-term maintainability.

---

# Technology

Use

- React
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Vite

Follow the existing project stack unless there is a justified reason to change it.

---

# Components

Always

- Use Functional Components
- Use React Hooks
- Keep components focused on a single responsibility
- Prefer composition over duplication
- Keep components small and reusable

Before creating a new component

Check

- components/
- shared/
- ui/
- layouts/

Reuse existing components whenever possible.

Never

- Duplicate components
- Place business logic inside reusable UI components
- Create unnecessary wrapper components

---

# State Management

Use local state when the data belongs only to a single component.

Use Redux only when state is shared across multiple components or pages.

Never

- Store unnecessary global state
- Duplicate state

---

# Routing

Always

- Use React Router
- Protect private routes
- Keep routing consistent

Never

- Duplicate route definitions
- Hardcode navigation logic across multiple components

---

# Styling

Use

- Tailwind CSS
- Existing design tokens
- Existing utility classes

Avoid

- Inline styles (unless absolutely necessary)
- Hardcoded colors
- Hardcoded spacing
- Inconsistent styling

---

# API Integration

Always

- Keep API logic outside reusable UI components
- Reuse existing services
- Handle loading, success, and error states

Never

- Call APIs directly from shared UI components
- Duplicate API requests

---

# Performance

Prefer

- Small components
- Lazy loading for large pages
- Memoization only when beneficial
- Reusing existing data

Avoid

- Unnecessary re-renders
- Heavy computations during rendering
- Duplicate API calls

---

# Accessibility

Always

- Use semantic HTML
- Associate labels with inputs
- Support keyboard navigation
- Use ARIA attributes only when needed

Never

- Remove focus indicators without an alternative
- Rely only on color to communicate information

---

# Responsive Design

Follow a mobile-first approach.

Verify layouts on

- Mobile
- Tablet
- Desktop

Maintain consistent spacing and typography across all screen sizes.

---

# Rules

Always

- Reuse existing components
- Follow project structure
- Follow naming conventions
- Keep implementations simple
- Maintain consistency

Never

- Duplicate components
- Duplicate business logic
- Break existing UI patterns
- Introduce inconsistent coding styles