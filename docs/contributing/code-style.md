# Contributor Guide: Code Style & Standards

DeployX adheres to strict architectural layering, strong validation, and defensive programming standards.

---

## 🏛️ Architectural Layering Invariants

1. **Routes (`*.routes.js`)**:
   - Define HTTP method and path.
   - Attach middleware (authentication, rate limiters, Zod validators).
   - Delegate directly to controller handlers. Never write business logic in route files.

2. **Validators (`*.validator.js`)**:
   - Define strongly typed Zod schemas for `body`, `query`, and `params`.

3. **Controllers (`*.controller.js`)**:
   - Extract parameters from `req`.
   - Call service functions.
   - Return formatted responses using `ApiResponse.success()` or `ApiResponse.error()`.

4. **Services (`*.service.js`)**:
   - Implement business logic and database queries.
   - Throw typed errors (`ApiError`, `BadRequestError`, `UnauthorizedError`, `NotFoundError`).
   - Never interact with raw HTTP `req` or `res` objects directly.

5. **Infrastructure Adapters (`src/infrastructure/`)**:
   - Encapsulate third-party clients (Dockerode, Redis, Octokit, Google OAuth).
   - Normalize external errors into domain exceptions.

---

## 💅 Frontend Conventions

- **React 19 Hooks**: Use functional components with hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
- **State Management**:
  - Use **React Query** for server-side state (fetching, caching, mutation invalidation).
  - Use **Redux Toolkit** for global client state (current auth user, theme, open sidebars).
- **Styling**: Tailwind CSS v4 utility classes. Use `clsx` or `tailwind-merge` for conditional class joining.
- **Icons**: Import exclusively from `lucide-react`.

---

## 🔍 Linting

```bash
# Lint frontend code
cd frontend
npm run lint
```
