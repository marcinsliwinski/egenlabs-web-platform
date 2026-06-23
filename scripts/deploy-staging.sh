#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_ENV_FILE="${COMPOSE_ENV_FILE:-/etc/egenlabs-staging/compose.env}"
APP_ENV_FILE="${APP_ENV_FILE:-/etc/egenlabs-staging/app.env}"
COMPOSE_FILE="${COMPOSE_FILE:-${PROJECT_ROOT}/compose.staging.yaml}"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-egenlabs-staging}"

compose() {
  sudo docker compose \
    --project-name "${PROJECT_NAME}" \
    --env-file "${COMPOSE_ENV_FILE}" \
    --file "${COMPOSE_FILE}" \
    "$@"
}

for required_file in "${COMPOSE_ENV_FILE}" "${APP_ENV_FILE}"; do
  if [[ ! -f "${required_file}" ]]; then
    echo "ERROR: Environment file not found: ${required_file}" >&2
    exit 1
  fi
done

export APP_ENV_FILE

if [[ -n "$(git -C "${PROJECT_ROOT}" status --porcelain)" ]]; then
  echo "ERROR: Refusing deployment from a dirty Git worktree." >&2
  exit 1
fi

COMMIT_SHA="$(git -C "${PROJECT_ROOT}" rev-parse --short=12 HEAD)"
COMMIT_SUBJECT="$(git -C "${PROJECT_ROOT}" log -1 --format=%s)"
export APP_IMAGE_TAG="${COMMIT_SHA}"

printf 'Deploying commit %s: %s\n' "${COMMIT_SHA}" "${COMMIT_SUBJECT}"

compose config --quiet
compose build migrate
compose up -d postgres

printf 'Waiting for PostgreSQL health...\n'
for attempt in $(seq 1 60); do
  if compose exec -T postgres sh -lc 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1'; then
    break
  fi

  if [[ "${attempt}" -eq 60 ]]; then
    echo "ERROR: PostgreSQL did not become healthy." >&2
    exit 1
  fi

  sleep 2
done

compose run --rm migrate
compose run --rm builder
compose up -d app

printf 'Waiting for application health...\n'
for attempt in $(seq 1 60); do
  if compose exec -T app node -e "fetch('http://127.0.0.1:3000/api/v1/health').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"; then
    break
  fi

  if [[ "${attempt}" -eq 60 ]]; then
    echo "ERROR: Application did not become healthy." >&2
    compose logs --tail=100 app
    exit 1
  fi

  sleep 2
done

compose up -d caddy
compose ps

printf 'Deployment completed for commit %s.\n' "${COMMIT_SHA}"
