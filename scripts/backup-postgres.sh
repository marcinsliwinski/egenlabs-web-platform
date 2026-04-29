#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./ops-backup-common.sh
source "${SCRIPT_DIR}/ops-backup-common.sh"

BACKUP_ID="$(parse_named_arg --backup-id "$@" || true)"
BACKUP_ID="${BACKUP_ID:-${DEFAULT_BACKUP_ID}}"
BACKUP_DIR="$(prepare_backup_directory "${BACKUP_ID}")"
DB_DIR="${BACKUP_DIR}/db"
DUMP_FILE="${DB_DIR}/postgres.sql"
mkdir -p "${DB_DIR}"

ensure_postgres_container
wait_for_postgres

write_backup_manifest "${BACKUP_DIR}" "backup-postgres.sh" "Plain SQL PostgreSQL backup created through docker compose exec."

docker compose exec -T postgres sh -lc 'export PGPASSWORD="$POSTGRES_PASSWORD"; pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --no-privileges' > "${DUMP_FILE}"

echo "OK: PostgreSQL backup created at ${DUMP_FILE}"
