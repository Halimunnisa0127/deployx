# Security Rules

## Purpose

Build secure applications by protecting user data, validating input, and following secure development practices.

Security should be considered throughout development, not added afterward.

---

# Authentication

Use

- JWT Authentication
- Secure token verification
- Protected routes
- Authentication middleware

Never

- Trust client authentication without verification
- Store sensitive information in JWT payloads
- Expose authentication tokens unnecessarily

---

# Authorization

Always

- Verify user permissions
- Protect sensitive endpoints
- Apply authorization middleware where required

Never

- Trust client-provided roles or permissions
- Skip authorization checks

---

# Input Validation

Always

- Validate request body
- Validate query parameters
- Validate route parameters
- Reject invalid input

Never

- Trust client input
- Process unvalidated data

---

# Data Sanitization

Always

- Sanitize user input where appropriate
- Escape unsafe content when required
- Prevent injection attacks

Never

- Store unsanitized user input without proper handling

---

# Password Security

Always

- Hash passwords before storing them
- Verify passwords using secure hashing libraries
- Enforce secure password handling

Never

- Store plain-text passwords
- Log passwords
- Return passwords in API responses

---

# Secrets

Store secrets only in environment variables.

Examples

- JWT_SECRET
- MONGO_URI
- API keys

Never

- Hardcode secrets
- Commit secrets to version control
- Expose secrets to the frontend

---

# HTTP Security

Use

- Helmet
- CORS
- Rate limiting

Configure security middleware according to project requirements.

Never

- Disable security middleware without justification
- Allow unrestricted cross-origin access unless required

---

# API Security

Always

- Validate every request
- Return appropriate HTTP status codes
- Return generic error messages for unexpected failures

Never

- Expose stack traces
- Leak internal implementation details
- Reveal database errors directly to clients

---

# File Uploads

Always

- Validate file type
- Validate file size
- Reject unsupported files

Never

- Trust client-provided file metadata
- Accept unrestricted uploads

---

# Logging

Always

- Log server-side errors appropriately
- Avoid logging sensitive information

Never log

- Passwords
- JWT tokens
- API keys
- Secrets
- Sensitive personal information

---

# Dependencies

Always

- Keep dependencies updated
- Remove unused packages
- Review new dependencies before adding them

Never

- Add unnecessary dependencies
- Ignore known security vulnerabilities

---

# Rules

Always

- Validate all input
- Verify authentication and authorization
- Protect sensitive data
- Use environment variables for secrets
- Follow secure coding practices

Never

- Hardcode secrets
- Trust client input
- Expose sensitive information
- Store passwords in plain text
- Introduce unnecessary security risks