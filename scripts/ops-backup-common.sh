#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_BACKUP_ROOT="$(cd "${PROJECT_ROOT}/.." && pwd)/egenlabs-web-platform-backups"
BACKUP_ROOT="${BACKUP_ROOT:-${DEFAULT_BACKUP_ROOT}}"
BACKUP_ROOT_REALPATH="$(python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "${BACKUP_ROOT}")"
PROJECT_ROOT_REALPATH="$(python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "${PROJECT_ROOT}")"
DEFAULT_BACKUP_ID="$(date +%Y%m%d-%H%M%S)"

if [[ "${BACKUP_ROOT_REALPATH}" == "${PROJECT_ROOT_REALPATH}" || "${BACKUP_ROOT_REALPATH}" == "${PROJECT_ROOT_REALPATH}"/* ]]; then
  echo "ERROR: BACKUP_ROOT must be outside the Git repository." >&2
  echo "Current BACKUP_ROOT: ${BACKUP_ROOT_REALPATH}" >&2
  exit 1
fi

require_command() {
  local command_name="$1"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "ERROR: Required command not found: ${command_name}" >&2
    exit 1
  fi
}

ensure_postgres_container() {
  require_command docker
  docker compose up -d postgres >/dev/null
}

wait_for_postgres() {
  local retries=30
  local delay_seconds=2

  for ((attempt=1; attempt<=retries; attempt++)); do
    if docker compose exec -T postgres sh -lc 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1'; then
      return 0
    fi
    sleep "${delay_seconds}"
  done

  echo "ERROR: PostgreSQL container did not become ready in time." >&2
  exit 1
}

parse_named_arg() {
  local expected_prefix="$1"
  shift

  for argument in "$@"; do
    if [[ "${argument}" == ${expected_prefix}=* ]]; then
      echo "${argument#${expected_prefix}=}"
      return 0
    fi
  done

  return 1
}

prepare_backup_directory() {
  local backup_id="$1"
  local backup_dir="${BACKUP_ROOT_REALPATH}/${backup_id}"
  mkdir -p "${backup_dir}"
  echo "${backup_dir}"
}

write_backup_manifest() {
  local backup_dir="$1"
  local created_by="$2"
  local notes="$3"
  cat > "${backup_dir}/manifest.txt" <<MANIFEST
Project: eGen Labs Web Platform
Created at: $(date --iso-8601=seconds)
Created by: ${created_by}
Backup root: ${BACKUP_ROOT_REALPATH}
Notes: ${notes}
MANIFEST
}
