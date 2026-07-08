#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

CONFIG_FILE="${EGENLABS_BACKUP_CONFIG:-/etc/egenlabs-production/backup.env}"
WORK_DIR=""
BUNDLE_FILE=""
SUCCESS="false"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

info() {
  printf '%s\n' "$*"
}

require_command() {
  local command_name="$1"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    fail "Required command not found: ${command_name}"
  fi
}

positive_integer() {
  local value="$1"
  [[ "${value}" =~ ^[0-9]+$ ]] || return 1
  [[ "${value}" -gt 0 ]] || return 1
}

load_config() {
  [[ -f "${CONFIG_FILE}" ]] || fail "Missing backup config file: ${CONFIG_FILE}"

  # The config file is root-only in production and may contain operational
  # destinations. Never print its contents.
  set -a
  # shellcheck disable=SC1090
  source "${CONFIG_FILE}"
  set +a
}

safe_backup_id() {
  date -u +%Y%m%d-%H%M%S
}

compose() {
  docker compose \
    --project-name "${COMPOSE_PROJECT}" \
    --env-file "${COMPOSE_ENV_FILE}" \
    --file "${COMPOSE_FILE}" \
    "$@"
}

container_id_for() {
  local service_name="$1"
  compose ps --quiet "${service_name}" 2>/dev/null | head -n 1 || true
}

container_health_status() {
  local container_id="$1"

  docker inspect \
    --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    "${container_id}" 2>/dev/null || true
}

ensure_container_healthy() {
  local service_name="$1"
  local container_id=""
  local state=""
  local health=""

  container_id="$(container_id_for "${service_name}")"
  [[ -n "${container_id}" ]] || fail "Compose service is not running: ${service_name}"

  state="$(docker inspect --format '{{.State.Status}}' "${container_id}" 2>/dev/null || true)"
  health="$(container_health_status "${container_id}")"

  [[ "${state}" == "running" ]] || fail "Container ${service_name} is not running."
  [[ "${health}" == "healthy" || "${health}" == "running" ]] || \
    fail "Container ${service_name} health is ${health:-unknown}."
}

write_manifest() {
  local manifest_file="$1"
  local repo_commit="unknown"
  local app_image="unknown"
  local postgres_image="unknown"

  if git -C "${APP_DIR}" rev-parse HEAD >/dev/null 2>&1; then
    repo_commit="$(git -C "${APP_DIR}" rev-parse HEAD)"
  fi

  app_image="$(compose ps --format '{{.Image}}' app 2>/dev/null | head -n 1 || true)"
  postgres_image="$(compose ps --format '{{.Image}}' postgres 2>/dev/null | head -n 1 || true)"

  cat > "${manifest_file}" <<MANIFEST
Project: eGen Labs Web Platform
Environment: production
Backup ID: ${BACKUP_ID}
Created at UTC: $(date -u --iso-8601=seconds)
Created by: scripts/backup-production.sh
Host: $(hostname)
Repository: ${APP_DIR}
Repository commit: ${repo_commit}
Compose project: ${COMPOSE_PROJECT}
Compose file: ${COMPOSE_FILE}
Storage root: ${STORAGE_ROOT}
Application image: ${app_image:-unknown}
PostgreSQL image: ${postgres_image:-unknown}
Includes:
- db/postgres.sql
- storage/storage.tar.gz
- manifest.txt
- SHA256SUMS
Notes: Encrypted before offsite upload. Secrets and plaintext payloads must not be printed in logs.
MANIFEST
}

cleanup_failed_workdirs() {
  local keep_count="${FAILED_WORKDIR_KEEP:-2}"

  positive_integer "${keep_count}" || keep_count="2"
  [[ -d "${FAILED_ROOT}" ]] || return 0

  find "${FAILED_ROOT}" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -nr \
    | awk -v keep="${keep_count}" 'NR > keep {print substr($0, index($0,$2))}' \
    | while IFS= read -r old_dir; do
        [[ -n "${old_dir}" ]] && rm -rf -- "${old_dir}"
      done
}

