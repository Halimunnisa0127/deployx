# Platform Settings Administration

The Platform Settings module (`/admin/settings`) controls global behavior, platform branding, maintenance mode, security toggles, and feature flags.

---

## ⚙️ Configurable Platform Sections

### 1. General Settings
- **Platform Name**: Display name used in emails, titles, and headers (Default: `DeployX`).
- **Default Region**: Fallback region for project deployment snapshots (Default: `us-east-1`).
- **Timezone & Language**: Global defaults for administrative telemetry formatting (Default: `UTC`, `en`).

### 2. Branding Settings
- **Primary Logo**: Path to header brand logo asset (Default: `/logo-full.png`).
- **Favicon**: Path to browser favicon asset (Default: `/favicon.ico`).
- **Accent Color**: Primary CSS color variable token (Default: `#6366f1`).

### 3. Maintenance Mode
- **Enabled (`maintenance.enabled`)**: When enabled, non-admin API requests can be rejected with a 503 Maintenance page.
- **Message**: Custom maintenance advisory displayed to users.
- **Allowed IPs**: Comma-separated list of IP addresses exempt from maintenance restrictions.

### 4. Feature Flags
- **Beta Features**: Enable experimental UI features across the dashboard.
- **User Registration (`features.userRegistration`)**: When disabled, public signups (`POST /auth/register`) are blocked.
- **GitHub Integration**: Global toggle for GitHub OAuth and webhook listeners.
- **Email Notifications**: Global switch for transactional emails.

### 5. Security & Session Policies
- **Session Timeout**: Maximum session duration in minutes (Default: `1440` / 24 hours).
- **Password Policy**: Enforced strength level: `basic`, `medium`, or `strong`.
- **Require 2FA**: Require two-factor authentication *(Future consideration)*.
- **API Rate Limit**: Global requests per window threshold (Default: `1000`).

---

## ✉️ SMTP Relay Test (`POST /admin/settings/test-email`)

Administrators can test their configured SMTP relay by sending a diagnostic test email directly from the admin panel:

```json
{
  "recipientEmail": "admin@deployx.app"
}
```
