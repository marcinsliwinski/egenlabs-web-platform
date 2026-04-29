#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_ID="$(date +%Y%m%d-%H%M%S)"

bash "${SCRIPT_DIR}/backup-postgres.sh" --backup-id="${BACKUP_ID}"
bash "${SCRIPT_DIR}/backup-storage.sh" --backup-id="${BACKUP_ID}"

echo "OK: Full backup completed under ../egenlabs-web-platform-backups/${BACKUP_ID} by default."
