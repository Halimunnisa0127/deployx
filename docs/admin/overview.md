# Admin Portal Overview

DeployX includes a dedicated administrative management space accessible at `/admin` for users with `role: 'admin'`.

---

## 🔒 Access & Role Authorization

The admin space is protected by dual guards:
1. **Frontend**: The `AdminRoute` component wraps all `/admin/*` routes, redirecting non-admin users to `/dashboard`.
2. **Backend**: All `/admin/*` routes enforce `requireAdmin` middleware, checking `req.user.role === 'admin'` and returning `403 Forbidden` if the user is not an administrator.

---

## 🧭 Admin Portal Modules

```text
/admin
├── / (Dashboard)        # Executive summary, health metrics, and rapid actions
├── /users               # User accounts, status toggling, administrative password resets
├── /projects            # Platform-wide project oversight, archiving, and deletion
├── /deployments         # Global deployment monitoring, force cancellation, and log export
├── /domains             # Custom domain registry, DNS verification testing, target overrides
├── /settings            # Platform branding, maintenance mode toggling, SMTP test relays
├── /analytics           # Platform growth curves, deployment trends, framework metrics
└── /system-health       # Real-time infrastructure latency, CPU/RAM telemetry, incident logs
```

---

## ⚡ Initial Administrator Bootstrapping

To create the initial administrator or elevate an existing user account:

```bash
cd backend
npm run create-admin
```

The script will prompt for name, email, and password. If the email already exists in MongoDB, it will automatically upgrade the account's role to `admin`.
