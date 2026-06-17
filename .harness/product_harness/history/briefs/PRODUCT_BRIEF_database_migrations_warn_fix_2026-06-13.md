# Product Brief: Database Migration Warn Fix

## METADATA

```text
Feature: Database Migration Directory Missing in Production (Audit Fix)
Venture: Socialobot
Handoff Date: 2026-06-13
PM: PM (Product Manager)
Recipient (Engineering): Chief Architect (Martin Fowler) & CTO (Demis Hassabis)
Target Sprint / Cycle: Maintenance & Reliability
```

---

## 1. EXECUTIVE SUMMARY
This product brief outlines the solution to resolve the database migrations warning raised by the auditing team. In the production environment, the nightly audit worker reports a "WARN" status with "Archivos: ninguno" because the [database/migrations](database/migrations) directory is not copied into the final Docker container. By copying the migration files into the final Docker image and ensuring proper CI/CD staging, we will restore the system health to "PASS" and ensure robust database schema audit capabilities.

---

## 2. DOCUMENTOS ADJUNTOS

| Document | File Path | Status |
|---|---|---|
| Complete PRD | [PRD_database_migrations_warn_fix_2026-06-13.md](PRD_database_migrations_warn_fix_2026-06-13.md) | ✅ Approved by CPO |
| Engineering Plan | [plan.md](../engineering_harness/plan.md) | ✅ Plan finalized |

---

## 3. USER STORY

```text
As a System Administrator/Auditor,
I want the nightly audit worker to correctly find the database migration files in the production environment,
So that I can see the exact list of pending and applied migrations, verifying database schema integrity and ensuring future seamless updates.
```

---

## 4. CRITERIOS DE ACEPTACIÓN FUNCIONALES

- [ ] **Docker Image Packaging**: The final production Docker image for [platform-api](platform-api) contains a copy of [database/migrations](database/migrations) at [/app/database/migrations](/app/database/migrations).
- [ ] **CI/CD Pipeline Support**: The Cloud Build configuration in [infra/cloudbuild.yaml](infra/cloudbuild.yaml) dynamically copies [database/migrations](database/migrations) to [platform-api/database/migrations](platform-api/database/migrations) before starting the Docker build step.
- [ ] **Local Build Reliability**: Creating a placeholder directory with [platform-api/database/migrations/.gitkeep](platform-api/database/migrations/.gitkeep) ensures that any local build or Docker Compose build does not fail even if actual migrations are not present or copied.
- [ ] **Deployment Script Integration**: The manual deployment script [deploy/deploy-gcp.sh](deploy/deploy-gcp.sh) stages the [database/migrations](database/migrations) folder inside [platform-api/database/migrations](platform-api/database/migrations) before executing `gcloud builds submit`.
- [ ] **Git Pollution Prevention**: Update the root [.gitignore](.gitignore) to ignore [platform-api/database/](platform-api/database/) to avoid tracking duplicated files in git.
- [ ] **Nightly Audit Restoration**: The nightly audit worker is able to locate the directory and successfully passes with "PASS" status when there are 0 pending migrations and files are present.

---

## 5. SCOPE — What is included and what is NOT

**Includes:**
- Copying database migration `.sql` files into the platform-api production image.
- Updating Cloud Build configuration and manual deployment script to stage migration files.
- Adding a `.gitkeep` file to prevent empty directory build failures in local development.
- Ignoring the duplicated staging directory in Git.

**Does NOT include:**
- Executing migrations automatically inside the platform-api service startup. (Migrations are still run via jobs as before; this change is purely for auditing and file presence).
- Changing database schemas or modifying actual SQL migration scripts.

---

## 6. USER FLOW

1. **Deployment**: During the Cloud Build run, the build runner stages the migrations folder inside platform-api.
2. **Docker Build**: The Docker daemon builds the image, copying the staged migrations into the final image at `/app/database/migrations`.
3. **Audit Execution**: The nightly scheduler triggers the audit. The `nightlyAuditWorker` scans `/app/database/migrations`, matches them with the `schema_migrations` table, finds 100% of them applied, and reports **PASS** with correct files.
