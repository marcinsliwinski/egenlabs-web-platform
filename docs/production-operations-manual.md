# Production operations manual

Status: Post-MVP operations manual
Production closure baseline: `4ded789c6220b20c01f14198c911783cdee3904e`
Production closure status: accepted
Last reviewed: 2026-07-08

## 1. Purpose

This manual is the single day-to-day operations guide for the production eGen
Labs Web Platform MVP. It consolidates the production runbook, backup/restore
runbook, readiness checklist and final production closure evidence into one
practical administrator manual.

The authoritative project baseline remains `docs/living-specification.md`. This
manual must not introduce a new product scope, new architecture, new public
endpoint, new data flow, or new operating rule that conflicts with the living
specification.

Use this manual for:

- routine production health checks,
- safe production repository synchronization,
- backup and restore-readiness operations,
- incident triage,
- evidence collection,
- post-MVP maintenance changes.

Do not use this manual to bypass release acceptance, CI, backup verification,
secret handling rules, or the production change process.

## 2. Final accepted production baseline

The final MVP / production closure was accepted after the following checks had
passed:

- CI green,
- repository clean,
- production health pass,
- public endpoints pass,
- `www` canonical redirect pass,
- TLS/HTTPS pass,
- no public listeners on ports `3000` or `5432`,
- automated backup timer enabled,
- manual automated-backup test pass,
- encrypted R2 backup pass,
- restore-readiness decrypt/list pass,
- no production restore performed,
- no production data mutation performed.

Final accepted commit:

```text
4ded789c6220b20c01f14198c911783cdee3904e
ops(prod): add automated production backups
```

Important immediately preceding production operations commits:

```text
85261a7648547d8c8b9afe5de4e4679c4b0b1c82
ops(prod): harden production deployment env handling

fcd9d5e1536a7e3e840468a52d35276ad0fe2523
ops(prod): add www canonical redirect
```

## 3. Production topology

Fixed production environment:

```text
Production VPS alias: egenlabs-production
User: ubuntu
IPv4: 51.210.107.213
Hostname: egenlabs-production
Domain: egenlabs.eu
Canonical www: www.egenlabs.eu -> https://egenlabs.eu
Repository: /opt/egenlabs-production/app
Compose project: egenlabs-production
Compose file: compose.production.yaml
Compose env: /etc/egenlabs-production/compose.env
App env: /etc/egenlabs-production/app.env
Backup env: /etc/egenlabs-production/backup.env
Storage: /var/lib/egenlabs-production/storage
Backups: /var/backups/egenlabs-production
Database: egenlabs_production
R2 bucket: egenlabs-production-backups
Automated R2 prefix: production/automated/
```

Runtime model:

- Caddy is the only public service and publishes ports `80` and `443`.
- The application container is not exposed directly on a public host port.
- PostgreSQL is not exposed directly on a public host port.
- The backend network stays internal.
- Node.js is required inside Docker build/runtime where applicable, not as a
  production host dependency for deployment checks.

## 4. Non-negotiable operating rules

1. Do not print secrets, tokens, passwords, `.env` contents, private keys,
   database dumps, plaintext backup payloads, or signed/private URLs in reports,
   commits, issues, chats, screenshots or logs.
2. Do not use `git add -A` in this project. Stage explicit files only.
3. Do not restart, stop, redeploy or replace production containers without a
   specific reason and an accepted production change step.
4. Do not install host-level Node.js just to satisfy production deployment
   scripts.
5. Do not place the private `age` identity on the production VPS for normal
   backup operations.
6. Do not change ownership of restricted backup directories just to inspect
   them; use `sudo bash -c` or `sudo -n` guarded commands.
7. Do not restore into the production database unless a separate emergency
   restore decision has been accepted.
8. Do not reuse staging secrets, staging databases, staging volumes or staging
   Turnstile keys in production.
9. Do not expose ports `3000` or `5432` publicly.
10. Do not treat an unverified backup upload as recoverable until SHA and
    restore-readiness checks pass.

## 5. Access and secret handling

Production root-only configuration files:

```text
/etc/egenlabs-production/compose.env
/etc/egenlabs-production/app.env
/etc/egenlabs-production/backup.env
/root/.config/rclone/rclone.conf
```

Required permissions:

```bash
sudo stat -c '%a %U:%G %s bytes %n' /etc/egenlabs-production/compose.env
sudo stat -c '%a %U:%G %s bytes %n' /etc/egenlabs-production/app.env
sudo stat -c '%a %U:%G %s bytes %n' /etc/egenlabs-production/backup.env
sudo stat -c '%a %U:%G %s bytes %n' /root/.config/rclone/rclone.conf
```

