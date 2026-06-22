# MVP Release Checkpoint

Dokument operacyjny dla bieżącego baseline Web MVP. Nie zastępuje `docs/living-specification.md`.

## Aktualny baseline

Baseline po DEC-026 obejmuje:

- public site i moduł Fito Gen Essentials,
- katalog GEN-FED / CMC-GEN 261 z 23 SKU,
- publiczne dokumenty v20,
- admin auth i chroniony panel,
- leady, zgody, formularze, e-mail i download flow,
- update/news/telemetry/feedback API,
- audit, CSV, backup i restore,
- GitHub Actions quality gate,
- zamknięty przegląd bezpieczeństwa z udokumentowanym RISK-SEC-001,
- lokalne ścieżki assetów ograniczone do `storage/`.


## Zaakceptowany model wdrożenia

- staging: osobny OVHcloud VPS-1, Ubuntu Server 24.04 LTS, Docker Compose,
- production: drugi osobny OVHcloud VPS-1, kupowany dopiero po staging GO,
- oba środowiska wyłącznie dla `egenlabs.eu`, z odrębnymi bazami, storage i sekretami,
- PostgreSQL bez publicznej ekspozycji,
- zaszyfrowane backupy aplikacyjne w prywatnym Cloudflare R2.

Otwarte P1 przed akceptacją stagingu:

- `STG-GAP-001` — brak implementacji Cloudflare Turnstile w formularzach i brak serwerowej walidacji Siteverify.

## Lokalny checkpoint

Uruchom PostgreSQL, migracje i dane startowe:

```bash
npm run db:up
npm run prisma:generate
npx prisma migrate deploy
npm run catalog:bootstrap
npm run content:bootstrap
npm run desktop:bootstrap
npm run pdf:bootstrap
```

Walidacja statyczna i build:

```bash
rm -rf .next
npm run typecheck
npm run lint
npm run smoke:storage-paths
npm run build
```

> Build wymaga działającej bazy, ponieważ wybrane strony publiczne pobierają treści podczas prerenderowania.

Uruchom aplikację:

```bash
npm run dev
```

W drugim terminalu:

```bash
npm run smoke:health
npm run smoke:mvp
npm run checkpoint:mvp
```

## Kontrola bezpieczeństwa przed release

### Gitleaks

```bash
docker run --rm \
  -v "$PWD:/repo" \
  ghcr.io/gitleaks/gitleaks:latest \
  git \
  --redact \
  --report-format json \
  --report-path /repo/gitleaks-report.json \
  --log-opts="--all" \
  /repo

rm -f gitleaks-report.json
```

### Zależności

```bash
npm audit
```

Kryterium Web MVP:

- 0 critical,
- 0 high,
- moderate wyłącznie po świadomej analizie i zapisie ryzyka,
- bez używania `npm audit fix --force` bez zatwierdzonego planu migracji.

## Ręczny checkpoint admina

### Uwierzytelnianie

- logowanie przez `/admin/login`,
- dostęp do `/admin`,
- logout i ponowna ochrona trasy,
- kontrola uprawnień Admin/Editor.

### Katalog i pobrania

- utworzenie metadanych buildu,
- aktywacja jednego buildu dla kombinacji product/edition/channel,
- ścieżka assetu wyłącznie `storage/builds/...`,
- test istniejącego pliku i bezpiecznego fallbacku,
- przegląd `/admin/downloads`.

### Leady, formularze i e-maile

- `/download/register`,
- lead i consent w `/admin/leads`,
- issuance i e-mail logs w `/admin/emails`,
- `/newsletter`, `/contact`, `/enterprise`,
- przegląd `/admin/forms`.

### Content i PDF

- `/admin/content`,
- FAQ i blog,
- `/admin/pdfs`,
- ścieżka PDF wyłącznie `storage/media/...`,
- `/one-pager/fito-gen-one-pager`,
- `/api/v1/pdf/download?slug=fito-gen-one-pager`.

### Desktop API

- `/admin/desktop`,
- `/admin/desktop/intake`,
- update, news, telemetry, feature requests i software demand.

### Operations

- `/admin/operations`,
- eksport CSV,
- backup DB i storage,
- próbne odtworzenie poza repozytorium.

## Release readiness

MVP jest gotowy do produkcji, gdy:

- lokalny checkpoint i GitHub Actions są zielone,
- staging jest zaakceptowany według `docs/staging-readiness-checklist.md`,
- migracje przechodzą na świeżej bazie,
- formularze i e-maile działają end-to-end,
- role i prywatne zasoby są chronione,
- backup oraz restore zostały przetestowane,
- Git nie zawiera sekretów, backupów, dumpów ani eksportów,
- brak otwartych P0/P1,
- znane ryzyka są zapisane.

## Stan formalny przed produkcją

Do uzupełnienia przy wdrożeniu:

- Commit release:
- Data staging acceptance:
- Data produkcyjnego wdrożenia:
- Wynik produkcyjnego smoke testu:
- Wynik backupu:
- Wynik restore drill:
- Zaakceptowane P2:
- Tag release:
