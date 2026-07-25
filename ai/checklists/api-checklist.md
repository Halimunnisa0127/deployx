# API Design & Integration Checklist

Purpose

Verify that every API follows DeployX standards before considering the implementation complete.

---

## API Design

- Resource names follow REST conventions.
- Correct HTTP methods are used.
- Existing API patterns are reused.
- No duplicate endpoints are created.
- API URLs are not hardcoded.

---

## Request Validation

- Route parameters validated.
- Query parameters validated.
- Request body validated.
- Invalid input returns meaningful errors.
- Required fields enforced.

---

## Response Format

Success Response

{
  success,
  message,
  data
}

Error Response

{
  success,
  message,
  error
}

Verification

- Response format is consistent.
- Correct HTTP status codes returned.
- Sensitive information is never exposed.

---

## Business Logic

- Controllers remain thin.
- Business logic exists only in services.
- Database logic remains inside models/services.
- Existing services reused before creating new ones.

---

## Security

- Authentication verified.
- Authorization verified.
- Environment variables used.
- Input sanitized.
- CORS configuration respected.

---

## Performance

- Pagination implemented where appropriate.
- Filtering implemented where appropriate.
- Sorting implemented where appropriate.
- Database queries optimized.
- Duplicate queries avoided.

---

## Error Handling

- Validation errors handled.
- Database errors handled.
- Unexpected errors handled.
- User-friendly error messages returned.

---

## Final Verification

- Endpoint tested.
- Existing functionality verified.
- Build succeeds.
- No unnecessary files modified.