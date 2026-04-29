#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./ops-backup-common.sh
source "${SCRIPT_DIR}/ops-backup-common.sh"

DUMP_FILE="$(parse_named_arg --file "$@" || true)"
if [[ -z "${DUMP_FILE}" ]]; then
  echo "ERROR: Provide a dump file with --file=/absolute/or/relative/path/to/postgres.sql" >&2
  exit 1
fi

if [[ ! -f "${DUMP_FILE}" ]]; then
  echo "ERROR: Dump file not found: ${DUMP_FILE}" >&2
  exit 1
fi

ensure_postgres_container
wait_for_postgres

docker compose exec -T postgres sh -lc 'export PGPASSWORD="$POSTGRES_PASSWORD"; psql -U "$POSTGRES_USER" -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS \"${POSTGRES_DB}\" WITH (FORCE);" -c "CREATE DATABASE \"${POSTGRES_DB}\";"'

cat "${DUMP_FILE}" | docker compose exec -T postgres sh -lc 'export PGPASSWORD="$POSTGRES_PASSWORD"; psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1'

echo "OK: PostgreSQL restore completed from ${DUMP_FILE}"
