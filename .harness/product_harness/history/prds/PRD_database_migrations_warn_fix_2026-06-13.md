# Product Requirement Document (PRD): Database Migration Directory Presence

## METADATA

```text
Document: PRD
Feature: Database Migration Directory Presence in Production (Audit Fix)
Venture: Socialobot
Date: 2026-06-13
Author: PM (Product Manager)
Approver: CPO
```

---

## 1. BACKGROUND & PROBLEM STATEMENT
During the technical audit, a warning (**WARN**) was identified regarding the database migrations check:
- **Status**: `WARN`
- **Reason**: `Archivos: ninguno` (Files: none)
- **Root Cause**: The migration detection system inside the nightly audit worker (`nightlyAuditWorker.ts`) looks for SQL migration files under [database/migrations](database/migrations). However, since the production Docker image is built using [platform-api](platform-api) as the build context, the [database/migrations](database/migrations) directory (located at the workspace root) is never copied into the container image. As a result, `findMigrationsDir()` returns `null` at runtime, triggering the warning.

---

## 2. GOALS & OBJECTIVES
- **High Reliability**: Restore the migration status audit check to **PASS** when all migrations are applied.
- **Zero Local Impact**: Maintain full backward compatibility for local development, docker-compose, and testing environments.
- **Seamless Automation**: Automate the directory copying inside the CI/CD pipeline and manual deployment scripts.

---

## 3. TECHNICAL REQUIREMENTS

### R1: Staging of Migration Files in CI/CD
The build configurations must copy `database/migrations/*.sql` into `platform-api/database/migrations/` before running the docker build.
- Affected: [infra/cloudbuild.yaml](infra/cloudbuild.yaml)

### R2: Staging of Migration Files in Manual Deploy
The deployment script [deploy/deploy-gcp.sh](deploy/deploy-gcp.sh) must copy the migration files locally before submitting the build to GCP.
- Affected: [deploy/deploy-gcp.sh](deploy/deploy-gcp.sh)

### R3: Copying in Dockerfile
The [platform-api/Dockerfile](platform-api/Dockerfile) must copy the staged migration files from `database/migrations/` into `/app/database/migrations/` in the final runner stage.
- Affected: [platform-api/Dockerfile](platform-api/Dockerfile)

### R4: Git Protection
The staged files should never be committed to Git. The `.gitignore` must ignore `platform-api/database/`.
- Affected: [.gitignore](.gitignore)

### R5: Local Workspace Guarantee
Create a `.gitkeep` file at [platform-api/database/migrations/.gitkeep](platform-api/database/migrations/.gitkeep) to ensure the directory structure exists on clean checkout, preventing `COPY` errors during raw local Docker builds.
- Affected: [platform-api/database/migrations/.gitkeep](platform-api/database/migrations/.gitkeep)

---

## 4. IMPACT ANALYSIS & RISK MITIGATION
- **Risk**: Staging files are committed to Git.
  - **Mitigation**: Strictly configure the [.gitignore](.gitignore) file.
- **Risk**: Local `docker compose build` fails because the `database/migrations` directory doesn't exist inside `./platform-api/`.
  - **Mitigation**: Placing a `.gitkeep` inside [platform-api/database/migrations/.gitkeep](platform-api/database/migrations/.gitkeep) guarantees that the directory exists on every machine, preventing build failures.
