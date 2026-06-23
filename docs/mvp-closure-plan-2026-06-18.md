# Plan zamknięcia eGen Labs Web MVP

Utworzono: 2026-06-18
Zaktualizowano: 2026-06-23 po doprecyzowaniu DEC-027


## Zaakceptowany baseline wdrożeniowy po DEC-027

- staging: odrębny OVHcloud VPS-2, 4 vCore, 8 GB RAM, 75 GB storage, Ubuntu Server 24.04 LTS,
- produkcja: drugi odrębny OVHcloud VPS-2 o tej samej konfiguracji, kupowany dopiero po staging GO,
- oba serwery przeznaczone wyłącznie dla `egenlabs.eu`,
- Docker Compose, Caddy jako jedyny publiczny reverse proxy na portach 80/443 i PostgreSQL bez publicznego portu,
- odrębne bazy, storage, sieci i sekrety,
- Cloudflare Free z TLS `Full (strict)`, osobnymi widgetami Turnstile oraz prywatnym R2 dla zaszyfrowanych backupów,
- STG-GAP-001, czyli brak rzeczywistej implementacji Turnstile w kodzie, pozostaje P1 blokującym formalną akceptację stagingu.

## Stan baseline po DEC-026

Zakończone:

- funkcjonalny core Web MVP,
- publiczna strona i finalny content/mobile pass,
- docelowy publiczny moduł Fito Gen Essentials,
- katalog GEN-FED / CMC-GEN 261 obejmujący 23 SKU,
- publiczna instrukcja i karta techniczna v20,
- kontakt, newsletter, formularze i download flow,
- panel administracyjny i API desktopowe,
- GitHub Actions quality gate,
- `SECURITY.md`, pełny Gitleaks i przegląd `npm audit`,
- aktualizacja Next.js do `16.2.9`,
- udokumentowanie RISK-SEC-001 dla PostCSS,
- ograniczenie ścieżek lokalnego storage,
- finalny przegląd wizualny bez otwartych uwag P0/P1.

Nie jest blockerem Web MVP:

- dodawanie zdjęć wszystkich modeli,
- finalny binarny build Fito Gen i aktywacja jego bezpośredniego publicznego pobrania,
- sklep, koszyk, płatności i zamówienia,
- panel uploadu i media manager,
- pełny Dictionary Package API.

## Etap 1 — lokalna walidacja DEC-026

1. Wgrać pakiet do repozytorium.
2. Uruchomić:

```bash
npm run prisma:generate
npm run typecheck
npm run lint
npm run smoke:storage-paths
```

3. Przy działającej bazie wykonać:

```bash
npm run build
npm run dev
```

4. W drugim terminalu:

```bash
npm run checkpoint:mvp
```

5. Wypchnąć commit i potwierdzić zielony GitHub Actions quality gate.

## Etap 2 — konfiguracja stagingu

1. Kupić wyłącznie stagingowy OVHcloud VPS-2 i zainstalować Ubuntu Server 24.04 LTS bez panelu hostingowego.
2. Skonfigurować domenę stagingową, Caddy i HTTPS.
3. Utworzyć PostgreSQL staging bez publicznego portu.
4. Zamontować trwały storage poza repozytorium i przygotować prywatny Cloudflare R2 jako zewnętrzny cel zaszyfrowanych backupów.
5. Skonfigurować sekrety i zmienne środowiskowe poza Git.
6. Uruchomić migracje oraz bootstrap danych.
7. Utworzyć silne konto administratora.
8. Wykorzystać `docs/staging-readiness-checklist.md` jako bramkę akceptacyjną.

## Etap 3 — integracje i testy stagingowe

Zweryfikować:

- Brevo i wysyłkę wiadomości testowych,
- Turnstile na wszystkich chronionych formularzach, w tym poprawną walidację Siteverify po stronie serwera oraz bezpieczne odrzucenie tokenu brakującego, błędnego, wygasłego i ponownie użytego,
- rejestrację pobrania, zgody oraz linki,
- istniejący asset i fallback brakującego assetu,
- publiczne PDF-y,
- panel administratora i role,
- desktop update/news/telemetry/feedback,
- log audytowy,
- backup bazy i storage,
- pełny restore oraz smoke test po odtworzeniu.

Staging jest zaakceptowany, gdy nie ma otwartych P0/P1, a wszystkie kryteria checklisty są spełnione lub jawnie zaakceptowane.

## Etap 4 — produkcja

Warunki wejścia:

- zielony CI dla commita release,
- zaakceptowany staging oraz osobno zaakceptowany zakup produkcyjnego OVHcloud VPS-2,
- 0 podatności critical/high,
- Gitleaks bez znalezisk,
- działające formularze i e-maile,
- działające backup i restore,
- poprawna domena, HTTPS i Cloudflare,
- potwierdzone sekrety produkcyjne poza repozytorium.

Po wdrożeniu:

1. uruchomić health i smoke testy produkcyjne,
2. sprawdzić logi aplikacji i e-maili,
3. zweryfikować katalog, PDF-y i formularze,
4. wykonać pierwszy backup produkcyjny,
5. zapisać commit, datę i wyniki w `docs/mvp-release-checkpoint.md`.

## Etap 5 — formalne zamknięcie MVP

- uzupełnić release checkpoint,
- dodać końcowy wpis do Decision Log,
- utworzyć tag release po osobnej akceptacji nazwy,
- zamknąć backlog Web MVP,
- przenieść pozostałe zadania do post-MVP / v1.

## Pierwszy backlog po MVP

- integracja finalnego klienta Fito Gen z Universal Desktop Support API v1,
- Dictionary Package API,
- aktywacja finalnego builda i linku Fito Gen,
- media produktowe kolejnych SKU,
- opcjonalny media manager,
- dalszy hardening auth i obserwowalności,
- decyzja dotycząca funkcji sprzedażowych.
