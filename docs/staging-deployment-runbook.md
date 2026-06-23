# Runbook wdrożenia stagingu eGen Labs

## Cel

Dokument opisuje kontrolowane wdrożenie `staging.egenlabs.eu` na odrębnym OVHcloud VPS-2 z Ubuntu Server 24.04 LTS, Docker Compose, Caddy, Next.js i PostgreSQL.

## Zaakceptowana topologia

```text
Internet
  -> Cloudflare DNS/proxy
  -> Caddy na portach 80/443
  -> aplikacja Next.js w prywatnej sieci Compose
  -> PostgreSQL w wewnętrznej sieci Compose bez opublikowanego portu
```

- Kod: `/opt/egenlabs-staging/app`.
- Trwały storage: `/var/lib/egenlabs-staging/storage`.
- Konfiguracja Compose: `/etc/egenlabs-staging/compose.env`; sekrety aplikacji: `/etc/egenlabs-staging/app.env`. Oba pliki mają właściciela `root:root` i tryb `0600`.
- Lokalne backupy robocze: `/var/backups/egenlabs-staging`.
- Caddy przechowuje certyfikaty i stan ACME w wolumenie Docker `caddy_data`.

## Warunki wejścia

- Repozytorium jest czyste i wskazuje zaakceptowany commit.
- UFW dopuszcza `22/tcp`, `80/tcp` i `443/tcp`.
- `staging.egenlabs.eu` wskazuje na IPv4 VPS.
- Porty 80 i 443 są osiągalne z Internetu.
- Pliki `/etc/egenlabs-staging/compose.env` i `/etc/egenlabs-staging/app.env` istnieją i nie znajdują się w repozytorium.
- Storage z repozytorium został skopiowany do `/var/lib/egenlabs-staging/storage`.

## Utworzenie pliku środowiskowego

1. Skopiuj przykład poza repozytorium:

```bash
sudo install -m 0600 -o root -g root \
  deploy/staging/compose.env.example \
  /etc/egenlabs-staging/compose.env

sudo install -m 0600 -o root -g root \
  deploy/staging/app.env.example \
  /etc/egenlabs-staging/app.env
```

2. Edytuj plik lokalnie na VPS:

```bash
sudoedit /etc/egenlabs-staging/compose.env
sudoedit /etc/egenlabs-staging/app.env
```

3. Wygeneruj wartości bez wklejania ich do czatu:

```bash
openssl rand -hex 32
openssl rand -base64 48
```

Pierwszy wynik może zostać użyty jako hasło PostgreSQL, a drugi jako `AUTH_SECRET`.

## Przygotowanie storage

```bash
install -d -m 0750 /var/lib/egenlabs-staging/storage
cp -an storage/. /var/lib/egenlabs-staging/storage/
```

Operacja `cp -an` nie nadpisuje istniejących plików.

## Walidacja konfiguracji przed wdrożeniem

```bash
sudo docker compose \
  --project-name egenlabs-staging \
  --env-file /etc/egenlabs-staging/compose.env \
  --file compose.staging.yaml \
  config --quiet
```

```bash
sudo docker run --rm \
  -e APP_DOMAIN=staging.egenlabs.eu \
  -e ACME_EMAIL=operations@example.com \
  -v "$PWD/deploy/staging/Caddyfile:/etc/caddy/Caddyfile:ro" \
  caddy:2.11.4-alpine \
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
```

## Wdrożenie

```bash
./scripts/deploy-staging.sh
```

Skrypt:

1. odrzuca wdrożenie z brudnego worktree,
2. waliduje Compose,
3. buduje obraz aplikacji,
4. uruchamia PostgreSQL i czeka na health check,
5. wykonuje `prisma migrate deploy`,
6. buduje Next.js przy działającej bazie,
7. uruchamia aplikację i sprawdza endpoint health,
8. uruchamia Caddy,
9. pokazuje stan usług.

## Walidacja po wdrożeniu

```bash
sudo docker compose \
  --project-name egenlabs-staging \
  --env-file /etc/egenlabs-staging/compose.env \
  --file compose.staging.yaml \
  ps
```

```bash
curl -fsS https://staging.egenlabs.eu/api/v1/health
```

```bash
BASE_URL=https://staging.egenlabs.eu npm run smoke:health
BASE_URL=https://staging.egenlabs.eu npm run smoke:mvp
```

```bash
sudo docker compose \
  --project-name egenlabs-staging \
  --env-file /etc/egenlabs-staging/compose.env \
  --file compose.staging.yaml \
  logs --tail=100 app caddy postgres
```

Logi należy przejrzeć przed udostępnieniem. Nie wolno publikować logów zawierających dane użytkowników lub sekrety.

## Rollback aplikacji

1. Przełącz repozytorium na poprzedni zaakceptowany commit.
2. Uruchom ponownie `./scripts/deploy-staging.sh`.
3. Jeżeli migracja była niekompatybilna wstecz, zastosuj zaakceptowaną procedurę restore do odrębnego celu. Nie wykonuj niekontrolowanego resetu bazy.

## Zatrzymanie stacku

```bash
sudo docker compose \
  --project-name egenlabs-staging \
  --env-file /etc/egenlabs-staging/compose.env \
  --file compose.staging.yaml \
  down
```

Polecenie nie usuwa wolumenów. Nie używaj `down -v`, ponieważ usuwa dane PostgreSQL, build Next.js i stan Caddy.
