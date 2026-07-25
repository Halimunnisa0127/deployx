# Redux Rules

## Purpose

Define the Redux Toolkit standards for DeployX.

Use Redux only for shared application state and keep state predictable, maintainable, and easy to understand.

---

# General Principles

Use

- Redux Toolkit
- Feature-based slices
- Predictable state updates

Never

- Use Redux for component-only state
- Duplicate application state
- Store derived state unnecessarily

---

# State Management

Use local state when

- State belongs to a single component
- State is temporary UI state
- State does not need to be shared

Use Redux when

- State is shared across multiple components
- State is shared across multiple pages
- Authentication state
- User information
- Shared application data

Avoid unnecessary global state.

---

# Slices

Always

- Organize slices by feature
- Keep one slice per feature
- Keep slice responsibilities focused
- Reuse existing slices when possible

Never

- Duplicate slices
- Mix unrelated features into one slice

Examples

- authSlice.js
- projectSlice.js
- deploymentSlice.js

---

# Reducers

Always

- Keep reducers pure
- Update state predictably
- Keep reducers focused

Never

- Perform API calls inside reducers
- Add side effects to reducers

---

# Selectors

Always

- Access Redux state through selectors
- Reuse existing selectors
- Keep selectors focused

Never

- Access state directly throughout the application
- Duplicate selector logic

---

# Async Operations

Use

- createAsyncThunk

Handle

- Loading
- Success
- Error

states consistently.

Never

- Ignore rejected requests
- Leave loading state unresolved

---

# API Integration

Follow

Component

↓

Redux

↓

Service

↓

API

Never

- Call APIs directly from reusable UI components
- Duplicate API requests
- Bypass the existing service layer

---

# Performance

Prefer

- Small focused slices
- Reusing existing state
- Efficient selectors

Avoid

- Unnecessary global state
- Duplicate state
- Unnecessary dispatches

---

# Naming

Use descriptive feature-based names.

Examples

- authSlice.js
- projectSlice.js
- deploymentSlice.js

Selectors

- selectAuth
- selectProjects
- selectDeployments

---

# Rules

Always

- Keep Redux predictable
- Keep state minimal
- Reuse existing slices
- Follow feature-based organization

Never

- Duplicate state
- Store component-only state globally
- Add business logic to reducers
- Break existing Redux architecture