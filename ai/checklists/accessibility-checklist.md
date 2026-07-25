# Accessibility Checklist

## Semantic HTML

- Use semantic HTML elements (`header`, `nav`, `main`, `section`, `article`, `footer`) where appropriate.
- Maintain a logical heading hierarchy.
- Avoid unnecessary wrapper elements.

---

## Keyboard Accessibility

- All interactive elements are keyboard accessible.
- Focus indicators remain visible.
- Tab order follows the visual layout.
- Modals, dialogs, and dropdowns support keyboard interaction.
- Close dialogs with the Escape key when applicable.

---

## Forms

- Every input has an associated label.
- Required fields are clearly identified.
- Validation messages are accessible.
- Error messages are associated with the correct input.

---

## Screen Reader Support

- Images include meaningful alt text.
- Decorative icons use `aria-hidden="true"`.
- Use ARIA attributes only when native HTML is insufficient.
- Dynamic content announcements use `aria-live` only when needed.

---

## Color & Contrast

- Text meets WCAG AA contrast requirements.
- Color is never the only way to communicate information.
- Focus states are clearly visible.
- Icons include labels or supporting text when required.

---

## Motion

- Respect `prefers-reduced-motion` when animations are used.
- Avoid excessive animations.
- Animations should never block interaction.

---

## React Components

- Buttons use `<button>`, not clickable `<div>`.
- Links use `<a>` or React Router `<Link>`.
- Forms use proper form elements.
- Reusable components preserve accessibility.

---

## Final Verification

- Keyboard navigation verified.
- Screen reader compatibility considered.
- No accessibility regressions introduced.