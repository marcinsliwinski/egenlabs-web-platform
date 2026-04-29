#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./ops-backup-common.sh
source "${SCRIPT_DIR}/ops-backup-common.sh"

require_command tar

ARCHIVE_FILE="$(parse_named_arg --file "$@" || true)"
if [[ -z "${ARCHIVE_FILE}" ]]; then
  echo "ERROR: Provide a storage archive with --file=/absolute/or/relative/path/to/storage.tar.gz" >&2
  exit 1
fi

if [[ ! -f "${ARCHIVE_FILE}" ]]; then
  echo "ERROR: Storage archive not found: ${ARCHIVE_FILE}" >&2
  exit 1
fi

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
CURRENT_STORAGE_DIR="${PROJECT_ROOT}/storage"
PRESERVED_STORAGE_DIR="${BACKUP_ROOT_REALPATH}/pre-restore-storage-${TIMESTAMP}"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TEMP_DIR}"' EXIT

tar -xzf "${ARCHIVE_FILE}" -C "${TEMP_DIR}"

if [[ ! -d "${TEMP_DIR}/storage" ]]; then
  echo "ERROR: Archive does not contain a top-level storage directory." >&2
  exit 1
fi

mkdir -p "${BACKUP_ROOT_REALPATH}"
if [[ -d "${CURRENT_STORAGE_DIR}" ]]; then
  mv "${CURRENT_STORAGE_DIR}" "${PRESERVED_STORAGE_DIR}"
fi

mv "${TEMP_DIR}/storage" "${CURRENT_STORAGE_DIR}"

echo "OK: Storage restore completed from ${ARCHIVE_FILE}"
echo "Previous storage snapshot preserved at ${PRESERVED_STORAGE_DIR}"
