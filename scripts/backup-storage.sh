#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./ops-backup-common.sh
source "${SCRIPT_DIR}/ops-backup-common.sh"

require_command tar

BACKUP_ID="$(parse_named_arg --backup-id "$@" || true)"
BACKUP_ID="${BACKUP_ID:-${DEFAULT_BACKUP_ID}}"
BACKUP_DIR="$(prepare_backup_directory "${BACKUP_ID}")"
STORAGE_DIR="${BACKUP_DIR}/storage"
ARCHIVE_FILE="${STORAGE_DIR}/storage.tar.gz"
mkdir -p "${STORAGE_DIR}"

write_backup_manifest "${BACKUP_DIR}" "backup-storage.sh" "Storage archive backup created from project storage directory."

tar -czf "${ARCHIVE_FILE}" -C "${PROJECT_ROOT}" storage

echo "OK: Storage backup created at ${ARCHIVE_FILE}"