Expected result:

```text
600 root:root ... /etc/egenlabs-production/compose.env
600 root:root ... /etc/egenlabs-production/app.env
600 root:root ... /etc/egenlabs-production/backup.env
600 root:root ... /root/.config/rclone/rclone.conf
```

Never inspect these files with `cat`, `less`, copy/paste, screenshots, or chat.
Use sanitized validation commands only.

The production VPS should hold only the public `AGE_RECIPIENT`. The private
`age` identity should stay on a secure local/admin host, for example:

```text
~/.config/egenlabs-production/backup-age-identity.txt
```

This path is an operational convention, not a repository file. Never commit it.

## 6. Daily read-only health check

Run from a local administrator machine:

```bash
ssh egenlabs-production "bash -s" <<'REMOTE_EOF'
set -Eeuo pipefail

APP_DIR="/opt/egenlabs-production/app"
COMPOSE_PROJECT="egenlabs-production"

cd "${APP_DIR}"

echo "== Host =="
hostname
date -Is

echo

echo "== Repo =="
git log -1 --oneline
git status --short

echo

echo "== Containers =="
mapfile -t CIDS < <(sudo docker ps -q --filter "label=com.docker.compose.project=${COMPOSE_PROJECT}" | sort)

for cid in "${CIDS[@]}"; do
  name="$(sudo docker inspect -f '{{.Name}}' "${cid}" | sed 's#^/##')"
  image="$(sudo docker inspect -f '{{.Config.Image}}' "${cid}")"
  state="$(sudo docker inspect -f '{{.State.Status}}' "${cid}")"
  health="$(sudo docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "${cid}")"
  echo "${name}: image=${image}, state=${state}, health=${health}"
done

echo

echo "== Public health =="
curl -fsS --max-time 15 https://egenlabs.eu/api/v1/health >/dev/null
echo "PASS: https://egenlabs.eu/api/v1/health"

echo

echo "== WWW redirect =="
WWW_HEADERS="$(curl -sS -I --max-time 15 https://www.egenlabs.eu/)"
printf '%s\n' "${WWW_HEADERS}" | sed -n '1p;/^location:/Ip'

echo

echo "== Public port guard =="
sudo ss -tulpen | grep -E '0\.0\.0\.0:(3000|5432)|\[::\]:(3000|5432)' || echo "PASS: no public listener on 3000/5432"
REMOTE_EOF
```

Expected outcome:

- app container: `running`, `healthy`,
- postgres container: `running`, `healthy`,
- caddy container: `running`, `no-healthcheck`,
- public health endpoint passes,
- `www` redirects to `https://egenlabs.eu`,
- no public listener on `3000` or `5432`.

## 7. Production repository checks

On the production VPS:

```bash
cd /opt/egenlabs-production/app

git log -1 --oneline
git status --short
git rev-parse HEAD
```

Expected final MVP closure baseline:

```text
4ded789c6220b20c01f14198c911783cdee3904e
```

A clean worktree is required before any operational change:

```bash
test -z "$(git status --porcelain)"
```

## 8. CI and local quality gate

For any post-MVP repository change, run the relevant local gate before commit:

```bash
npm ci
npm run prisma:generate
npm run typecheck
npm run lint
node scripts/smoke-production-config.mjs
```

For shell or operations changes, also run:

```bash
bash -n scripts/deploy-production.sh
bash -n scripts/backup-production.sh
bash -n scripts/verify-production-backup-artifact.sh
git diff --check
```

After push, GitHub Actions must be green before syncing production.

## 9. Safe staging and commit rules

Never use:

```bash
git add -A
```

Stage exact files only. Example for this manual:

```bash
git add docs/production-operations-manual.md
git commit -m "docs(prod): add production operations manual"
git push origin main
```

Before every commit:

```bash
git status --short
git diff --check
git diff --cached --name-only
```

Do not commit generated secrets, backup artifacts, dumps, logs, `.env` files,
private `age` identities, `rclone.conf`, or temporary restore payloads.

## 10. Production deployment overview

Use `docs/production-deployment-runbook.md` as the detailed deployment runbook.
This manual only summarizes the safe path.

Deployment preconditions:

- accepted target commit,
- GitHub Actions green,
- production worktree clean,
- root-only env files valid,
- backup identifiers recorded,
- rollback target known,
- no active incident unless this is the accepted remediation.

Deployment command shape on the VPS:

