# Production deployment runbook

## Purpose

This runbook deploys the accepted eGen Labs Web Platform release to the
isolated production stack. Production must never reuse staging secrets,
database volumes, storage paths, Compose project names, or Turnstile keys.

## Fixed production topology

- Compose project: `egenlabs-production`
- Repository: `/opt/egenlabs-production/app`
- Compose environment: `/etc/egenlabs-production/compose.env`
- Application environment: `/etc/egenlabs-production/app.env`
- Persistent storage: `/var/lib/egenlabs-production/storage`
- Backups: `/var/backups/egenlabs-production`
- Automated backup config: `/etc/egenlabs-production/backup.env`
- Automated backup timer: `egenlabs-production-backup.timer`
- Database: `egenlabs_production`
- Public domain: `egenlabs.eu`

PostgreSQL and the application do not publish host ports. Caddy is the only
public service and publishes ports 80 and 443.

## Preconditions

1. The exact release commit is accepted and its GitHub Actions quality gate is green.
2. The repository worktree is clean and detached at the accepted commit.
3. Production DNS points to the production VPS only when the cutover is approved.
4. `/etc/egenlabs-production/*.env` exists, is root-owned, mode `0600`, and contains no staging values.
5. The host has Docker Engine and Docker Compose available; Node.js is not required on the production host.
6. Production storage exists and is owned by UID/GID `1000:1000`.
7. A verified encrypted backup is stored outside the VPS.
8. Automated backup prerequisites are available before production closure: `age`, `rclone`, a public age recipient, private R2 destination and root-only `/etc/egenlabs-production/backup.env`.
9. Rollback commit and backup identifiers are recorded.
10. Ports 80 and 443 are available to the production stack.

## Configuration installation

Copy the examples without committing their resulting values:

```bash
sudo install -d -m 0750 /etc/egenlabs-production
sudo install -m 0600 deploy/production/compose.env.example   /etc/egenlabs-production/compose.env
sudo install -m 0600 deploy/production/app.env.example   /etc/egenlabs-production/app.env
sudo install -m 0600 deploy/production/backup.env.example   /etc/egenlabs-production/backup.env
sudoedit /etc/egenlabs-production/compose.env
sudoedit /etc/egenlabs-production/app.env
sudoedit /etc/egenlabs-production/backup.env
```

Create persistent paths:

```bash
sudo install -d -m 0750 -o 1000 -g 1000   /var/lib/egenlabs-production/storage
sudo install -d -m 0700   /var/backups/egenlabs-production
```

## Preflight

```bash
npm ci
npm run prisma:generate
npm run smoke:production-config
docker compose   --project-name egenlabs-production   --env-file /etc/egenlabs-production/compose.env   --file compose.production.yaml   config --quiet
```

Review the rendered configuration without printing secret values to reports.

## Deployment

Run from `/opt/egenlabs-production/app`:

```bash
sudo EXPECTED_COMMIT="$(git rev-parse HEAD)"   COMPOSE_ENV_FILE=/etc/egenlabs-production/compose.env   APP_ENV_FILE=/etc/egenlabs-production/app.env   bash scripts/deploy-production.sh
```

## Post-deployment verification

```bash
curl --fail --silent --show-error   https://egenlabs.eu/api/v1/health

sudo docker compose   --project-name egenlabs-production   --env-file /etc/egenlabs-production/compose.env   --file compose.production.yaml   ps
```

The deployment script checks application health through the container healthcheck
using Docker metadata. Do not install host-level Node.js just to satisfy the
deployment shell.

Run the public MVP smoke suite only after DNS and TLS are correct:

```bash
BASE_URL=https://egenlabs.eu npm run smoke:mvp
```

Confirm that direct Fito Gen download remains disabled unless separately
approved as a product release.

## Automated backup installation

Install the systemd units only after the automated backup operations commit is
accepted and synced to the production VPS. This does not restart application
containers.

```bash
sudo install -m 0644 deploy/production/systemd/egenlabs-production-backup.service \
  /etc/systemd/system/egenlabs-production-backup.service
sudo install -m 0644 deploy/production/systemd/egenlabs-production-backup.timer \
  /etc/systemd/system/egenlabs-production-backup.timer
sudo systemctl daemon-reload
sudo systemctl enable --now egenlabs-production-backup.timer
```

Manual validation:

```bash
sudo systemctl start egenlabs-production-backup.service
sudo systemctl status egenlabs-production-backup.service --no-pager
systemctl list-timers egenlabs-production-backup.timer --no-pager
```

Do not include `/etc/egenlabs-production/backup.env`, rclone credentials, age
private identities, database dumps or plaintext backup payloads in reports.

## Rollback

Application rollback:

1. Stop Caddy only if the current release is unsafe to expose.
2. Check out the previously accepted commit.
3. Run `scripts/deploy-production.sh` with that exact `EXPECTED_COMMIT`.
4. Verify container and public health.
5. Do not reverse database migrations automatically.

Data rollback:

1. Stop application writes.
2. Preserve the failed state as a separate backup.
3. Follow `docs/operations-backup-restore.md`.
4. Restore only from a verified backup selected in the change record.
5. Run database and storage validation before reopening traffic.

## Evidence

Keep a redacted report containing:

- release commit,
- configuration smoke result,
- migration result,
- container health,
- public health,
- MVP smoke result,
- backup identifiers and checksums,
- rollback target.

Never include secrets, full download URLs, database dumps, or environment file
contents in the report.
