# Contributor Guide: Testing

DeployX maintains a comprehensive test suite across backend API services, unit logic, security invariants, and frontend UI components.

---

## 🧪 Test Execution Commands

### 1. Running Backend Tests (Jest)

The backend test suite includes unit and integration tests powered by Jest and Supertest:

```bash
cd backend

# Run all backend test suites
npm test

# Run a specific unit test file
npx jest tests/unit/secret_masking.unit.test.js

# Run integration test suites
npx jest tests/integration/api_integration.integration.test.js
```

---

### 2. Running Frontend Tests (Vitest)

The frontend test suite is powered by Vitest and React Testing Library:

```bash
cd frontend

# Run all frontend tests
npm test

# Run tests in watch mode
npx vitest

# Run a specific UI test file
npx vitest tests/admin_system_health.test.jsx
```

---

## 📂 Test Suite Structure

### Backend Test Suites (`backend/tests/`)
- **Unit Tests (`backend/tests/unit/`)**:
  - `admin_deployments.unit.test.js`: Deployment filtering and cancellation logic.
  - `admin_domains.unit.test.js`: Custom domain record handling.
  - `admin_health.unit.test.js`: Health metrics and latency calculations.
  - `admin_project_archive_semantics.unit.test.js`: Project archiving rules.
  - `admin_settings.unit.test.js`: Platform settings singleton management.
  - `ai_chat.unit.test.js`: Gemini AI service mocking and prompt validation.
  - `artifact_security.unit.test.js`: Checksum generation and size enforcement.
  - `deployment_state.unit.test.js`: Finite state machine transition rules.
  - `domain_dns.unit.test.js`: DNS TXT record resolution and validation.
  - `project_deletion_safety.unit.test.js`: Cascading cleanup of deployments/artifacts.
  - `reconciliation.unit.test.js`: Stale job recovery and orphaned container detection.
  - `resource_cleanup.unit.test.js`: 30-day artifact retention policy enforcement.
  - `secret_masking.unit.test.js`: Verification that secrets are stripped before client delivery.
  - `security_csp.unit.test.js`: Content Security Policy and Helmet header checks.
  - `webhook_security.unit.test.js`: GitHub HMAC signature verification.

- **Integration Tests (`backend/tests/integration/`)**:
  - `admin.integration.test.js`: End-to-end admin portal API workflows.
  - `api_integration.integration.test.js`: Complete registration, project creation, and deployment flow.
  - `notification.integration.test.js`: Notification creation, read receipts, and clearing.

### Frontend Test Suites (`frontend/tests/`)
- `api_contract.test.jsx`: Verifies API client request formatting and response handling.
- `deployment_details_ui.test.jsx`: Verifies deployment status badges, log viewer, and metrics.
- `promotion_rollback_ui.test.jsx`: Verifies instant rollback UI interactions.
- `admin_*.test.jsx`: Admin dashboard widgets, user editing tables, and system health charts.