```bash
cd /opt/egenlabs-production/app

sudo EXPECTED_COMMIT="$(git rev-parse HEAD)" \
  COMPOSE_ENV_FILE=/etc/egenlabs-production/compose.env \
  APP_ENV_FILE=/etc/egenlabs-production/app.env \
  bash scripts/deploy-production.sh
```

Post-deployment checks:

```bash
curl -fsS --max-time 15 https://egenlabs.eu/api/v1/health >/dev/null
BASE_URL=https://egenlabs.eu npm run smoke:mvp
```

Do not run deployment commands just to sync documentation files. A repository
sync without `docker compose up` is not an application deployment.

## 11. Production backup architecture

Automated production backups are implemented as host-level systemd units:

```text
egenlabs-production-backup.service
egenlabs-production-backup.timer
```

Repository files:

```text
scripts/backup-production.sh
scripts/verify-production-backup-artifact.sh
deploy/production/backup.env.example
deploy/production/systemd/egenlabs-production-backup.service
deploy/production/systemd/egenlabs-production-backup.timer
```

Runtime configuration:

```text
/etc/egenlabs-production/backup.env
/root/.config/rclone/rclone.conf
```

Backup destination model:

- local encrypted artifacts:
  `/var/backups/egenlabs-production/automated/encrypted`,
- plaintext work directories:
  transient root-only work area, removed after successful encryption and upload,
- offsite encrypted artifacts:
  `r2:egenlabs-production-backups/production/automated/`.

Each encrypted payload contains:

```text
db/postgres.sql
storage/storage.tar.gz
manifest.txt
SHA256SUMS
```

The VPS encrypts using the public `AGE_RECIPIENT`; the private identity remains
outside the VPS.

## 12. Backup timer operations

Check timer status:

```bash
systemctl is-enabled egenlabs-production-backup.timer
systemctl is-active egenlabs-production-backup.timer
systemctl list-timers --all 'egenlabs-production-backup.timer' --no-pager
```

Expected timer schedule:

```text
03:20 Europe/Warsaw, randomized delay up to 20 minutes
```

Check last service result:

```bash
systemctl show egenlabs-production-backup.service -p ActiveState -p Result --no-pager
sudo journalctl -u egenlabs-production-backup.service -n 160 --no-pager
```

Manual backup test:

```bash
sudo systemctl start egenlabs-production-backup.service
sudo systemctl status egenlabs-production-backup.service --no-pager
sudo journalctl -u egenlabs-production-backup.service -n 160 --no-pager
```

Manual backup tests are allowed as controlled operations, but do not run them
unnecessarily during normal traffic unless a backup validation is needed.

## 13. Backup artifact verification

Find latest encrypted local artifact:

```bash
sudo find /var/backups/egenlabs-production/automated/encrypted \
  -maxdepth 1 \
  -type f \
  -name 'egenlabs-production-backup-*.tar.gz.age' \
  -printf '%T@ %f\n' \
  | sort -nr \
  | head -n 1
```

Verify local encrypted SHA sidecar:

```bash
LATEST_ARTIFACT="<artifact-name>"

sudo bash -c "cd /var/backups/egenlabs-production/automated/encrypted && sha256sum -c '${LATEST_ARTIFACT}.sha256'"
```

Verify R2 presence without printing credentials:

```bash
sudo bash -c '
  set -Eeuo pipefail
  source /etc/egenlabs-production/backup.env
  rclone lsf --files-only "${RCLONE_DESTINATION}" | grep -Fx "<artifact-name>" >/dev/null
  rclone lsf --files-only "${RCLONE_DESTINATION}" | grep -Fx "<artifact-name>.sha256" >/dev/null
'
```

The root `rclone` remote `r2` uses a bucket-scoped Cloudflare R2 token. Keep
`no_check_bucket = true` in `/root/.config/rclone/rclone.conf` for this remote.
This avoids bucket-level checks that may fail for tokens intentionally scoped to
`egenlabs-production-backups`.

## 14. Restore-readiness download-back check

Run on the production VPS:

```bash
cd /opt/egenlabs-production/app

sudo EGENLABS_BACKUP_CONFIG=/etc/egenlabs-production/backup.env \
  scripts/verify-production-backup-artifact.sh
```

This verifies encrypted artifact availability and SHA consistency. It does not
require the private `age` identity and does not restore production data.

## 15. Restore-readiness decrypt/list check

Run this on a secure local/admin host that has the private `age` identity. Do not
copy the private key to the production VPS.

