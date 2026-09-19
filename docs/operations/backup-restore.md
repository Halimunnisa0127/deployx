# Backup & Recovery Runbook

This guide covers operational backup and disaster recovery procedures for DeployX state and build artifacts.

---

## 💾 Persistence Overview

DeployX state is stored across two primary persistence layers:

1. **MongoDB Database**: Contains all user records, projects, encrypted secrets, deployment metadata, DNS tokens, in-app notifications, and platform settings.
2. **Local Artifact Storage Directory**: Contains immutable `.tar` build archives extracted from successful build runs.

---

## 🗄️ MongoDB Database Backup & Restore

### Creating a Database Backup (`mongodump`)
```bash
# Define backup timestamp
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/deployx/mongo_${BACKUP_DATE}"

mkdir -p "${BACKUP_DIR}"

# Execute mongodump (Local MongoDB instance)
mongodump --uri="mongodb://127.0.0.1:27017/deployx" --out="${BACKUP_DIR}" --gzip

# If using MongoDB Atlas:
# mongodump --uri="mongodb+srv://<user>:<password>@cluster0.mongodb.net/deployx" --out="${BACKUP_DIR}" --gzip
```

### Restoring from a MongoDB Backup (`mongorestore`)
```bash
# Restore specific backup folder into deployx database
mongorestore --uri="mongodb://127.0.0.1:27017/deployx" --nsInclude="deployx.*" --gzip /var/backups/deployx/mongo_<TIMESTAMP>/deployx
```

---

## 📦 Artifact Storage Backup & Restore

DeployX uses the local filesystem provider (`LocalArtifactStorageProvider`) by default.

### Backing Up Artifact Files
```bash
ARTIFACT_SOURCE="/opt/deployx/backend/storage/artifacts"
BACKUP_DEST="/var/backups/deployx/artifacts_$(date +%Y%m%d_%H%M%S).tar.gz"

tar -czvf "${BACKUP_DEST}" -C "${ARTIFACT_SOURCE}" .
```

### Restoring Artifact Files
```bash
mkdir -p /opt/deployx/backend/storage/artifacts
tar -xzvf /var/backups/deployx/artifacts_<TIMESTAMP>.tar.gz -C /opt/deployx/backend/storage/artifacts/
```

---

## 🔄 Automated Daily Backup Cron Example

```bash
# /etc/cron.daily/deployx-backup
#!/bin/bash
set -e
TIMESTAMP=$(date +%Y%m%d)
DEST="/var/backups/deployx/${TIMESTAMP}"
mkdir -p "${DEST}"

# Backup MongoDB
mongodump --uri="mongodb://127.0.0.1:27017/deployx" --archive="${DEST}/mongo.archive.gz" --gzip

# Backup Artifacts
tar -czf "${DEST}/artifacts.tar.gz" -C /opt/deployx/backend/storage/artifacts .

# Prune backups older than 14 days
find /var/backups/deployx -type d -mtime +14 -exec rm -rf {} +
```
