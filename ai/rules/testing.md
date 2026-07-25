# Testing Rules

## Purpose

Ensure every feature works correctly, existing functionality remains unaffected, and regressions are prevented.

Testing should be performed before considering any task complete.

---

# General Principles

Always

- Verify new functionality
- Verify existing functionality
- Test realistic user workflows
- Test before marking work complete

Never

- Assume code works without verification
- Skip testing after making changes

---

# Functional Testing

Verify

- Expected behavior
- User interactions
- Form submissions
- Navigation
- State updates
- API responses

---

# UI Testing

Verify

- Responsive layout
- Loading states
- Empty states
- Error states
- Success states

Ensure the UI behaves consistently across supported screen sizes.

---

# Form Validation

Test

- Required fields
- Invalid input
- Valid input
- Boundary values
- Error messages

---

# API Testing

Verify

- Successful responses
- Error responses
- Authentication
- Authorization
- Validation errors

Never ignore failed API requests.

---

# Edge Cases

Always test

- Empty data
- Missing values
- Invalid input
- Large datasets
- Slow network conditions
- API failures

---

# State Management

Verify

- Redux state updates correctly
- Local component state behaves correctly
- Loading state
- Success state
- Error state

---

# Performance

Verify

- No unnecessary re-renders
- Large lists behave correctly
- Lazy-loaded pages load properly
- Pagination works correctly

---

# Accessibility

Verify

- Keyboard navigation
- Focus management
- Form labels
- Semantic HTML
- Screen reader compatibility where applicable

---

# Regression Testing

Always verify

- Existing features still work
- Shared components behave correctly
- Related pages remain unaffected

Never introduce regressions.

---

# Bug Verification

Before closing a bug

- Reproduce the issue
- Verify the fix
- Confirm similar scenarios are unaffected

---

# Rules

Always

- Test before completion
- Cover happy path and edge cases
- Verify related functionality
- Report known limitations

Never

- Skip testing
- Ignore errors
- Assume unchanged code is unaffected