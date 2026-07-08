# Backup and restore runbook

This runbook defines the accepted local and VPS-oriented backup/restore shell for the MVP.

## Scope

This shell covers:
- PostgreSQL database backups via `pg_dump`
- storage directory backups for `storage/builds` and `storage/media`
- manual restore steps for local or VPS-operated environments

This shell intentionally avoids:
- automatic scheduling
- object storage lifecycle automation
- backup retention orchestration
- in-app restore operations from the admin panel

## Default backup location

Backups are intentionally created **outside the Git repository**.

Default root:

```text
../egenlabs-web-platform-backups
```

You can override it per command by exporting `BACKUP_ROOT`, but it must still point outside the repository.

## Available scripts

```bash
npm run ops:backup:all
npm run ops:backup:db
npm run ops:backup:storage
npm run ops:restore:db -- --file=/path/to/postgres.sql
npm run ops:restore:storage -- --file=/path/to/storage.tar.gz
```

## Backup workflow

### 1. Full backup

```bash
npm run ops:backup:all
```

This creates a timestamped backup directory with:
- `db/postgres.sql`
- `storage/storage.tar.gz`
- `manifest.txt`

### 2. Database-only backup

```bash
npm run ops:backup:db
```

### 3. Storage-only backup

```bash
npm run ops:backup:storage
```


## Production root-owned backup verification

Production backup directories under `/var/backups/egenlabs-production` may be
owned by `root:root` and restricted to mode `0700`. Do not change ownership just
to verify checksums. Run directory-scoped checksum verification through `sudo
bash -c` instead:

```bash
sudo bash -c 'cd /var/backups/egenlabs-production/<backup-id> && sha256sum -c SHA256SUMS'
```

Use the same pattern for ad-hoc checksum generation inside a restricted backup
directory:

```bash
sudo bash -c 'cd /var/backups/egenlabs-production/<backup-id> && sha256sum db/postgres.sql storage/storage.tar.gz manifest.txt > SHA256SUMS'
```

Never print secrets, environment file contents, database dumps, or private
backup payloads in operational reports.

## Restore workflow

### 1. Restore PostgreSQL

```bash
npm run ops:restore:db -- --file=/absolute/or/relative/path/to/postgres.sql
```

This drops and recreates the target database before importing the SQL dump.

### 2. Restore storage

```bash
npm run ops:restore:storage -- --file=/absolute/or/relative/path/to/storage.tar.gz
```

The current `storage/` directory is moved aside to a preserved snapshot outside the repository before the archive is extracted.

## Operational notes

- Stop active local workflows before running a restore.
- Do not store backups inside the Git repository.
- Do not commit any SQL dumps, storage archives, or restored operational data.
- Run `npm run typecheck` and `npm run lint` after major operational changes when appropriate.
- Re-test health and key admin flows after a restore.

## Recommended post-restore checks

```bash
rm -rf .next
npx prisma generate
npm run typecheck
npm run lint
npm run dev
```

Then verify:
- `GET /api/v1/health`
- `GET /admin`
- `GET /admin/operations`
- `GET /admin/pdfs`
- `GET /admin/desktop/intake`

## Automated production backups — PROD-GAP-005

PROD-GAP-005 adds the repository baseline for automated production backups. It
must be installed on the production VPS only after the operations release commit
is green in CI and synced to `/opt/egenlabs-production/app`.

### Files

```text
scripts/backup-production.sh
scripts/verify-production-backup-artifact.sh
deploy/production/backup.env.example
deploy/production/systemd/egenlabs-production-backup.service
deploy/production/systemd/egenlabs-production-backup.timer
```

### Install configuration

Run on the production VPS from `/opt/egenlabs-production/app`:

```bash
sudo install -d -m 0750 /etc/egenlabs-production
sudo install -m 0600 deploy/production/backup.env.example /etc/egenlabs-production/backup.env
sudoedit /etc/egenlabs-production/backup.env
```

The real `/etc/egenlabs-production/backup.env` must remain `root:root` `0600`.
Do not print it in reports or chats.

Required operational values:

```text
AGE_RECIPIENT=<production public age recipient>
RCLONE_DESTINATION=<private R2 destination restricted to production/automated>
```

The production VPS should normally hold only the public age recipient. Do not
store the private age identity on the production VPS unless a separately accepted
restore-readiness drill requires it for a controlled test.

### Install systemd units

```bash
sudo install -m 0644 deploy/production/systemd/egenlabs-production-backup.service \
  /etc/systemd/system/egenlabs-production-backup.service
sudo install -m 0644 deploy/production/systemd/egenlabs-production-backup.timer \
  /etc/systemd/system/egenlabs-production-backup.timer
sudo systemctl daemon-reload
sudo systemctl enable --now egenlabs-production-backup.timer
```

The timer runs daily at `03:20 Europe/Warsaw` with up to 20 minutes of randomized
delay.

### Manual service test

```bash
sudo systemctl start egenlabs-production-backup.service
sudo systemctl status egenlabs-production-backup.service --no-pager
sudo journalctl -u egenlabs-production-backup.service -n 120 --no-pager
```

Reports may include only status lines, artifact names, file sizes and checksums
of encrypted artifacts. Never include environment file contents, database dumps,
private keys, R2 credentials or plaintext payloads.

### Timer verification

```bash
systemctl list-timers egenlabs-production-backup.timer --no-pager
systemctl cat egenlabs-production-backup.service
systemctl cat egenlabs-production-backup.timer
```

### Backup artifact contents

Each successful backup creates and encrypts a payload containing:

```text
db/postgres.sql
storage/storage.tar.gz
manifest.txt
SHA256SUMS
```

Plaintext work files are removed after successful encryption and upload. Failed
work directories are kept under a root-only diagnostics directory with limited
retention.

### Restore-readiness check

For download-back SHA verification:

```bash
sudo EGENLABS_BACKUP_CONFIG=/etc/egenlabs-production/backup.env \
  bash scripts/verify-production-backup-artifact.sh
```

For decrypt-and-list verification, run the same script on a secure host that has
access to the private age identity and set `AGE_IDENTITY_FILE` in a local
root-only config. The check must confirm the presence of:

```text
db/postgres.sql
storage/storage.tar.gz
manifest.txt
SHA256SUMS
```

This check does not restore into the production database.