```bash
set -Eeuo pipefail
umask 077

AGE_IDENTITY_FILE="${HOME}/.config/egenlabs-production/backup-age-identity.txt"
LOCAL_CHECK_ROOT="${HOME}/.cache/egenlabs-production/restore-readiness"
CHECK_ID="$(date -u +%Y%m%d-%H%M%S)"
CHECK_DIR="${LOCAL_CHECK_ROOT}/${CHECK_ID}"
REMOTE_ENCRYPTED_ROOT="/var/backups/egenlabs-production/automated/encrypted"

command -v age >/dev/null
test -f "${AGE_IDENTITY_FILE}"
chmod 600 "${AGE_IDENTITY_FILE}"
mkdir -p "${CHECK_DIR}"
chmod 700 "${LOCAL_CHECK_ROOT}" "${CHECK_DIR}"

LATEST_ARTIFACT="$(
  ssh -n egenlabs-production "timeout 20s sudo -n find '${REMOTE_ENCRYPTED_ROOT}' -maxdepth 1 -type f -name 'egenlabs-production-backup-*.tar.gz.age' -printf '%T@ %f\n' | sort -nr | head -n 1 | awk '{print \$2}'"
)"

test -n "${LATEST_ARTIFACT}"

ssh -n egenlabs-production "sudo -n cat '${REMOTE_ENCRYPTED_ROOT}/${LATEST_ARTIFACT}'" > "${CHECK_DIR}/${LATEST_ARTIFACT}"
ssh -n egenlabs-production "sudo -n cat '${REMOTE_ENCRYPTED_ROOT}/${LATEST_ARTIFACT}.sha256'" > "${CHECK_DIR}/${LATEST_ARTIFACT}.sha256"

EXPECTED_SHA="$(awk '{print $1}' "${CHECK_DIR}/${LATEST_ARTIFACT}.sha256")"
ACTUAL_SHA="$(sha256sum "${CHECK_DIR}/${LATEST_ARTIFACT}" | awk '{print $1}')"
test "${EXPECTED_SHA}" = "${ACTUAL_SHA}"

age --decrypt \
  --identity "${AGE_IDENTITY_FILE}" \
  --output "${CHECK_DIR}/payload.tar.gz" \
  "${CHECK_DIR}/${LATEST_ARTIFACT}"

tar -tzf "${CHECK_DIR}/payload.tar.gz" > "${CHECK_DIR}/payload-list.txt"

grep -Fx "db/postgres.sql" "${CHECK_DIR}/payload-list.txt" >/dev/null
grep -Fx "storage/storage.tar.gz" "${CHECK_DIR}/payload-list.txt" >/dev/null
grep -Fx "manifest.txt" "${CHECK_DIR}/payload-list.txt" >/dev/null
grep -Fx "SHA256SUMS" "${CHECK_DIR}/payload-list.txt" >/dev/null

rm -f "${CHECK_DIR}/payload.tar.gz"
echo "RESTORE-READINESS DECRYPT/LIST: PASS"
echo "Audit dir: ${CHECK_DIR}"
```

This check proves that the encrypted backup can be decrypted and contains the
required payload entries. It does not restore into the production database.

## 16. Full restore procedure boundary

A full restore to production is not a routine maintenance command. Treat it as
an emergency or controlled recovery procedure requiring a separate accepted
restore decision.

Before any production restore:

1. Record the incident reason and selected backup artifact.
2. Preserve the failed/current state as a separate backup if possible.
3. Stop application writes only if the accepted recovery plan requires it.
4. Verify the selected encrypted backup SHA.
5. Decrypt and inspect the payload in a controlled root-only location.
6. Restore database and storage according to `docs/operations-backup-restore.md`.
7. Re-run container and public endpoint checks.
8. Record outcome without secrets or dumps.

Do not restore a backup directly into production only because a listing check
passed. Listing is restore-readiness, not a restore drill.

## 17. Incident triage

### Public health fails

1. Check whether the app container is running and healthy.
2. Check Caddy status and recent logs.
3. Check public DNS/TLS/redirect behavior.
4. Do not redeploy until the failure mode is understood.

Commands:

```bash
curl -i --max-time 15 https://egenlabs.eu/api/v1/health
sudo docker ps --filter "label=com.docker.compose.project=egenlabs-production"
sudo docker logs --tail=120 egenlabs-production-app-1
sudo docker logs --tail=120 egenlabs-production-caddy-1
```

### App container unhealthy

1. Read app logs.
2. Check database container health.
3. Check env file permissions, not contents.
4. Check whether a recent deployment or config change occurred.

```bash
sudo docker inspect -f '{{.State.Health.Status}}' egenlabs-production-app-1
sudo docker logs --tail=200 egenlabs-production-app-1
sudo docker inspect -f '{{.State.Health.Status}}' egenlabs-production-postgres-1
```

