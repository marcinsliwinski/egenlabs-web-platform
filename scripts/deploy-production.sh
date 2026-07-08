#!/usr/bin/env bash
set -euo pipefail
umask 077

PROJECT_NAME="${PROJECT_NAME:-egenlabs-production}"
COMPOSE_FILE="${COMPOSE_FILE:-compose.production.yaml}"
COMPOSE_ENV_FILE="${COMPOSE_ENV_FILE:-/etc/egenlabs-production/compose.env}"
APP_ENV_FILE="${APP_ENV_FILE:-/etc/egenlabs-production/app.env}"
EXPECTED_COMMIT="${EXPECTED_COMMIT:-}"
HEALTH_URL="${HEALTH_URL:-https://egenlabs.eu/api/v1/health}"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

[[ -n "$EXPECTED_COMMIT" ]] || fail "EXPECTED_COMMIT is required."
[[ -f "$COMPOSE_FILE" ]] || fail "Missing $COMPOSE_FILE."
[[ -f "$COMPOSE_ENV_FILE" ]] || fail "Missing $COMPOSE_ENV_FILE."
[[ -f "$APP_ENV_FILE" ]] || fail "Missing $APP_ENV_FILE."
[[ "$(git rev-parse HEAD)" == "$EXPECTED_COMMIT" ]] ||
  fail "HEAD does not match EXPECTED_COMMIT."
[[ -z "$(git status --porcelain)" ]] ||
  fail "Repository worktree is not clean."

case "$COMPOSE_ENV_FILE:$APP_ENV_FILE" in
  *staging*) fail "Staging configuration path is forbidden." ;;
esac

compose() {
  docker compose     --project-name "$PROJECT_NAME"     --env-file "$COMPOSE_ENV_FILE"     --file "$COMPOSE_FILE"     "$@"
}

container_health_status() {
  local service_name="$1"
  local container_id=""
  local status=""

  container_id="$(compose ps --quiet "$service_name" 2>/dev/null | head -n 1 || true)"

  if [[ -z "$container_id" ]]; then
    printf 'missing'
    return 0
  fi

  status="$(
    docker inspect \
      --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
      "$container_id" 2>/dev/null || true
  )"

  printf '%s' "${status:-unknown}"
}

printf '=== VALIDATE CONFIGURATION ===\n'
compose config --quiet

printf '=== BUILD APPLICATION IMAGE ===\n'
compose --profile ops build migrate

printf '=== START DATABASE ===\n'
compose up --detach postgres

printf '=== APPLY DATABASE MIGRATIONS ===\n'
compose --profile ops run --rm migrate

printf '=== BUILD NEXT.JS OUTPUT ===\n'
compose --profile ops run --rm builder

printf '=== START APPLICATION ===\n'
compose up --detach app

printf '=== WAIT FOR APPLICATION HEALTH ===\n'
for attempt in $(seq 1 60); do
  status="$(container_health_status app)"

  printf 'Attempt %s/60 — app health: %s\n' "$attempt" "${status:-unknown}"

  if [[ "$status" == "healthy" ]]; then
    break
  fi

  sleep 5
done

[[ "${status:-}" == "healthy" ]] ||
  fail "Application container did not become healthy."

printf '=== START PUBLIC REVERSE PROXY ===\n'
compose up --detach caddy

printf '=== VERIFY PUBLIC HEALTH ===\n'
for attempt in $(seq 1 60); do
  if curl --fail --silent --show-error --max-time 15 "$HEALTH_URL" >/dev/null; then
    printf 'Public health check passed.\n'
    break
  fi

  if [[ "$attempt" -eq 60 ]]; then
    fail "Public health endpoint did not become available."
  fi

  sleep 5
done

printf '=== FINAL STATUS ===\n'
compose ps
