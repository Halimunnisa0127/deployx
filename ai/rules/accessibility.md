# Accessibility Rules

## Purpose

Ensure every user interface in DeployX is accessible, usable, and inclusive.

Accessibility is a default requirement, not an optional enhancement.

---

## Semantic HTML

Always

- Use semantic HTML elements whenever appropriate
- Use headings in a logical order
- Use lists for grouped content
- Use buttons for actions
- Use links for navigation

Never

- Use generic elements when semantic elements are more appropriate
- Use clickable `<div>` or `<span>` elements instead of buttons

---

## Keyboard Accessibility

Always

- Ensure all interactive elements are keyboard accessible
- Maintain a logical tab order
- Provide visible focus indicators
- Support keyboard navigation for custom components

Never

- Remove focus outlines without providing an accessible alternative
- Require a mouse to complete essential actions

---

## Forms

Always

- Associate every input with a visible label
- Mark required fields clearly
- Display helpful validation messages
- Associate validation errors with the related input

Never

- Use placeholder text as the only label
- Hide important instructions

---

## Images & Icons

Always

- Provide meaningful alternative text for informative images
- Mark decorative images appropriately
- Provide accessible labels for icon-only buttons

Never

- Use images to communicate essential information without text
- Leave icon-only controls without an accessible name

---

## Color & Contrast

Always

- Maintain sufficient color contrast
- Use more than color to communicate status
- Ensure text remains readable in all supported themes

Never

- Rely only on color to convey meaning
- Use low-contrast text

---

## Interactive Components

Always

- Provide clear hover and focus states
- Indicate disabled states clearly
- Announce loading states when appropriate

Never

- Hide important interactive controls
- Make interactive elements difficult to identify

---

## Responsive Accessibility

Always

- Ensure content remains usable on mobile, tablet, and desktop
- Prevent horizontal scrolling caused by layout issues
- Maintain readable spacing and typography

---

## Dynamic Content

Always

- Manage keyboard focus appropriately after dialogs or navigation
- Use ARIA attributes only when native HTML cannot provide the required behavior
- Keep screen reader announcements meaningful

Never

- Use ARIA where native HTML provides the same functionality
- Add unnecessary ARIA attributes

---

## Rules

Always

- Prefer semantic HTML
- Keep interfaces keyboard accessible
- Provide meaningful labels
- Support screen readers
- Follow existing accessibility patterns

Never

- Ignore accessibility for new features
- Break keyboard navigation
- Hide important information from assistive technologies
- Introduce accessibility regressions
