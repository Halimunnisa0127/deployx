# Backend Rules

## Purpose

Define the backend development standards for DeployX.

All backend implementations must follow the existing architecture, coding standards, and security practices.

---

# Architecture

Follow this request flow

Route

↓

Controller

↓

Service

↓

Model

↓

Database

Never bypass architectural layers.

---

# Layer Responsibilities

## Routes

Responsible for

- Defining API endpoints
- Applying middleware
- Forwarding requests to controllers

Never

- Contain business logic
- Access the database directly

---

## Controllers

Responsible for

- Handling requests
- Validating input (or invoking validation)
- Calling services
- Returning HTTP responses

Keep controllers thin.

Never

- Contain business logic
- Execute database queries directly

---

## Services

Responsible for

- Business logic
- Data processing
- Coordinating models
- Reusable operations

Never

- Return HTTP responses
- Depend on frontend concerns

---

## Models

Responsible for

- Database schema
- Data persistence
- Query operations

Never

- Contain business logic unrelated to data

---

# Database

Always

- Reuse existing models
- Keep schemas consistent
- Optimize database queries
- Select only required fields

Never

- Duplicate schemas
- Perform unnecessary queries
- Store duplicate data

---

# Authentication & Authorization

Use

- JWT Authentication
- Authorization middleware
- Protected routes where required

Never

- Trust client-provided permissions
- Expose sensitive user data

---

# Security

Always

- Validate all input
- Sanitize user input when appropriate
- Use environment variables for secrets
- Handle errors safely
- Use Helmet
- Configure CORS appropriately

Never

- Hardcode secrets
- Expose stack traces
- Leak internal implementation details

---

# API Standards

Always

- Follow RESTful conventions
- Use correct HTTP methods
- Return appropriate HTTP status codes
- Keep response structures consistent
- Return meaningful error messages

Never

- Break existing API contracts
- Return inconsistent response formats

---

# Error Handling

Always

- Handle expected errors
- Return meaningful error responses
- Log server-side errors appropriately

Never

- Ignore exceptions
- Crash the application due to unhandled errors

---

# Performance

Prefer

- Efficient database queries
- Reusable services
- Pagination for large datasets
- Async/await for asynchronous operations

Avoid

- Duplicate queries
- Blocking operations
- Unnecessary database calls

---

# Rules

Always

- Follow the existing architecture
- Keep controllers thin
- Keep business logic inside services
- Validate every request
- Reuse existing models and services

Never

- Duplicate business logic
- Duplicate schemas
- Access the database directly from controllers
- Hardcode secrets
- Introduce inconsistent patterns