on_error() {
  local exit_code="$?"

  if [[ "${SUCCESS}" == "true" ]]; then
    exit "${exit_code}"
  fi

  if [[ -n "${WORK_DIR}" && -d "${WORK_DIR}" ]]; then
    mkdir -p "${FAILED_ROOT}"
    chmod 0700 "${FAILED_ROOT}"
    local failed_target="${FAILED_ROOT}/${BACKUP_ID}"
    rm -rf -- "${failed_target}"
    mv "${WORK_DIR}" "${failed_target}"
    info "FAILED: plaintext work directory preserved root-only for diagnostics: ${failed_target}"
    cleanup_failed_workdirs || true
  fi

  if [[ -n "${BUNDLE_FILE}" && -f "${BUNDLE_FILE}" ]]; then
    rm -f -- "${BUNDLE_FILE}"
  fi

  info "FAILED: automated production backup did not complete."
  exit "${exit_code}"
}

trap on_error ERR

[[ "$(id -u)" -eq 0 ]] || fail "Production backup must run as root."

load_config

APP_DIR="${APP_DIR:-/opt/egenlabs-production/app}"
COMPOSE_PROJECT="${COMPOSE_PROJECT:-egenlabs-production}"
COMPOSE_FILE="${COMPOSE_FILE:-compose.production.yaml}"
COMPOSE_ENV_FILE="${COMPOSE_ENV_FILE:-/etc/egenlabs-production/compose.env}"
STORAGE_ROOT="${STORAGE_ROOT:-/var/lib/egenlabs-production/storage}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/egenlabs-production/automated}"
RCLONE_DESTINATION="${RCLONE_DESTINATION:-}"
AGE_RECIPIENT="${AGE_RECIPIENT:-}"
LOCAL_RETENTION_DAYS="${LOCAL_RETENTION_DAYS:-14}"
REMOTE_RETENTION_DAYS="${REMOTE_RETENTION_DAYS:-30}"
REMOTE_RETENTION_ENABLED="${REMOTE_RETENTION_ENABLED:-true}"
FAILED_WORKDIR_KEEP="${FAILED_WORKDIR_KEEP:-2}"
BACKUP_ID="${BACKUP_ID:-$(safe_backup_id)}"

[[ -n "${AGE_RECIPIENT}" ]] || fail "AGE_RECIPIENT is required in ${CONFIG_FILE}."
[[ -n "${RCLONE_DESTINATION}" ]] || fail "RCLONE_DESTINATION is required in ${CONFIG_FILE}."
positive_integer "${LOCAL_RETENTION_DAYS}" || fail "LOCAL_RETENTION_DAYS must be a positive integer."
positive_integer "${REMOTE_RETENTION_DAYS}" || fail "REMOTE_RETENTION_DAYS must be a positive integer."
positive_integer "${FAILED_WORKDIR_KEEP}" || fail "FAILED_WORKDIR_KEEP must be a positive integer."
[[ "${BACKUP_ID}" =~ ^[0-9]{8}-[0-9]{6}$ ]] || fail "BACKUP_ID must match YYYYMMDD-HHMMSS."

require_command docker
require_command tar
require_command gzip
require_command sha256sum
require_command age
require_command rclone
require_command find
require_command awk
require_command sort
require_command du
require_command hostname

[[ -d "${APP_DIR}" ]] || fail "Missing app directory: ${APP_DIR}"
[[ -f "${APP_DIR}/${COMPOSE_FILE}" ]] || fail "Missing compose file: ${APP_DIR}/${COMPOSE_FILE}"
[[ -f "${COMPOSE_ENV_FILE}" ]] || fail "Missing compose env file: ${COMPOSE_ENV_FILE}"
[[ -d "${STORAGE_ROOT}" ]] || fail "Missing storage root: ${STORAGE_ROOT}"

cd "${APP_DIR}"

WORK_ROOT="${BACKUP_ROOT}/work"
FAILED_ROOT="${BACKUP_ROOT}/failed"
ENCRYPTED_ROOT="${BACKUP_ROOT}/encrypted"
WORK_DIR="${WORK_ROOT}/${BACKUP_ID}"
DB_DIR="${WORK_DIR}/db"
STORAGE_DIR="${WORK_DIR}/storage"
MANIFEST_FILE="${WORK_DIR}/manifest.txt"
CHECKSUM_FILE="${WORK_DIR}/SHA256SUMS"
BUNDLE_FILE="${BACKUP_ROOT}/egenlabs-production-backup-${BACKUP_ID}.tar.gz"
ENCRYPTED_FILE="${ENCRYPTED_ROOT}/egenlabs-production-backup-${BACKUP_ID}.tar.gz.age"
ENCRYPTED_SHA_FILE="${ENCRYPTED_FILE}.sha256"

