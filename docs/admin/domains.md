# Domain Administration

The Domain Administration module (`/admin/domains`) allows administrators to inspect, verify, and re-route custom domains across the entire platform.

---

## 🛠️ Administrative Capabilities

### 1. Global Domain Inventory
Search and filter across all custom domains registered on DeployX:
- **Verification Status**: `pending`, `verified`, `failed`.
- **Domain Status**: `pending`, `active`, `disabled`.
- **Search Query**: Hostname search (e.g. `example.com`).

### 2. Live DNS Inspection (`GET /admin/domains/:id/dns`)
Performs real-time DNS queries against authoritative name servers and displays active TXT, CNAME, and A records for diagnostic troubleshooting.

### 3. Administrative DNS Verification (`POST /admin/domains/:id/verify`)
Executes an immediate server-side DNS resolution to verify the domain ownership token against public DNS.

### 4. Routing Target Modification (`PATCH /admin/domains/:id/target`)
Administrators can redirect a custom domain to point either to the project's default production deployment (`targetType: 'production'`) or lock it to a specific historical deployment ID (`targetType: 'deployment'`).

### 5. Domain Deletion (`DELETE /admin/domains/:id`)
Permanently unbinds the hostname from DeployX routing tables. Subsequent requests to that domain will receive `404 Not Found`.
