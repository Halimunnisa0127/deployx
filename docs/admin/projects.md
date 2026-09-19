# Project Administration

The Project Administration module (`/admin/projects`) provides cross-tenant visibility and administrative governance across all hosted projects.

---

## 🛠️ Administrative Capabilities

### 1. Cross-Tenant Project Inventory
Administrators can inspect all hosted projects regardless of tenant ownership, filtering by:
- **Status**: `live`, `building`, `draft`, `failed`, `archived`.
- **Framework**: `react`, `vite`, `nextjs`, `vue`, `astro`, `auto`.
- **Search Query**: Keyword matching against project names, slugs, or repository URLs.

### 2. Project Archival (`POST /admin/projects/:id/archive`)
Administrators can archive abusive or inactive projects. Archiving sets `status: 'archived'`, disabling automatic webhook triggers while preserving historical build logs and deployment configurations.

### 3. Destructive Deletion & Resource Teardown (`DELETE /admin/projects/:id`)
Deleting a project triggers an atomic cascading cleanup:
1. Deletes all associated `Deployment` records.
2. Removes all `Artifact` records and deletes physical `.tar` bundles from storage.
3. Stops and removes all associated Docker runtime containers (`deployx-runtime-*`).
4. Removes all attached `Domain` records from platform routing tables.
5. Deletes the `Project` document from MongoDB.

### 4. Bulk Project Metadata Export (`POST /admin/projects/export`)
Generates a structured JSON export of all platform projects, frameworks, repository mappings, and creation timestamps for auditing.