### PostgreSQL unhealthy

1. Do not delete volumes.
2. Check disk, memory and container logs.
3. Confirm no public port exposure.
4. Prepare restore-readiness evidence before any recovery action.

```bash
df -h
free -h
sudo docker logs --tail=200 egenlabs-production-postgres-1
sudo ss -tulpen | grep -E '0\.0\.0\.0:5432|\[::\]:5432' || true
```

### Backup service fails

1. Do not disable the timer unless repeated failures create operational noise.
2. Read service journal.
3. Check local disk space.
4. Check `backup.env` permissions.
5. Check root `rclone` access.
6. Check latest encrypted artifact and SHA sidecar.

```bash
systemctl show egenlabs-production-backup.service -p ActiveState -p Result --no-pager
sudo journalctl -u egenlabs-production-backup.service -n 200 --no-pager
df -h /var/backups/egenlabs-production
sudo stat -c '%a %U:%G %s bytes %n' /etc/egenlabs-production/backup.env
sudo rclone lsf --max-depth 1 r2:egenlabs-production-backups/production/automated >/dev/null || true
```

### R2 upload fails

1. Verify root `rclone.conf` permissions.
2. Confirm `no_check_bucket = true` for the `r2` remote.
3. Run a write/list/delete preflight in the automated prefix.
4. Confirm Cloudflare R2 token has object read/write permissions for
   `egenlabs-production-backups`.

```bash
sudo stat -c '%a %U:%G %s bytes %n' /root/.config/rclone/rclone.conf
sudo rclone config show r2 | sed -E \
  -e 's/(access_key_id = ).*/\1[redacted]/' \
  -e 's/(secret_access_key = ).*/\1[redacted]/'
```

## 18. Monthly maintenance checklist

Run monthly or before major post-MVP changes:

- [ ] GitHub Actions green on `main`.
- [ ] Production repo clean and synced to accepted commit.
- [ ] Public health endpoint passes.
- [ ] Homepage HTTPS passes.
- [ ] `www` canonical redirect passes.
- [ ] No public listener on `3000` or `5432`.
- [ ] App and PostgreSQL containers healthy.
- [ ] Backup timer enabled and active.
- [ ] Last backup service result is `success`.
- [ ] Latest local encrypted backup SHA verifies.
- [ ] Latest R2 encrypted backup and sidecar exist.
- [ ] Restore-readiness decrypt/list passes on secure local/admin host.
- [ ] No private `age` identity found on VPS operational paths.
- [ ] Disk usage reviewed.
- [ ] Known risks/backlog reviewed.

## 19. Change checklist for post-MVP work

Before a production-affecting post-MVP change:

- [ ] Change scope is compared with `docs/living-specification.md`.
- [ ] Decision Log / ADR impact is identified if the change is architectural or
      long-lived.
- [ ] Exact files to change are listed.
- [ ] No secrets or generated artifacts are included.
- [ ] Local quality gate passes.
- [ ] Commit message is in English.
- [ ] GitHub Actions is green.
- [ ] Production sync plan avoids deployment unless deployment is required.
- [ ] Rollback target is known.
- [ ] Latest backup is verified.

## 20. Evidence report template

Use this redacted template after production checks or maintenance operations:

```text
Operation:
Date/time UTC:
Operator:
Repository commit:
GitHub Actions:
Production repo clean:
Container health:
Public health:
HTTPS homepage:
WWW redirect:
No public 3000/5432:
Backup timer status:
Latest encrypted local backup:
Latest encrypted R2 backup:
Restore-readiness result:
Production data mutation performed: no/yes
Deployment performed: no/yes
Container restart performed: no/yes
Notes:
```

Never include secret values, database dumps, backup plaintext, private keys or
credential-bearing URLs in an evidence report.

## 21. Related documents

- `docs/living-specification.md` — project source of truth.
- `docs/production-deployment-runbook.md` — detailed production deployment
  runbook.
- `docs/operations-backup-restore.md` — detailed backup and restore runbook.
- `docs/production-readiness-checklist.md` — production readiness and closure
  checklist.
- `deploy/production/app.env.example` — production application env example.
- `deploy/production/backup.env.example` — automated backup env example.
- `deploy/production/systemd/egenlabs-production-backup.service` — backup
  systemd service.
- `deploy/production/systemd/egenlabs-production-backup.timer` — backup systemd
  timer.
- `scripts/deploy-production.sh` — guarded production deployment script.
- `scripts/backup-production.sh` — automated production backup script.
- `scripts/verify-production-backup-artifact.sh` — encrypted artifact
  verification script.
