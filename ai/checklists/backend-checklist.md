# Backend Development Checklist

Purpose

Verify every backend implementation before completion.

---

## Architecture

- Existing folder structure followed.
- Routes remain lightweight.
- Controllers remain lightweight.
- Services contain business logic.
- Models contain only schema definitions.

---

## Code Quality

- Existing utilities reused.
- Duplicate logic avoided.
- Clear function names.
- Small focused functions.
- Async/await used consistently.

---

## Validation

- Request validation implemented.
- Required fields validated.
- Invalid input handled.
- Meaningful validation messages returned.

---

## Database

- Existing models reused.
- Indexes added only when beneficial.
- Queries optimized.
- Unnecessary database operations avoided.

---

## Security

- Authentication verified.
- Authorization verified.
- Environment variables used.
- Sensitive data protected.
- Passwords hashed when applicable.

---

## Error Handling

- Try/catch implemented where required.
- Global error handler used.
- Meaningful error responses returned.

---

## Logging

- Useful logs added where appropriate.
- Debug logs removed before completion.

---

## Final Verification

- API tested.
- Build succeeds.
- Existing functionality preserved.