info "== eGen Labs automated production backup =="
info "Backup ID: ${BACKUP_ID}"
info "Backup root: ${BACKUP_ROOT}"
info "Remote destination: ${RCLONE_DESTINATION}"

install -d -m 0700 "${BACKUP_ROOT}" "${WORK_ROOT}" "${FAILED_ROOT}" "${ENCRYPTED_ROOT}"
install -d -m 0700 "${DB_DIR}" "${STORAGE_DIR}"

info "== Validate production containers =="
compose config --quiet
ensure_container_healthy postgres
ensure_container_healthy app

info "== Create PostgreSQL dump =="
docker compose \
  --project-name "${COMPOSE_PROJECT}" \
  --env-file "${COMPOSE_ENV_FILE}" \
  --file "${COMPOSE_FILE}" \
  exec -T postgres sh -lc \
  'export PGPASSWORD="$POSTGRES_PASSWORD"; pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --no-privileges' \
  > "${DB_DIR}/postgres.sql"

[[ -s "${DB_DIR}/postgres.sql" ]] || fail "PostgreSQL dump is empty."

info "== Create storage archive =="
tar -czf "${STORAGE_DIR}/storage.tar.gz" -C "$(dirname "${STORAGE_ROOT}")" "$(basename "${STORAGE_ROOT}")"
[[ -s "${STORAGE_DIR}/storage.tar.gz" ]] || fail "Storage archive is empty."

info "== Write manifest and checksums =="
write_manifest "${MANIFEST_FILE}"
(
  cd "${WORK_DIR}"
  sha256sum db/postgres.sql storage/storage.tar.gz manifest.txt > SHA256SUMS
  sha256sum -c SHA256SUMS >/dev/null
)

info "== Bundle plaintext payload locally =="
tar -czf "${BUNDLE_FILE}" -C "${WORK_DIR}" db storage manifest.txt SHA256SUMS
[[ -s "${BUNDLE_FILE}" ]] || fail "Plaintext bundle was not created."

info "== Encrypt backup bundle =="
age --recipient "${AGE_RECIPIENT}" --output "${ENCRYPTED_FILE}" "${BUNDLE_FILE}"
[[ -s "${ENCRYPTED_FILE}" ]] || fail "Encrypted backup artifact was not created."
sha256sum "${ENCRYPTED_FILE}" > "${ENCRYPTED_SHA_FILE}"

info "== Upload encrypted backup to R2-compatible remote =="
rclone copyto "${ENCRYPTED_FILE}" "${RCLONE_DESTINATION}/$(basename "${ENCRYPTED_FILE}")"
rclone copyto "${ENCRYPTED_SHA_FILE}" "${RCLONE_DESTINATION}/$(basename "${ENCRYPTED_SHA_FILE}")"

info "== Verify uploaded object names =="
rclone lsf --files-only "${RCLONE_DESTINATION}" | grep -Fx "$(basename "${ENCRYPTED_FILE}")" >/dev/null
rclone lsf --files-only "${RCLONE_DESTINATION}" | grep -Fx "$(basename "${ENCRYPTED_SHA_FILE}")" >/dev/null

info "== Apply local encrypted retention =="
find "${ENCRYPTED_ROOT}" -type f \
  \( -name '*.tar.gz.age' -o -name '*.tar.gz.age.sha256' \) \
  -mtime "+${LOCAL_RETENTION_DAYS}" -delete

if [[ "${REMOTE_RETENTION_ENABLED}" == "true" ]]; then
  info "== Apply remote encrypted retention under automated prefix only =="
  rclone delete "${RCLONE_DESTINATION}" \
    --min-age "${REMOTE_RETENTION_DAYS}d" \
    --include '*.tar.gz.age' \
    --include '*.tar.gz.age.sha256' \
    --exclude '*'
fi

info "== Remove plaintext work files =="
rm -rf -- "${WORK_DIR}"
rm -f -- "${BUNDLE_FILE}"
WORK_DIR=""
BUNDLE_FILE=""
SUCCESS="true"

info "Encrypted artifact: ${ENCRYPTED_FILE}"
info "Encrypted SHA256: $(cut -d ' ' -f 1 "${ENCRYPTED_SHA_FILE}")"
info "Encrypted size bytes: $(stat -c '%s' "${ENCRYPTED_FILE}")"
info "STEP PROD-GAP-005 BACKUP COMPLETED"
info "AUTOMATED PRODUCTION BACKUP: PASS"
