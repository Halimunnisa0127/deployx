# Admin API Reference

All administrative endpoints are mounted under `/admin/*` and require an authenticated user with `role === 'admin'`. Unauthorized requests return `401 Unauthorized` or `403 Forbidden`.

---

## 👥 User Administration (`/admin/users`)

| Method | Path | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | Paginated list of all users | `?page=1&limit=20&search=doe&role=user` |
| `GET` | `/admin/users/:id` | Fetch full user profile & stats | None |
| `POST` | `/admin/users` | Create a new user account | `{ fullName, email, password, role }` |
| `PATCH`| `/admin/users/:id` | Update user role, status, profile | `{ fullName, email, role, isActive }` |
| `DELETE`| `/admin/users/:id`| Permanently delete a user account | None |
| `POST` | `/admin/users/:id/reset-password` | Administratively set new password | `{ newPassword }` |

---

## 📦 Project Administration (`/admin/projects`)

| Method | Path | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/projects` | Cross-tenant project listing | `?page=1&limit=20&search=portfolio&status=live` |
| `GET` | `/admin/projects/:id` | Detailed project configuration | None |
| `POST` | `/admin/projects/:id/archive` | Toggle archive status for project | None |
| `DELETE`| `/admin/projects/:id` | Delete project and tear down containers | None |
| `POST` | `/admin/projects/export` | Export project metadata | `{ format: "json" }` |

---

## 🚀 Deployment Administration (`/admin/deployments`)

| Method | Path | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/deployments` | Global deployment audit view | `?page=1&limit=20&status=failed&environment=Production` |
| `GET` | `/admin/deployments/:id` | Full deployment state & runtime port | None |
| `POST` | `/admin/deployments/:id/cancel` | Force cancel active build job | None |
| `DELETE`| `/admin/deployments/:id` | Delete deployment record & logs | None |
| `POST` | `/admin/deployments/export` | Export deployment telemetry logs | `{ format: "json" }` |

---

## 🌐 Domain Administration (`/admin/domains`)

| Method | Path | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/domains` | List all platform custom domains | `?page=1&limit=20&verificationStatus=pending` |
| `GET` | `/admin/domains/:id` | Inspect domain details | None |
| `GET` | `/admin/domains/:id/dns` | Retrieve live DNS query results | None |
| `GET` | `/admin/domains/:id/instructions` | View DNS setup challenge records | None |
| `POST` | `/admin/domains/:id/verify` | Trigger administrative DNS verification | None |
| `PATCH`| `/admin/domains/:id/target` | Modify domain destination target | `{ targetType, targetDeployment }` |
| `DELETE`| `/admin/domains/:id` | Delete domain from platform routing | None |

---

## ⚙️ Platform Settings (`/admin/settings`)

| Method | Path | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/settings` | Get global platform settings | None |
| `PATCH`| `/admin/settings` | Update platform settings | `{ general, branding, maintenance, features, security }` |
| `POST` | `/admin/settings/reset` | Reset all settings to factory defaults | None |
| `POST` | `/admin/settings/test-email` | Send test email via configured SMTP relay | `{ recipientEmail: "admin@example.com" }` |

---

## 📊 System Health & Analytics (`/admin/health`)

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/health/overview` | Platform health score, service states, host resource summary |
| `GET` | `/admin/health/infrastructure` | Redis, MongoDB, and Docker daemon connectivity and latencies |
| `GET` | `/admin/health/incidents` | Recent deployment errors and container crash logs |
| `GET` | `/admin/health/history` | Historical time-series metrics (`?metric=cpu&range=24h`) |
| `GET` | `/admin/health/performance` | Average build durations, API response times, queue depths |
| `POST`| `/admin/health/sample` | Manually trigger a host telemetry sampling snapshot |
| `GET` | `/admin/health/analytics` | High-level KPI summary (total deployments, projects, users) |
| `GET` | `/admin/health/deployment-trends` | 30-day daily deployment volume breakdown (success vs fail) |
| `GET` | `/admin/health/user-growth` | User registration trajectory over time |
| `GET` | `/admin/health/project-growth` | Project creation trends |
| `GET` | `/admin/health/frameworks` | Breakdown of deployed frameworks (React, Vite, Next.js, etc.) |
| `GET` | `/admin/health/top-projects` | Top active projects by deployment count |
| `GET` | `/admin/health/top-users` | Most active users across the platform |
| `GET` | `/admin/health/regions` | Regional distribution of deployed projects |
