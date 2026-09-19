# Security: Authorization

DeployX enforces strict multi-tenant authorization boundaries through Role-Based Access Control (RBAC) and explicit resource ownership verification.

---

## 👥 Role-Based Access Control (RBAC)

DeployX defines two primary system roles:

| Role | Permissions & Scope |
| :--- | :--- |
| `user` | Can manage their own projects, trigger deployments, configure custom domains, view their own logs, and connect personal GitHub/Google accounts. Strictly isolated to their own tenant data. |
| `admin` | Full administrative oversight across all tenant projects, users, global platform settings, system health telemetry, deployment cancellation, and administrative password resets. |

### Enforcing Administrative Access
Administrative endpoints enforce the `requireAdmin` middleware guard:

```javascript
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(ApiResponse.error('Authentication required', {}, 401));
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json(ApiResponse.error('Admin access required', {}, 403));
  }
  next();
};
```

---

## 🏢 Multi-Tenant Resource Ownership Checks

Every controller and service handling project or deployment operations verifies that the requesting user is the legitimate owner:

```javascript
// Example ownership verification pattern in DeploymentService
const project = await Project.findById(projectId);
if (!project) {
  throw new ApiError('Project not found', 404);
}

if (project.owner.toString() !== userId.toString()) {
  throw new ApiError('Not authorized to access this project', 403);
}
```

- **IDOR Protection**: Insecure Direct Object Reference (IDOR) attacks are blocked because simply knowing another tenant's project or deployment ObjectId yields an immediate `403 Forbidden` response.
- **Custom Domains**: Domain registrations, DNS verification triggers, and target re-routing strictly enforce ownership checks against the domain's associated project owner.
