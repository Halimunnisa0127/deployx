# Threat Model & Attack Surface Analysis

This document evaluates potential threat vectors against DeployX and details the mitigation controls implemented across the architecture.

---

## 🎯 Threat Analysis Matrix

| Threat Actor / Vector | Risk Description | Architectural Mitigation in DeployX |
| :--- | :--- | :--- |
| **Malicious Build Scripts (Untrusted Repos)** | A tenant configures malicious `npm install` lifecycle scripts or build commands designed to compromise the host. | Builds run inside unprivileged Docker containers (`node:20-alpine`) with hard memory caps (2 GB), CPU limits (2 cores), and process limits (`PidsLimit: 100`). Scripts are piped over stdin; no host directories are bind-mounted. |
| **Docker Daemon Socket Compromise** | An attacker attempts to exploit Docker daemon socket permissions to escape to the host root. | The Docker socket is accessible only by the backend worker process. The container itself never receives access to the host Docker socket. |
| **Cross-Tenant Data Access (IDOR)** | An attacker attempts to read or mutate another user's project, deployment, or domain by guessing MongoDB ObjectIds. | Every controller explicitly queries the requesting user's ID against `resource.owner`. Mismatched ownership results in an immediate `403 Forbidden`. |
| **GitHub Webhook Spoofing** | An attacker sends forged webhook push payloads to trigger unauthorized builds or consume compute resources. | Webhooks are verified using HMAC SHA-256 signatures (`x-hub-signature-256`) computed against `GITHUB_WEBHOOK_SECRET`. Unsigned or invalid requests are dropped. |
| **Server-Side Request Forgery (SSRF)** | An attacker supplies internal hostnames or IP addresses to probe private network infrastructure via domain verification. | Domain verification performs pure DNS TXT lookups (`dns.resolveTxt`) rather than initiating HTTP requests to the target host. |
| **Preview Session Privilege Escalation** | An attacker uses a deployment preview cookie to issue administrative API commands. | The API authentication middleware explicitly rejects tokens with `scope: 'preview'`. |
| **Cryptographic Secret Exposure in Logs** | Database errors or Docker exceptions dump unmasked environment secrets into system logs. | Secrets are masked with `'********'` in API responses. Error handlers scrub regex-matched `Env: [...]` arrays before logging or returning error messages. |
