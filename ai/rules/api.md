# API Rules

## Purpose

Design and implement consistent, predictable, and maintainable APIs throughout DeployX.

Follow existing project conventions before introducing new patterns.

---

## REST API Design

Always

- Use RESTful resource naming
- Use plural resource names
- Keep endpoint naming consistent
- Use nouns instead of verbs in URLs

Examples

- `/projects`
- `/deployments`
- `/environments`

Avoid

- `/getProjects`
- `/createDeployment`
- `/deleteUser`

---

## HTTP Methods

Use the appropriate HTTP method

- GET — Retrieve data
- POST — Create resources
- PUT — Replace resources
- PATCH — Partially update resources
- DELETE — Remove resources

---

## HTTP Status Codes

Return appropriate status codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Unprocessable Entity (when applicable)
- 500 Internal Server Error

Never return success responses for failed requests.

---

## Response Structure

Always

- Return consistent JSON responses
- Return predictable property names
- Include useful error messages

Avoid changing response structures between similar endpoints.

---

## Pagination

When returning collections

Support

- Pagination
- Page size limits

Avoid returning unnecessarily large datasets.

---

## Filtering & Sorting

Support filtering and sorting where appropriate.

Keep query parameters consistent across endpoints.

Example

- `?page=1`
- `?limit=20`
- `?sort=name`
- `?order=asc`

---

## Validation

Always validate

- Request body
- Query parameters
- Route parameters

Never trust client input.

Return clear validation errors.

---

## Error Handling

Always

- Return meaningful error messages
- Handle unexpected failures gracefully
- Log server-side errors appropriately

Never expose

- Stack traces
- Internal implementation details
- Sensitive information

---

## Security

Always

- Validate input
- Sanitize user data
- Verify authorization where required
- Protect sensitive endpoints

Never

- Trust client-provided permissions
- Expose secrets or internal identifiers unnecessarily

---

## Performance

Prefer

- Efficient database queries
- Selecting only required fields
- Pagination for large datasets

Avoid

- Duplicate queries
- Unnecessary database calls
- Large response payloads

---

## Rules

Always

- Follow existing API conventions
- Keep responses consistent
- Use appropriate status codes
- Validate all input
- Handle errors gracefully

Never

- Break existing API contracts
- Duplicate endpoint behavior
- Return inconsistent responses
- Leak sensitive information