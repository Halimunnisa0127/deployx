# DeployX Documentation Portal

Welcome to the official technical documentation for **DeployX**, an open-source, developer-first cloud deployment platform built for containerized builds, ephemeral runtime hosting, custom domain management, and platform administration.

---

## 🧭 Documentation Map

```text
docs/
├── getting-started/          # Local setup, installation prerequisites, and environment reference
│   ├── installation.md       # System requirements, Docker engine setup, repository setup
│   ├── local-development.md  # Multi-process workflow (Caddy, API, Worker, Frontend)
│   └── environment-variables.md # Comprehensive configuration matrix (Server, Client, Secrets)
│
├── architecture/             # High-level architecture, module design, and subsystems
│   ├── overview.md           # System topology, design principles, component boundaries
│   ├── system-architecture.md# Ingress flow, reverse proxying, async queues, Docker runtime
│   ├── frontend.md           # React 19, Vite, Redux Toolkit, React Query, Tailwind CSS v4
│   ├── backend.md            # Express API, Mongoose ORM, BullMQ, Dockerode client layout
│   ├── deployment-pipeline.md# Git fetch, isolated container build, tar extraction, Nginx runtime
│   ├── data-model.md         # Schema entity-relationship models and index strategies
│   └── security.md           # Defense-in-depth, token hierarchies, encryption, secret masking
│
├── api/                      # Exhaustive REST API specification
│   ├── authentication.md     # /auth (register, login, refresh, logout, password recovery)
│   ├── users.md              # /users (profile retrieval, password change, avatar update)
│   ├── projects.md           # /projects (CRUD, framework presets, slug verification)
│   ├── deployments.md        # /deployments (creation, build logs, promotion, preview session)
│   ├── domains.md            # /domains (DNS verification, dynamic routing, SSL tracking)
│   ├── notifications.md      # /notifications (read receipts, categories, deletion)
│   ├── integrations.md       # /integrations (GitHub OAuth & webhooks, Google OAuth)
│   ├── ai.md                 # /api/ai (Gemini-powered deployment analysis and chat)
│   └── admin.md              # /admin (user controls, settings, health, analytics, export)
│
├── operations/               # Production operations, infrastructure runbooks, and troubleshooting
│   ├── deployment.md         # Production deployment topology, systemd, Caddy reverse proxy
│   ├── docker.md             # Docker socket permissions, resource limits, container lifecycle
│   ├── workers.md            # BullMQ deployment worker, reconciler, and disk cleanup worker
│   ├── monitoring.md         # Health probes (/health, /health/ready), SystemMetric collection
│   ├── backup-restore.md     # MongoDB state backups, local artifact persistence strategies
│   └── troubleshooting.md    # Incident triage trees and common error remediation
│
├── admin/                    # Platform administration and governance
│   ├── overview.md           # Admin portal access, RBAC enforcement, audit log considerations
│   ├── users.md              # User management, role elevation, password resets, account suspension
│   ├── projects.md           # Cross-tenant project archiving, export, and deletion safety
│   ├── deployments.md        # Global deployment inspection, force cancellation, export
│   ├── domains.md            # Domain inspection, DNS verification triggers, routing target modification
│   ├── settings.md           # PlatformSettings management, maintenance mode, SMTP testing
│   └── system-health.md      # Telemetry streams, host resource metrics, deployment analytics
│
├── security/                 # Security controls, data protection, and threat mitigations
│   ├── authentication.md     # JWT dual-token model, preview token scope, secure cookies
│   ├── authorization.md      # Role-based access control, tenant ownership guards
│   ├── secrets.md            # AES-256-GCM encryption for environment variables and OAuth tokens
│   ├── data-protection.md    # Mongoose field suppression, Zod schemas, XSS/CSP defenses
│   └── threat-model.md       # Container breakouts, untrusted build isolation, SSRF defenses
│
└── contributing/             # Contributor workflows and quality standards
    ├── development.md        # Repository structure, conventions, PR lifecycle
    ├── testing.md            # Jest unit/integration tests, Vitest UI testing, test suites
    ├── code-style.md         # Architectural layering rules, ESLint, error handling guidelines
    └── release.md            # Release checklist, semantic versioning, pre-flight audit
```

---

## 🚀 Quick Navigation

| Role | Recommended Starting Points |
| :--- | :--- |
| **New Developer** | [Installation Guide](./getting-started/installation.md) &rarr; [Local Development](./getting-started/local-development.md) &rarr; [Environment Variables](./getting-started/environment-variables.md) |
| **Architect / Senior Eng** | [System Architecture](./architecture/system-architecture.md) &rarr; [Deployment Pipeline](./architecture/deployment-pipeline.md) &rarr; [Data Model](./architecture/data-model.md) |
| **DevOps / Site Reliability** | [Production Deployment](./operations/deployment.md) &rarr; [Docker Runbook](./operations/docker.md) &rarr; [Worker Runbook](./operations/workers.md) &rarr; [Troubleshooting](./operations/troubleshooting.md) |
| **Platform Administrator** | [Admin Overview](./admin/overview.md) &rarr; [Platform Settings](./admin/settings.md) &rarr; [System Health](./admin/system-health.md) |
| **API Consumer / Integrator** | [Authentication API](./api/authentication.md) &rarr; [Projects API](./api/projects.md) &rarr; [Deployments API](./api/deployments.md) |
| **Security Auditor** | [Threat Model](./security/threat-model.md) &rarr; [Secrets Management](./security/secrets.md) &rarr; [Authentication & JWT](./security/authentication.md) |
| **Open Source Contributor** | [Contributing Guide](./contributing/development.md) &rarr; [Testing Guide](./contributing/testing.md) &rarr; [Code Style](./contributing/code-style.md) |

---

## 🔒 Source of Truth & Governance

This documentation is directly maintained against the implementation in `backend/` and `frontend/`. 

- **No hypothetical features**: Every endpoint, model schema, environment variable, and CLI script documented here corresponds to active code.
- **Explicit limitation tags**: Infrastructure-dependent capabilities (such as DNS record provisioning or multi-node container orchestration) are tagged as `Infrastructure dependent` or `Not currently implemented`.
