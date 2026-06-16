# Architecture Contract: Database Migration Directory Presence

## METADATA

```text
Contract: DB_MIGRATION_PRESENCE_v1
Venture: Seliabot
Architect: Chief Architect (Martin Fowler)
Approved By: CTO (Demis Hassabis)
Date: 2026-06-13
```

---

## 1. CONTEXT & ARCHITECTURAL DECISION
To run the automated audit checks successfully, the `nightlyAuditWorker` must have local access to the migration files (`migration_*.sql`). Currently, these files exist only at the workspace root, which is excluded from the Docker build context of the `platform-api` service.

To resolve this issue while maintaining clean decoupled code:
- We will stage a copy of the migration files inside the `platform-api` directory before building the Docker image.
- We will update the `Dockerfile` to copy this staged folder into the container.
- We will gitignore the staged directory to prevent duplicating files in the version control system.

---

## 2. FILE SPECIFICATIONS

### [platform-api/Dockerfile](platform-api/Dockerfile)
In the final runtime stage, copy the staged migrations into `/app/database/migrations`:
```dockerfile
COPY database/migrations/ ./database/migrations/
```

### [infra/cloudbuild.yaml](infra/cloudbuild.yaml)
Add a pre-build step named `prepare-api-migrations` to stage the folder:
```yaml
  # ── Prepare platform-api migrations ─────────────────────────
  - name: 'bash'
    entrypoint: 'sh'
    args:
      - '-c'
      - 'mkdir -p platform-api/database/migrations && cp database/migrations/*.sql platform-api/database/migrations/'
    id: 'prepare-api-migrations'
    waitFor: ['test-api']
```
Update `build-api` step dependency:
```yaml
    waitFor: ['prepare-api-migrations']
```

### [deploy/deploy-gcp.sh](deploy/deploy-gcp.sh)
Insert a staging block before the building stage:
```bash
echo "  Preparing migrations for platform-api..."
mkdir -p platform-api/database/migrations
cp database/migrations/*.sql platform-api/database/migrations/
```

### [.gitignore](.gitignore)
Ensure `platform-api/database/` is appended to prevent tracking:
```text
# Staged database folder in API
platform-api/database/
```

---

## 3. VERIFICATION & QUALITY ASSURANCE
- **Build Verification**: Local `docker compose build` must pass.
- **Git Check**: `git status` must not show duplicated SQL files under `platform-api/database/migrations/` (only the `.gitkeep` if it is tracked, or nothing if ignored).
- **Audit Verification**: After deployment, the nightly audit should pass with **PASS** status for migrations and 0 pending.
