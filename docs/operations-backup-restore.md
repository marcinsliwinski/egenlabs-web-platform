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
