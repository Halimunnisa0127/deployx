# DeployX Architecture

## Purpose

Define the architectural principles that every implementation in DeployX must follow.

All new features should align with the existing architecture unless there is a justified reason to evolve it.

---

# Technology Stack

## Frontend

- React
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Vite

## Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

# Project Structure

```
frontend/
backend/
ai/
```

Keep frontend and backend responsibilities separate.

---

# Architecture Principles

Always

- Keep features isolated
- Reuse existing components
- Reuse existing services
- Reuse existing Redux slices
- Keep business logic outside UI components
- Keep components focused on a single responsibility
- Follow existing folder structure

Never

- Duplicate business logic
- Duplicate API calls
- Create unnecessary abstractions
- Create random folders
- Introduce tight coupling

---

# Layer Responsibilities

## UI

Responsible for

- Rendering
- User interaction
- Dispatching actions

Never

- Contain business logic
- Call APIs directly from reusable UI components

---

## Redux

Responsible for

- Shared application state
- Async state management
- Coordinating API requests

Never

- Store unnecessary derived state
- Contain UI rendering logic

---

## Services

Responsible for

- API communication
- Data transformation
- Shared business operations

Never

- Render UI
- Manage component state

---

## Backend Controller

Responsible for

- Request validation
- Calling services
- Returning responses

Never

- Contain database logic

---

## Backend Service

Responsible for

- Business logic
- Data processing
- Coordinating repositories/models

Never

- Return HTTP responses directly

---

## Database

Responsible for

- Data persistence
- Queries
- Relationships

---

# Data Flow

Frontend

```
UI
↓
Redux (if shared state is required)
↓
Service
↓
API
```

Backend

```
Route
↓
Controller
↓
Service
↓
Database
```

---

# Dependency Rules

Always

- Depend on lower layers only
- Keep responsibilities separated
- Prefer composition over duplication

Never

- Skip layers
- Access the database directly from controllers
- Call APIs directly from reusable UI components
- Mix frontend and backend responsibilities

---

# Scalability Guidelines

Prefer

- Small reusable components
- Feature-based organization
- Shared utilities
- Consistent naming

Avoid

- Large monolithic components
- Circular dependencies
- Deeply nested folders
- Unnecessary global state

---

# Rules

Always

- Follow the existing architecture
- Extend existing patterns before creating new ones
- Keep implementations simple and maintainable

Never

- Break architectural boundaries
- Duplicate functionality
- Introduce inconsistent patterns