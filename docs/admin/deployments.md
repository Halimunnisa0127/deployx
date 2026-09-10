# Deployment Administration

The Deployment Administration module (`/admin/deployments`) gives administrators global oversight of all active, queued, and historical build runs across the platform.

---

## 🛠️ Administrative Capabilities

### 1. Global Deployment Audit Log
Administrators can inspect all deployments across all users and projects, with filtering for:
- **Status**: `queued`, `building`, `ready`, `failed`, `cancelled`.
- **Environment**: `Production`, `Preview`, `Development`.
- **Project Filter**: Isolate runs for a specific project.

### 2. Force Cancellation (`POST /admin/deployments/:id/cancel`)
If a build container runs amok or becomes unresponsive, an administrator can force-cancel the deployment. This immediately:
1. Marks the deployment as `status: 'cancelled'` in MongoDB.
2. Sends a SIGKILL to the underlying Docker build container via `DockerClient.stopDeploymentContainer()`.
3. Removes the BullMQ job from Redis.

### 3. Deployment Deletion (`DELETE /admin/deployments/:id`)
Removes the deployment record, associated build logs, and triggers artifact deletion if the deployment is not actively serving production traffic.

### 4. Deployment Log & Metadata Export (`POST /admin/deployments/export`)
Exports build history and diagnostic duration metrics in JSON format for compliance or performance analysis.
