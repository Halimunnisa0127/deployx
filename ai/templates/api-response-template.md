# API Response Template

Success

{
  success: true,
  message,
  data
}

Failure

{
  success: false,
  message,
  error
}

Rules

- Consistent response format
- Correct HTTP status codes
- Never expose sensitive information