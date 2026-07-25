# Frontend Checklist

## Component Design

- Existing reusable components reused.
- No duplicate components created.
- Single responsibility maintained.
- Tailwind CSS used consistently.
- No inline styles.
- No hardcoded values.

## UI

- Responsive on mobile.
- Responsive on tablet.
- Responsive on desktop.
- Hover states implemented.
- Focus states implemented.
- Disabled states handled.
- Loading state implemented.
- Empty state implemented.
- Error state implemented.

## React

- Functional components only.
- Hooks used correctly.
- No unnecessary re-renders.
- Stable keys used in lists.
- Heavy routes lazy loaded when appropriate.

## State Management

- Local state used where appropriate.
- Redux used only for shared state.
- Existing slices reused.
- Existing selectors reused.

## Accessibility

- Semantic HTML.
- Labels present.
- Keyboard navigation works.
- ARIA attributes added where needed.
- Focus indicators visible.

## Performance

- Duplicate renders avoided.
- Large lists paginated or virtualized when appropriate.
- Debounce used for search inputs when appropriate.

## Final Verification

- Build succeeds.
- Lint passes.
- No console errors.
- No unused imports.
- Only required files modified.