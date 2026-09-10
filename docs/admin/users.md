# User Administration

The User Management module (`/admin/users`) gives platform administrators full lifecycle control over all user accounts.

---

## 🛠️ Administrative Operations

### 1. View & Filter Users
- **Search**: Search across names, emails, and usernames.
- **Filters**: Filter by role (`user`, `admin`) and account status (`active`, `disabled`).
- **Pagination**: Supports page-based navigation with configurable limits.

### 2. Create User Account
Administrators can manually provision user or administrator accounts directly through the UI or API (`POST /admin/users`).

### 3. Edit User Roles & Account Status
- **Role Elevation**: Elevate standard users to `admin` or demote administrators to `user`.
- **Account Suspension (`isActive: false`)**: Temporarily disables account login. All subsequent login and token refresh requests will be rejected with `401 Unauthorized (Account is disabled)`.

### 4. Administrative Password Reset
Set a new password for any user account (`POST /admin/users/:id/reset-password`). This immediately updates the password hash and increments `refreshTokenVersion`, terminating any existing active sessions.

### 5. Account Deletion
Permanently removes the user record from MongoDB (`DELETE /admin/users/:id`).

---

## 🔒 Security & Audit Considerations

> [!WARNING]
> Demoting or deleting the last remaining administrator account will lock administrative functions. Always maintain at least two active administrator accounts or use `npm run create-admin` via server CLI to recover access.
