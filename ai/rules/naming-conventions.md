# Naming Conventions

## Purpose

Use consistent naming across DeployX to improve readability, maintainability, and discoverability.

Follow existing naming patterns before introducing new ones.

---

# Components

Use

- PascalCase

Examples

- LoginForm.jsx
- SidebarItem.jsx
- ProjectCard.jsx

Never

- loginForm.jsx
- sidebar-item.jsx

---

# Pages

Use

- PascalCase

Examples

- Dashboard.jsx
- Login.jsx
- Deployments.jsx

---

# Hooks

Use

- camelCase
- Prefix with `use`

Examples

- useAuth.js
- useProjects.js
- useDeployment.js

Never

- authHook.js
- ProjectsHook.js

---

# Redux

## Slice Files

Use

- camelCase ending with `Slice`

Examples

- authSlice.js
- deploymentSlice.js
- projectSlice.js

## Actions

Use descriptive camelCase names.

Examples

- login
- logout
- fetchProjects
- updateDeployment

## Selectors

Prefix with `select`

Examples

- selectAuth
- selectProjects
- selectDeployments

---

# Services

Use

- camelCase ending with `Service`

Examples

- projectService.js
- authService.js
- deploymentService.js

---

# Controllers

Use

- camelCase ending with `Controller`

Examples

- projectController.js
- authController.js

---

# Models

Use

- PascalCase

Examples

- Project.js
- User.js
- Deployment.js

---

# Utilities

Use

- camelCase

Examples

- formatDate.js
- generateSlug.js
- validateToken.js

---

# Constants

Use

- UPPER_SNAKE_CASE

Examples

- API_BASE_URL
- MAX_DEPLOYMENTS
- DEFAULT_TIMEOUT

---

# Environment Variables

Use

- UPPER_SNAKE_CASE

Examples

- PORT
- JWT_SECRET
- MONGO_URI

---

# CSS Classes

Use

- Tailwind utility classes
- Existing design system

Avoid

- Custom class names unless necessary

---

# Rules

Always

- Use descriptive names
- Keep naming consistent
- Follow existing project conventions
- Prefer clarity over abbreviations

Never

- Use ambiguous names
- Mix naming styles
- Use unnecessary abbreviations