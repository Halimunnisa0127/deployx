# Monitoring & Telemetry Runbook

DeployX includes native health endpoints, database readiness probes, and time-series system metric collection.

---

## 🩺 Health & Readiness Endpoints

### 1. Liveness Probe (`GET /health`)
Verifies that the Express process is running and responding to HTTP traffic.

```bash
curl -i http://localhost:5000/health
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "DeployX Backend Running",
  "environment": "production",
  "version": "1.0.0",
  "uptime": 86400.12,
  "timestamp": "2026-09-07T13:30:00.000Z"
}
```

---

### 2. Readiness Probe (`GET /health/ready`)
Verifies that MongoDB and Redis connections are active and ready to handle user requests and queue jobs.

```bash
curl -i http://localhost:5000/health/ready
```

#### Healthy Response (`200 OK`)
```json
{
  "success": true,
  "status": "ready",
  "services": {
    "mongodb": "ready",
    "redis": "ready"
  },
  "timestamp": "2026-09-07T13:30:00.000Z"
}
```

#### Unhealthy Response (`503 Service Unavailable`)
```json
{
  "success": false,
  "status": "unavailable",
  "services": {
    "mongodb": "ready",
    "redis": "unavailable"
  },
  "timestamp": "2026-09-07T13:30:00.000Z"
}
```

> [!TIP]
> Use `/health/ready` for Kubernetes readiness probes, AWS ALB health checks, and Caddy upstream health monitors.

---

## 📊 Native System Telemetry & SystemMetric Collection

DeployX stores host telemetry samples in the `SystemMetric` collection in MongoDB.

### Collected Metric Types:
- `cpu`: Host CPU utilization percentage.
- `memory`: Process and system memory consumption.
- `disk`: Host disk utilization percentage and free space.
- `network`: Inbound and outbound network bandwidth counters.
- `queue`: BullMQ waiting, active, completed, and failed job counts.
- `redis`: Redis connection status and command latencies.
- `mongodb`: MongoDB ping latency and connection pool utilization.

### Retention Policy
`SystemMetric` documents include a MongoDB TTL index that automatically expires and removes metric data older than **30 days** (`expireAfterSeconds: 2592000`).

---

## 🔍 Log Inspection & Aggregation

DeployX uses the high-performance `pino` structured logger.

### Viewing Formatted Logs in Development
```bash
npm run dev | npx pino-pretty
```

### Structured JSON Logs in Production
In production (`NODE_ENV=production`), logs are emitted as single-line JSON objects with standard fields:
```json
{
  "level": 30,
  "time": 1725715800000,
  "pid": 12345,
  "hostname": "deployx-prod-01",
  "reqId": "req_8f3b2a1c",
  "event": "deployment.processing",
  "deploymentId": "66da709f89c45b001a333333",
  "workerId": "worker-prod-12345-a1b2",
  "msg": "[Worker] Processing deployment job"
}
```
