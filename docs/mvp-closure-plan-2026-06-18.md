# Plan zamknięcia eGen Labs Web MVP

Data: 2026-06-18

## Stan wejściowy

- core Web MVP jest funkcjonalny,
- katalog GEN-FED / CMC-GEN obejmuje 23 zatwierdzone SKU,
- dokumentacja publiczna v20 jest dostępna,
- public site ma ukończony finalny content i mobile UX pass,
- katalog jest przygotowany do zdjęć bez panelu uploadu,
- Fito Gen Essentials pozostaje osobnym produktem desktopowym w przygotowaniu,
- sklep, koszyk i płatności pozostają poza MVP.

## Etap 1 — lokalna akceptacja DEC-023

1. Wgrać pakiet do repozytorium.
2. Uruchomić Prisma Client, typecheck i lint.
3. Uruchomić bazę oraz aplikację.
4. Wykonać pełny checkpoint MVP.
5. Sprawdzić ręcznie:
   - menu mobilne,
   - stronę główną,
   - `/products`,
   - GEN-FED 40-10 i 80-10,
   - CMC-GEN i Un-Un,
   - kontakt i newsletter,
   - dokumentację,
   - `/legal`.

## Etap 2 — końcowe QA wizualne i treściowe

1. Zebrać uwagi wyłącznie jako poprawki P0/P1/P2.
2. Nie dodawać nowych funkcji.
3. Zweryfikować:
   - wszystkie breakpointy mobilne,
   - kontrast i focus states,
   - długości nagłówków,
   - brak wewnętrznego języka projektowego,
   - spójność terminologii „Rozwiązania”, GEN-FED, CMC-GEN, Un-Un, Kit, S/M i linii mocy.
4. Zamknąć jeden finalny correction commit.

## Etap 3 — media produktowe

Katalog jest technicznie gotowy do zdjęć. Przed produkcją rekomendowane minimum:

- 1 zdjęcie linii GEN-FED,
- 1 zdjęcie serii 40-10,
- 1 zdjęcie serii 80-10,
- 1 zdjęcie linii CMC-GEN,
- 1 zdjęcie lub wizualizacja Fito Gen.

Zdjęcia każdego z 23 modeli można uzupełniać etapowo bez zmiany architektury. Wszystkie pliki muszą spełniać `docs/product-image-guidelines.md`.

## Etap 4 — bezpieczeństwo i zależności

1. Uruchomić skan historii Git narzędziem Gitleaks.
2. Zweryfikować `npm audit` bez automatycznego `--force`.
3. Potwierdzić brak sekretów i niepożądanych plików w `git status`.
4. Dodać `SECURITY.md`.
5. Włączyć GitHub secret scanning, push protection i Dependabot.

## Etap 5 — CI

Dodać GitHub Actions dla:

- `npm ci`,
- `npm run prisma:generate`,
- `npm run typecheck`,
- `npm run lint`,
- PostgreSQL service,
- migracji,
- uruchomienia aplikacji,
- `smoke:health`,
- `smoke:mvp`.

## Etap 6 — staging

1. Skonfigurować zmienne środowiskowe poza repozytorium.
2. Wdrożyć staging.
3. Uruchomić migracje.
4. Utworzyć silne konto administratora.
5. Skonfigurować Brevo, Cloudflare i Turnstile.
6. Wykonać smoke testy i ręczne QA.
7. Przetestować backup i restore.

## Etap 7 — produkcja

Warunki wejścia:

- brak otwartych P0 i P1,
- zielony CI i checkpoint,
- zaakceptowany staging,
- działające formularze i e-maile,
- działające PDF-y,
- skonfigurowany backup,
- potwierdzona domena i HTTPS.

Po wdrożeniu:

- produkcyjny smoke test,
- kontrola logów,
- kontrola formularzy,
- kontrola tras katalogowych,
- tag release po osobnej akceptacji nazwy.

## Etap 8 — formalne zamknięcie MVP

- uzupełnić `docs/mvp-release-checkpoint.md`,
- zapisać datę produkcyjnego release,
- dodać końcowy wpis do Decision Log,
- zamknąć visual launch backlog,
- przenieść dalsze prace do post-MVP / v1.

## Poza zamknięciem Web MVP

- finalny program Fito Gen Essentials i jego link pobrania,
- integracja klienta Fito Gen z Universal Desktop Support API v1,
- Dictionary Package API,
- sklep, koszyk i płatności,
- panel uploadu i media manager,
- pełne zdjęcia wszystkich modeli, jeśli nie będą gotowe na dzień startu.

## Update — 2026-06-18

Completed:

- DEC-024 compact typography and production-ready Fito Gen public module,
- DEC-025 GitHub Actions quality gate,
- repository `SECURITY.md`.

Remaining before MVP closure:

1. run the new CI workflow on GitHub and resolve any environment-specific failures,
2. complete the final desktop/mobile visual review,
3. add the minimum accepted product imagery,
4. review `npm audit` findings without using forced upgrades,
5. configure staging secrets and external integrations,
6. perform staging smoke, form, email, backup and restore tests,
7. deploy production and record the final release checkpoint.
