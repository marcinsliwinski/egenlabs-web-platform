#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

CONFIG_FILE="${EGENLABS_BACKUP_CONFIG:-/etc/egenlabs-production/backup.env}"
ARTIFACT_NAME=""

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

parse_args() {
  for argument in "$@"; do
    case "${argument}" in
      --artifact=*) ARTIFACT_NAME="${argument#--artifact=}" ;;
      --config=*) CONFIG_FILE="${argument#--config=}" ;;
      *) fail "Unknown argument: ${argument}" ;;
    esac
  done
}

load_config() {
  [[ -f "${CONFIG_FILE}" ]] || fail "Missing backup config file: ${CONFIG_FILE}"

  set -a
  # shellcheck disable=SC1090
  source "${CONFIG_FILE}"
  set +a
}

parse_args "$@"
load_config

BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/egenlabs-production/automated}"
RESTORE_READINESS_ROOT="${RESTORE_READINESS_ROOT:-/var/backups/egenlabs-production/restore-readiness}"
RCLONE_DESTINATION="${RCLONE_DESTINATION:-}"
AGE_IDENTITY_FILE="${AGE_IDENTITY_FILE:-}"

[[ -n "${RCLONE_DESTINATION}" ]] || fail "RCLONE_DESTINATION is required in ${CONFIG_FILE}."

require_command rclone
require_command sha256sum
require_command tar
require_command grep
require_command sort
require_command tail

install -d -m 0700 "${RESTORE_READINESS_ROOT}"

if [[ -z "${ARTIFACT_NAME}" ]]; then
  ARTIFACT_NAME="$(rclone lsf --files-only "${RCLONE_DESTINATION}" \
    --include '*.tar.gz.age' \
    --exclude '*' \
    | sort \
    | tail -n 1)"
fi

[[ -n "${ARTIFACT_NAME}" ]] || fail "No encrypted backup artifact found in remote destination."
[[ "${ARTIFACT_NAME}" == *.tar.gz.age ]] || fail "Artifact name must end with .tar.gz.age."

CHECK_ID="$(date -u +%Y%m%d-%H%M%S)"
CHECK_DIR="${RESTORE_READINESS_ROOT}/${CHECK_ID}"
install -d -m 0700 "${CHECK_DIR}"

info "== eGen Labs production backup restore-readiness check =="
info "Artifact: ${ARTIFACT_NAME}"
info "Check directory: ${CHECK_DIR}"

info "== Download encrypted artifact and SHA256 sidecar =="
rclone copyto "${RCLONE_DESTINATION}/${ARTIFACT_NAME}" "${CHECK_DIR}/${ARTIFACT_NAME}"
rclone copyto "${RCLONE_DESTINATION}/${ARTIFACT_NAME}.sha256" "${CHECK_DIR}/${ARTIFACT_NAME}.sha256"

info "== Verify encrypted artifact SHA256 =="
(
  cd "${CHECK_DIR}"
  sha256sum -c "${ARTIFACT_NAME}.sha256"
)

if [[ -n "${AGE_IDENTITY_FILE}" && -f "${AGE_IDENTITY_FILE}" ]]; then
  require_command age

  info "== Decrypt and verify tar listing =="
  age --decrypt --identity "${AGE_IDENTITY_FILE}" \
    --output "${CHECK_DIR}/payload.tar.gz" \
    "${CHECK_DIR}/${ARTIFACT_NAME}"

  tar -tzf "${CHECK_DIR}/payload.tar.gz" > "${CHECK_DIR}/payload-list.txt"

  grep -Fx 'db/postgres.sql' "${CHECK_DIR}/payload-list.txt" >/dev/null
  grep -Fx 'storage/storage.tar.gz' "${CHECK_DIR}/payload-list.txt" >/dev/null
  grep -Fx 'manifest.txt' "${CHECK_DIR}/payload-list.txt" >/dev/null
  grep -Fx 'SHA256SUMS' "${CHECK_DIR}/payload-list.txt" >/dev/null

  info "RESTORE-READINESS: PASS"
  info "DECRYPTION AND TAR LISTING: PASS"
else
  info "RESTORE-READINESS: PARTIAL PASS"
  info "DOWNLOAD-BACK SHA256: PASS"
  info "Decrypt/list check skipped because AGE_IDENTITY_FILE is not configured on this host."
fi
