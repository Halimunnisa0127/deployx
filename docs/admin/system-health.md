# System Health & Analytics

The System Health and Analytics modules (`/admin/system-health` and `/admin/analytics`) provide real-time observability into platform performance, database health, host resource utilization, and business metrics.

---

## 🖥️ System Health Dashboard (`/admin/system-health`)

```text
┌────────────────────────────────────────────────────────────┐
│                    System Health Overview                  │
├─────────────────┬──────────────────┬───────────────────────┤
│ Overall Health  │ MongoDB Latency  │ Redis Queue Latency   │
│      99.8%      │      1.2 ms      │        0.8 ms         │
├─────────────────┼──────────────────┼───────────────────────┤
│ Docker Engine   │ CPU Utilization  │ Memory Consumption    │
│  Ready / Active │      18.4%       │     2.8 / 16.0 GB     │
└─────────────────┴──────────────────┴───────────────────────┘
```

### 1. Infrastructure Latencies (`GET /admin/health/infrastructure`)
- **MongoDB**: Active connection state and ping response round-trip time.
- **Redis**: Connection readiness and key retrieval latency.
- **Docker Engine**: Docker daemon socket ping status (`DockerClient.ping()`).

### 2. Time-Series Metric Charts (`GET /admin/health/history`)
Renders interactive historical area charts for:
- `cpu`: Host CPU utilization over 1 hour, 24 hours, or 7 days.
- `memory`: Process and system memory usage.
- `disk`: Host filesystem storage consumption.
- `network`: Bandwidth in/out counters.
- `queue`: Waiting and active BullMQ jobs.

### 3. Incident Log (`GET /admin/health/incidents`)
Aggregates recent deployment failures, Docker crash events, and worker timeouts into a consolidated triage feed.

---

## 📈 Platform Analytics (`/admin/analytics`)

### 1. Deployment Trends (`GET /admin/health/deployment-trends`)
Daily bar chart comparing successful (`status: 'ready'`) vs failed (`status: 'failed'`) deployments over the preceding 30 days.

### 2. Framework Distribution (`GET /admin/health/frameworks`)
Donut chart breaking down deployed projects by framework (React, Vite, Next.js, Vue, Nuxt, Astro, Express, etc.).

### 3. Platform Growth (`GET /admin/health/user-growth` & `/project-growth`)
Cumulative and daily growth trajectories for new user signups and project creations.

### 4. Leaderboards
- **Top Projects (`GET /admin/health/top-projects`)**: Projects ranked by total build volume.
- **Top Users (`GET /admin/health/top-users`)**: Accounts ranked by deployment activity.
