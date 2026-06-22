# Checklista gotowości stagingu eGen Labs Web Platform

Dokument operacyjny. Nie zastępuje `docs/living-specification.md`.

## 1. Warunki wejścia

- [ ] `main` ma zielony GitHub Actions quality gate.
- [ ] Lokalny `npm run checkpoint:mvp` jest zielony.
- [ ] `npm run build` przechodzi przy działającej bazie.
- [ ] `npm audit` nie zgłasza critical ani high.
- [ ] Pełny skan Gitleaks historii Git nie wykrywa sekretów.
- [ ] Brak otwartych błędów P0 i P1.
- [ ] `git status --short` jest czysty.

## 2. Infrastruktura

- [ ] Utworzono odrębny stagingowy OVHcloud VPS-1 z Ubuntu Server 24.04 LTS, przeznaczony wyłącznie dla `egenlabs.eu`.
- [ ] Na stagingowym VPS nie działają workloady produkcyjne.
- [ ] Skonfigurowano HTTPS i docelową subdomenę stagingową.
- [ ] Cloudflare kieruje ruch wyłącznie do właściwego originu.
- [ ] PostgreSQL działa wyłącznie w prywatnej sieci Docker i nie jest publicznie dostępny z Internetu.
- [ ] Storage jest zamontowany poza repozytorium i ma katalogi `builds` oraz `media`.
- [ ] Proces aplikacji ma minimalne wymagane uprawnienia do storage.
- [ ] Skonfigurowano kontrolowany restart aplikacji.
- [ ] Skonfigurowano limity i rotację logów kontenerów.
- [ ] Produkcyjny VPS nie został zakupiony przed formalną decyzją staging GO.

## 3. Zmienne środowiskowe i sekrety

- [ ] `DATABASE_URL` wskazuje bazę stagingową.
- [ ] `AUTH_SECRET` jest losowy, unikalny i nieużywany lokalnie ani produkcyjnie.
- [ ] `APP_URL` i `BASE_URL` używają stagingowego HTTPS.
- [ ] Dane Brevo są przechowywane poza repozytorium.
- [ ] Stagingowe dane Turnstile są przechowywane poza repozytorium i nie są współdzielone z produkcją.
- [ ] Żaden sekret nie występuje w logach wdrożenia ani w plikach śledzonych przez Git.
- [ ] `.env` ma restrykcyjne uprawnienia systemowe.

## 4. Baza danych

- [ ] Utworzono pustą bazę stagingową.
- [ ] `npm run prisma:generate` przechodzi.
- [ ] `npx prisma migrate deploy` przechodzi bez migracji ad hoc.
- [ ] Wykonano bootstrap katalogu, treści, desktop news i PDF.
- [ ] Utworzono administratora z silnym, unikalnym hasłem.
- [ ] Zweryfikowano role `ADMIN` i `EDITOR`.

## 5. Aplikacja i quality gate

- [ ] `npm run typecheck` — PASS.
- [ ] `npm run lint` — PASS.
- [ ] `npm run smoke:storage-paths` — PASS.
- [ ] `npm run build` — PASS.
- [ ] `npm run smoke:health` — PASS.
- [ ] `npm run smoke:mvp` — PASS.
- [ ] Brak niekontrolowanych ostrzeżeń runtime.

## 6. Public site

- [ ] Strona główna działa na desktopie i urządzeniach mobilnych.
- [ ] Menu mobilne pokazuje wszystkie pozycje.
- [ ] Fito Gen Essentials jest prezentowany jako kompletny moduł produktowy.
- [ ] Katalog prezentuje dokładnie 23 zatwierdzone SKU.
- [ ] Nie występuje `GEN-FED 80-10 M µQRP`.
- [ ] Instrukcja i karta techniczna v20 pobierają się poprawnie.
- [ ] `/legal`, FAQ, blog, kontakt i newsletter działają.
- [ ] Brak publicznego języka wewnętrznego lub statusów projektowych.

## 7. Formularze i e-mail

- [ ] `STG-GAP-001` został usunięty: Turnstile jest zaimplementowany w UI i walidowany przez Siteverify po stronie serwera.
- [ ] Newsletter zapisuje dane i właściwą wersję zgody.
- [ ] Kontakt zapisuje zgłoszenie.
- [ ] Enterprise interest zapisuje zgłoszenie.
- [ ] Rejestracja pobrania zapisuje lead i zgody.
- [ ] Brevo wysyła wiadomości do kontrolowanych adresów testowych.
- [ ] Tryb `LOG_ONLY` nie jest przypadkowo aktywny, jeśli staging ma testować rzeczywistą wysyłkę.
- [ ] Widget Turnstile działa na wszystkich chronionych formularzach.
- [ ] Backend weryfikuje token Turnstile przez Siteverify przed zapisem danych lub wysłaniem e-maila.
- [ ] Brakujący, błędny, wygasły i ponownie użyty token jest bezpiecznie odrzucany.
- [ ] Awaria lub timeout Siteverify nie powoduje obejścia ochrony formularza.
- [ ] Logi nie ujawniają sekretów ani pełnych danych ponad niezbędny zakres.

## 8. Download i storage

- [ ] Metadane buildów używają ścieżek `storage/builds/...`.
- [ ] Dokumenty używają ścieżek `storage/media/...`.
- [ ] Ścieżki absolutne i traversal są odrzucane.
- [ ] Przetestowano pobranie istniejącego assetu.
- [ ] Przetestowano bezpieczny fallback przy brakującym assetcie.
- [ ] Prywatne assety nie są dostępne bez właściwej autoryzacji lub linku.

## 9. Panel administracyjny

- [ ] Logowanie i wylogowanie działają.
- [ ] Wygasła sesja nie daje dostępu do `/admin`.
- [ ] Editor nie wykonuje operacji wymagających Admina.
- [ ] Katalog, downloads, leads, emails, content, forms, desktop, PDFs i operations działają.
- [ ] Krytyczne operacje są zapisywane w logu audytowym.

## 10. API desktopowe

- [ ] Update endpoint zwraca poprawną odpowiedź.
- [ ] News endpoint zwraca poprawną odpowiedź.
- [ ] Telemetry intake waliduje i zapisuje dane.
- [ ] Feature request i software demand intake działają.
- [ ] Endpointy nie ujawniają ścieżek storage ani sekretów.

## 11. Backup i restore

- [ ] Wykonano backup bazy stagingowej.
- [ ] Wykonano backup storage stagingowego.
- [ ] Backup znajduje się poza repozytorium i poza stagingowym VPS.
- [ ] Backup jest zaszyfrowany przed wysłaniem do prywatnego Cloudflare R2.
- [ ] Zweryfikowano sumy kontrolne backupu po wysłaniu.
- [ ] Skonfigurowano retencję oraz kontrolę wykorzystania limitu R2.
- [ ] Wykonano próbne odtworzenie bazy.
- [ ] Wykonano próbne odtworzenie storage.
- [ ] Po restore health i smoke testy są zielone.

## 12. Akceptacja stagingu

- [ ] Brak błędów P0/P1.
- [ ] Lista P2 jest udokumentowana i nie blokuje produkcji.
- [ ] Wyniki testów oraz data są zapisane w release checkpoint.
- [ ] Staging został zaakceptowany przed produkcją.
