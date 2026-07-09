# Internal Admin User Manual – eGen Labs Web Platform

## 1. Cel manuala i zakres odpowiedzialności administratora

Ten dokument jest wewnętrznym manualem obsługi strony i panelu administracyjnego eGen Labs Web Platform po zamknięciu MVP produkcyjnego.
Manual opisuje aktualnie potwierdzone funkcje panelu administracyjnego oraz bezpieczne procedury operacyjne dla administratora.

Dokument rozróżnia trzy statusy funkcji:

- **Istnieje** – funkcja jest potwierdzona w aktualnym repozytorium i można ją opisywać jako dostępną.
- **Częściowe** – istnieje fundament lub konfiguracja, ale pełny workflow wymaga ręcznych kroków albo dalszego rozwoju.
- **Planowane post-MVP** – funkcja jest potrzebna biznesowo, ale nie wolno jej traktować jako wdrożonej.

Administrator odpowiada za:

- bieżącą kontrolę statusu panelu admina,
- aktualizację treści FAQ, bloga i desktop news,
- kontrolę leadów, zgód i publicznych formularzy,
- obsługę podstawowego download flow,
- kontrolę szablonów i logów e-mail,
- konfigurację metadanych PDF one-pagerów,
- przegląd telemetryki i feedbacku z aplikacji desktopowych,
- bezpieczne pobieranie eksportów CSV,
- zgłaszanie problemów technicznych przed zmianami produkcyjnymi.

Administrator nie powinien samodzielnie zmieniać kodu, sekretów, konfiguracji systemd, kontenerów, bazy danych ani plików produkcyjnych poza opisanymi procedurami i bez uzgodnionej decyzji operacyjnej.

## 2. Zasady bezpieczeństwa

Status: **istnieje jako obowiązująca praktyka operacyjna**.

Najważniejsze zasady:

1. Nie udostępniać konta administratora innym osobom.
2. Używać silnego, unikalnego hasła.
3. Nie wklejać do czatu, dokumentacji, issue, maili ani commitów sekretów, tokenów, haseł, plików `.env`, kluczy API, dumpów bazy, backupów ani pełnych logów z danymi wrażliwymi.
4. Nie pobierać eksportów CSV na urządzenia współdzielone lub niezabezpieczone.
5. Po pobraniu eksportu CSV traktować go jako dane operacyjne z potencjalnymi danymi osobowymi.
6. Nie używać funkcji resend e-maili bez sprawdzenia adresata, typu wiadomości i ryzyka ponownego wysłania linku.
7. Linki pobrania traktować jako wrażliwe dane operacyjne.
8. Nie aktywować download policy ani buildu, jeżeli plik buildu nie został fizycznie umieszczony w bezpiecznej lokalizacji storage i nie przeszedł walidacji.
9. Nie wykonywać restartu produkcji, deploymentu, migracji ani restore bez osobnej decyzji i procedury.
10. Nie używać panelu jako miejsca do przechowywania sekretów lub prywatnych notatek technicznych.

## 3. Logowanie do panelu

Status: **istnieje**.

Panel administracyjny jest dostępny pod trasą:

```text
/admin/login
```

Sposób logowania:

1. Otwórz `/admin/login`.
2. Podaj e-mail administratora.
3. Podaj hasło.
4. Po poprawnym logowaniu panel przekieruje do `/admin` albo do bezpiecznej trasy `next`, jeżeli była ustawiona.

Wylogowanie:

- z poziomu dashboardu `/admin` użyj formularza wylogowania,
- technicznie wylogowanie obsługuje endpoint `/api/v1/auth/logout`.

Role:

- `ADMIN` – pełny dostęp do funkcji zapisu tam, gdzie repo wymaga uprawnień administracyjnych, w szczególności buildy, download policies i resend e-maili.
- `EDITOR` – dostęp do panelu z ograniczeniami; w potwierdzonym baseline może przeglądać część danych, a część operacji zapisu jest zablokowana.

Ważne ograniczenia:

- reset hasła i 2FA są nadal obszarem dalszego hardeningu, a nie potwierdzoną funkcją panelu,
- nie tworzyć nowych kont ręcznie w bazie bez użycia zaakceptowanego skryptu lub procedury,
- nie przesyłać haseł przez e-mail lub komunikatory.

## 4. Dashboard `/admin`

Status: **istnieje**.

Dashboard pokazuje stan fundamentów produkcyjnej platformy. Na stronie `/admin` administrator widzi między innymi:

- aktualny e-mail i rolę zalogowanego użytkownika,
- liczbę buildów i aktywnych buildów,
- liczbę kombinacji gotowych do pobrania,
- liczbę logów e-mail,
- liczbę wpisów FAQ i opublikowanych wpisów bloga,
- liczbę skonfigurowanych i aktywnych PDF one-pagerów,
- liczbę zapisów newsletterowych,
- liczbę zgłoszeń kontaktowych i zapytań enterprise,
- liczbę desktop news items,
- liczbę telemetry events,
- liczbę feature requests i software demand requests,
- liczbę wpisów audit log.

Kiedy reagować:

- aktywny build istnieje, ale download policy nie jest gotowa – sprawdź `/admin/downloads`,
- rośnie liczba failed e-maili – sprawdź `/admin/emails`,
- pojawiają się error telemetry events – sprawdź `/admin/desktop/intake`,
- pojawiają się nowe leady lub zapytania – sprawdź `/admin/leads` i `/admin/forms`,
- audit log pokazuje nieoczekiwane operacje – przerwij dalsze zmiany i wyjaśnij zdarzenie.

Dashboard nie jest pełnym systemem monitoringu infrastruktury. Nie zastępuje healthchecków, logów kontenerów, backupów ani checklist produkcyjnych.

## 5. Product catalog `/admin/catalog`

Status: **częściowe**.

Panel katalogu pozwala zarządzać produktem, edycją, kanałem release i metadanymi buildów. Potwierdzone funkcje:

- przegląd produktów,
- przegląd edycji produktu,
- przegląd release channels,
- przegląd buildów,
- utworzenie builda,
- opcjonalne dodanie metadanych assetu buildu,
- aktywacja builda,
- dezaktywacja builda.

Operacje zapisu wymagają roli `ADMIN`. `EDITOR` ma tryb odczytu dla danych katalogowych.

### Build

Build opisuje wersję produktu desktopowego dla konkretnej kombinacji:

```text
Product / ProductEdition / ReleaseChannel
```

Najważniejsze pola:

- `version` – wersja aplikacji,
- `buildNumber` – dodatni numer builda, unikalny w ramach kombinacji product/edition/channel,
- `minSupportedVersion` – minimalna wspierana wersja, jeżeli dotyczy,
- `notes` – wewnętrzne notatki release,
- `activateNow` – czy build ma zostać aktywowany od razu.

### Build asset

Build asset opisuje plik, ale panel nie wykonuje fizycznego uploadu pliku. Potwierdzony baseline obsługuje tylko metadane:

- `fileName`,
- `storagePath`,
- `fileSizeBytes`,
- `checksumSha256`,
- `mimeType`.

Wymagana zasada storage:

```text
storage/builds/...
```

Ścieżka musi być relatywna względem katalogu storage i musi przejść walidację path confinement. Ścieżki absolutne, traversal i pliki spoza storage są zabronione.

### Ręczne dodanie pliku buildu do storage

Status: **częściowe, operacja techniczna poza panelem**.

Panel nie przesyła pliku na serwer. Plik musi zostać umieszczony w produkcyjnym storage przez osobę techniczną, bez commitowania go do repo.

Bezpieczny wzorzec operacyjny:

```bash
# Komputer lokalny administratora technicznego
sha256sum ./fito-gen-1.0.0.exe
scp ./fito-gen-1.0.0.exe egenlabs-production:/tmp/fito-gen-1.0.0.exe

# Production VPS
sudo mkdir -p /var/lib/egenlabs-production/storage/builds/fito-gen/1.0.0
sudo install -o 1000 -g 1000 -m 0644 \
  /tmp/fito-gen-1.0.0.exe \
  /var/lib/egenlabs-production/storage/builds/fito-gen/1.0.0/fito-gen-1.0.0.exe
sudo sha256sum /var/lib/egenlabs-production/storage/builds/fito-gen/1.0.0/fito-gen-1.0.0.exe
sudo rm -f /tmp/fito-gen-1.0.0.exe
```

Następnie w `/admin/catalog` wprowadź metadane:

```text
fileName: fito-gen-1.0.0.exe
storagePath: storage/builds/fito-gen/1.0.0/fito-gen-1.0.0.exe
checksumSha256: wynik sha256sum
mimeType: application/octet-stream
```

Nie aktywuj builda przed potwierdzeniem checksum i fizycznej obecności pliku.

## 6. Download policies `/admin/downloads`

Status: **częściowe**.

Panel download policies pozwala skonfigurować zasady pobierania dla kombinacji produktu, edycji i kanału.

Potwierdzone funkcje:

- przegląd configured policies,
- przegląd configured combinations,
- przegląd ready combinations,
- liczba download requests,
- liczba issued download links,
- konfiguracja policy mode,
- włączenie lub wyłączenie policy,
- wymaganie aktywnego builda,
- wymaganie rejestracji e-mail,
- TTL linku dla trybu temporary,
- internal notes.

Operacje zapisu wymagają roli `ADMIN`.

### Tryby i zasady

Panel używa `DownloadPolicyMode`. Administrator nie powinien zmieniać trybu bez zrozumienia skutków biznesowych:

- włączona polityka z aktywnym buildem może umożliwić użytkownikom przejście download flow,
- wymaganie e-mail registration wiąże pobranie z leadem i zgodą,
- TTL linku ogranicza czas ważności linku,
- wyłączenie polityki blokuje wydawanie nowych linków dla danej kombinacji.

Kiedy włączyć pobieranie:

1. Build jest finalny i zaakceptowany.
2. Plik buildu jest fizycznie w `storage/builds/...`.
3. Checksum SHA-256 zgadza się z metadanymi.
4. Jest aktywny build dla właściwej kombinacji.
5. Download policy wymaga e-mail registration, jeżeli pobranie ma być gated.
6. Transactional email działa w docelowym trybie transportu.
7. Wykonano test kontrolny na stagingu lub zgodnie z zaakceptowaną procedurą.

Kiedy wyłączyć pobieranie:

- build został wycofany,
- wykryto błąd bezpieczeństwa,
- nie zgadza się checksum,
- e-mail delivery generuje błędne lub niebezpieczne linki,
- release nie jest jeszcze publicznie zatwierdzony.

## 7. Leads and consents `/admin/leads`

Status: **istnieje**.

Panel pokazuje leady oraz zgody powiązane z download flow i komunikacją marketingową.

Pojęcia:

- `Lead` – rekord osoby lub adresu e-mail pozyskany przez formularz, download flow albo zapis newsletterowy.
- `ConsentDefinition` – definicja zgody.
- `ConsentRecord` – konkretny zapis zgody lub jej braku.
- `DownloadRequest` – żądanie pobrania produktu.

Co sprawdzać:

- czy lead ma poprawny adres e-mail,
- czy download consent został udzielony,
- czy marketing consent został udzielony oddzielnie,
- kiedy powstał ostatni download request,
- czy status requestu wygląda zgodnie z oczekiwaniem.

Zasada prywatności:

- nie eksportować leadów bez celu operacyjnego,
- nie kopiować danych osobowych do dokumentów technicznych,
- nie używać zgody download jako zgody newsletterowej,
- nie wysyłać kampanii marketingowej do osób bez aktywnej i potwierdzonej zgody.

## 8. Transactional emails `/admin/emails`

Status: **istnieje dla szablonów, logów i wybranego resend; newsletter campaigns są planowane post-MVP**.

Panel e-mail pozwala:

- przeglądać aktywne szablony transakcyjne,
- przeglądać recent email logs,
- widzieć status wysyłki,
- widzieć tryb transportu,
- sprawdzać provider metadata, jeżeli istnieją,
- wykonać resend wybranych wiadomości transakcyjnych.

Potwierdzone typy szablonów obejmują między innymi:

- `DOWNLOAD_WELCOME`,
- `DOWNLOAD_LINK`,
- `NEWSLETTER_CONFIRMATION`.

Statusy logów:

- `PENDING`,
- `SENT`,
- `FAILED`,
- `SKIPPED`.

Tryby transportu:

- `BREVO` – wysyłka przez Brevo,
- `LOG_ONLY` – tryb bez realnej wysyłki, używany do bezpiecznej walidacji.

### Resend

Resend wymaga roli `ADMIN`.

Przed resend sprawdź:

1. Do kogo idzie wiadomość.
2. Jaki to template key.
3. Czy wiadomość zawiera link pobrania.
4. Czy ponowne wysłanie nie stworzy niepożądanego skutku biznesowego.
5. Czy użytkownik oczekuje ponownej wiadomości.

Ograniczenia:

- logi `NEWSLETTER_CONFIRMATION` nie są resendowalne z panelu, ponieważ linki confirmation są redagowane,
- aby wysłać nową wiadomość potwierdzającą newsletter, użytkownik powinien ponownie użyć formularza newslettera,
- `DOWNLOAD_LINK` może zawierać wrażliwy URL pobrania i wymaga szczególnej ostrożności.

Newsletter campaigns nie są częścią aktualnego panelu. Obecny moduł obsługuje signup / double opt-in oraz e-maile transakcyjne, nie pełną wysyłkę kampanii.

## 9. Content management `/admin/content`

Status: **istnieje jako formularze textarea; WYSIWYG jest planowane post-MVP**.

Panel content pozwala zarządzać:

- FAQ entries,
- blog posts.

Potwierdzone funkcje:

- utworzenie FAQ entry,
- edycja FAQ entry,
- utworzenie blog post,
- edycja blog post,
- status `DRAFT` albo `PUBLISHED`,
- slug,
- sort order dla FAQ,
- excerpt i content dla bloga.

Ważne ograniczenie:

- panel nie ma jeszcze WYSIWYG,
- panel nie ma preview workflow,
- treść jest wprowadzana w zwykłych polach tekstowych,
- nie należy wklejać HTML, JavaScript ani osadzonych skryptów,
- dla treści publicznych stosować prosty, bezpieczny tekst.

### Zasady tworzenia FAQ

- Jedno pytanie powinno odpowiadać na jeden problem użytkownika.
- Slug powinien być krótki, małymi literami, bez polskich znaków, np. `jak-dziala-pobieranie`.
- Status `DRAFT` stosuj do treści roboczych.
- Status `PUBLISHED` stosuj dopiero po sprawdzeniu treści.
- `sortOrder` ustawiaj tak, aby najważniejsze pytania były wyżej.

### Zasady tworzenia blog post

- Tytuł powinien być zrozumiały bez kontekstu wewnętrznego.
- Excerpt powinien krótko wyjaśniać sens wpisu.
- Content powinien być tekstem publicznym, bez sekretów i bez danych technicznych z produkcji.
- Slug powinien być stabilny, bo zmiana sluga może zmienić adres wpisu.
- Publikuj dopiero po sprawdzeniu zgodności z wizerunkiem eGen Labs.

## 10. PDF one-pager management `/admin/pdfs`

Status: **częściowe**.

Panel PDF one-pager pozwala skonfigurować metadane PDF dla produktu.

Potwierdzone funkcje:

- konfiguracja tytułu,
- konfiguracja slug,
- konfiguracja opisu,
- konfiguracja visibility,
- konfiguracja fileName,
- konfiguracja storagePath,
- konfiguracja mimeType,
- enable/disable PDF,
- link do strony `/one-pager/[slug]`,
- link do endpointu `/api/v1/pdf/download?slug=...`.

Visibility:

- `PUBLIC` – PDF może być publicznie dostępny,
- `PRIVATE` – PDF nie powinien być traktowany jako publiczny materiał.

Ważne ograniczenie:

- panel nie wykonuje fizycznego uploadu PDF,
- panel zapisuje konfigurację i sprawdza istnienie pliku w storage,
- fizyczny plik musi zostać wcześniej umieszczony w `storage/media/...`.

### Ręczne dodanie PDF do storage

Status: **częściowe, operacja techniczna poza panelem**.

Bezpieczny wzorzec:

```bash
# Komputer lokalny administratora technicznego
sha256sum ./fito-gen-one-pager.pdf
scp ./fito-gen-one-pager.pdf egenlabs-production:/tmp/fito-gen-one-pager.pdf

# Production VPS
sudo mkdir -p /var/lib/egenlabs-production/storage/media
sudo install -o 1000 -g 1000 -m 0644 \
  /tmp/fito-gen-one-pager.pdf \
  /var/lib/egenlabs-production/storage/media/fito-gen-one-pager.pdf
sudo sha256sum /var/lib/egenlabs-production/storage/media/fito-gen-one-pager.pdf
sudo rm -f /tmp/fito-gen-one-pager.pdf
```

Następnie w `/admin/pdfs` ustaw:

```text
fileName: fito-gen-one-pager.pdf
storagePath: storage/media/fito-gen-one-pager.pdf
mimeType: application/pdf
visibility: PUBLIC albo PRIVATE
isEnabled: zaznaczone tylko po walidacji pliku
```

Nie wrzucaj PDF do repo, jeżeli jest to prywatny materiał operacyjny lub materiał zarządzany przez storage.

## 11. Forms `/admin/forms`

Status: **istnieje jako przegląd danych; workflow obsługi zgłoszeń jest częściowy**.

Panel public forms pokazuje:

- newsletter signups,
- pending newsletter signups,
- active newsletter signups,
- unsubscribed newsletter signups,
- contact inquiries,
- enterprise interest.

Newsletter statuses:

- `PENDING` – zapis oczekuje na potwierdzenie,
- `ACTIVE` – zapis potwierdzony i aktywny,
- `UNSUBSCRIBED` – użytkownik wypisany.

Co administrator może zrobić dzisiaj:

- przeglądać zapisy newsletterowe,
- sprawdzać zgłoszenia kontaktowe,
- sprawdzać zapytania enterprise,
- porównywać liczniki i nowe rekordy.

Czego panel jeszcze nie robi jako pełny workflow:

- nie prowadzi statusowania obsługi kontakt inquiry w rozbudowanym CRM,
- nie obsługuje kampanii newsletterowych,
- nie obsługuje segmentacji marketingowej,
- nie ma composer/scheduler newslettera,
- nie ma zaawansowanych filtrów i dashboardów.

Zasada operacyjna:

- na contact inquiry i enterprise interest odpowiadaj poza panelem, używając firmowego kanału e-mail,
- nie przenoś danych z formularzy do publicznych dokumentów,
- nie dodawaj ręcznie osób do newslettera bez właściwej zgody i procesu double opt-in.

## 12. Desktop API management `/admin/desktop`

Status: **istnieje dla desktop news feed; większy Universal Desktop Support API v1 jest osobnym workstreamem post-MVP**.

Panel `/admin/desktop` pozwala zarządzać news feedem dla aplikacji desktopowych.

Potwierdzone funkcje:

- tworzenie desktop news item,
- edycja desktop news item,
- status `DRAFT` lub `PUBLISHED`,
- `category`,
- `slug`,
- `title`,
- `summary`,
- `content`,
- `minVersion`,
- `maxVersion`,
- `ctaLabel`,
- `ctaUrl`,
- `isPinned`.

Zasady publikacji:

- używaj `DRAFT` dla roboczych komunikatów,
- publikuj tylko sprawdzone komunikaty,
- `isPinned` stosuj oszczędnie dla najważniejszych informacji,
- `minVersion` i `maxVersion` ustawiaj tylko wtedy, gdy komunikat naprawdę dotyczy konkretnego zakresu wersji,
- CTA powinien prowadzić do bezpiecznego, publicznego adresu.

Desktop news nie zastępuje systemu update ani dokumentacji release notes. To kanał komunikatów wspierających aplikacje desktopowe.

## 13. Telemetry and feedback intake `/admin/desktop/intake`

Status: **istnieje jako podstawowy przegląd intake; rozbudowany dashboard jest planowany post-MVP**.

Panel pokazuje:

- recent telemetry events,
- error telemetry events,
- recent feature requests,
- recent software demand requests.

Najważniejsze pola telemetryczne:

- `productId`,
- `editionId`,
- `channelId`,
- `installationId`,
- `appVersion`,
- `eventType`,
- `severity`,
- `message`,
- `payloadJson`,
- `occurredAt`,
- `receivedAt`,
- `ipAddress`,
- `userAgent`.

Zasady prywatności i minimalizacji:

- telemetry intake ma pomagać w diagnostyce, a nie przejmować dane operacyjne aplikacji desktopowej,
- nie należy rozszerzać payloadów o dane użytkownika końcowego bez decyzji baseline,
- `installationId` traktuj jako identyfikator techniczny, nie jako pełny profil użytkownika,
- `payloadJson` może zawierać dane diagnostyczne i wymaga ostrożności przy kopiowaniu,
- eksporty i zrzuty telemetryki powinny być minimalne i celowe,
- desktop pozostaje offline-first.

Kiedy reagować:

- rośnie liczba `ERROR`,
- powtarza się ten sam `eventType`,
- wiele instalacji zgłasza ten sam problem,
- feature request wskazuje powtarzalną potrzebę biznesową,
- software demand request wskazuje potencjalny nowy produkt lub integrację.

Rozbudowane filtry, agregacje, wykresy i retencja telemetryczna są tematem post-MVP, a nie funkcją aktualnie potwierdzoną jako gotowa.

## 14. Operations `/admin/operations`

Status: **istnieje jako audit log, CSV exports i odniesienia do backup/restore runbook**.

Panel operations pokazuje:

- audit summary,
- backup and restore runbook references,
- CSV exports,
- recent audit entries.

Audit log służy do kontroli działań administracyjnych. Wpisy zawierają między innymi:

- `actionType`,
- `entityType`,
- `entityId`,
- `summary`,
- czas wykonania,
- administratora, jeżeli jest powiązany.

CSV exports służą do kontrolowanego pobierania danych operacyjnych.

Zasady ochrony eksportów:

1. Pobieraj tylko eksport potrzebny do konkretnego celu.
2. Nie wysyłaj eksportu zwykłym e-mailem, jeżeli zawiera dane osobowe.
3. Nie commituj eksportów CSV do repo.
4. Nie przechowuj eksportów w katalogach synchronizowanych publicznie.
5. Usuń lokalny eksport po zakończeniu pracy, jeżeli nie jest już potrzebny.
6. Nie wklejaj pełnych eksportów do czatu.

Backup/restore:

- panel odsyła do runbooków,
- administrator nie wykonuje restore produkcyjnego z panelu,
- restore produkcyjny wymaga osobnej decyzji, planu, okna operacyjnego i rollbacku,
- automatyczne backupy są obsługiwane operacyjnie poza panelem.

## 15. Typowe procedury

### 15.1 Dodać wpis FAQ

Status: **istnieje**.

1. Wejdź w `/admin/content`.
2. W sekcji `Create FAQ entry` wpisz `slug`, `question`, `answer`, `sortOrder` i `status`.
3. Dla wersji roboczej wybierz `DRAFT`.
4. Po sprawdzeniu treści zmień status na `PUBLISHED`.
5. Otwórz publiczne `/faq` i sprawdź wynik.

### 15.2 Dodać wpis bloga

Status: **istnieje**.

1. Wejdź w `/admin/content`.
2. W sekcji `Create blog post` wpisz `slug`, `title`, `excerpt`, `content` i `status`.
3. Zapisz jako `DRAFT`.
4. Sprawdź treść pod kątem języka, zgodności z marką i braku danych wewnętrznych.
5. Zmień status na `PUBLISHED`.
6. Sprawdź `/blog` oraz `/blog/[slug]`.

### 15.3 Opublikować desktop news

Status: **istnieje**.

1. Wejdź w `/admin/desktop`.
2. Wybierz product, edition i release channel.
3. Wpisz `category`, `slug`, `title`, `summary` i `content`.
4. Opcjonalnie ustaw zakres wersji i CTA.
5. Ustaw `DRAFT` dla wersji roboczej.
6. Po akceptacji ustaw `PUBLISHED`.
7. Jeżeli komunikat jest krytyczny, rozważ `isPinned`.

### 15.4 Skonfigurować PDF

Status: **częściowe**.

1. Umieść fizyczny plik PDF w `storage/media/...` zgodnie z procedurą techniczną.
2. Sprawdź checksum i uprawnienia pliku.
3. Wejdź w `/admin/pdfs`.
4. Ustaw `title`, `slug`, `description`, `visibility`, `fileName`, `storagePath` i `mimeType`.
5. Włącz `isEnabled` dopiero po potwierdzeniu, że plik istnieje.
6. Sprawdź `/one-pager/[slug]` i `/api/v1/pdf/download?slug=[slug]`.

### 15.5 Dodać build

Status: **częściowe**.

1. Umieść fizyczny plik buildu w `storage/builds/...` zgodnie z procedurą techniczną.
2. Sprawdź SHA-256.
3. Wejdź w `/admin/catalog`.
4. Wybierz product, edition i release channel.
5. Wpisz `version`, `buildNumber`, `notes` i opcjonalne metadane assetu.
6. Nie zaznaczaj `activateNow`, jeżeli build nie jest jeszcze zatwierdzony.
7. Zapisz build.

### 15.6 Aktywować build

Status: **istnieje, ale operacyjnie wrażliwe**.

1. Wejdź w `/admin/catalog`.
2. Znajdź właściwy build.
3. Sprawdź product, edition, channel, version, buildNumber, storagePath i checksum.
4. Sprawdź, czy download policy jest zgodna z planem release.
5. Użyj `Activate` tylko wtedy, gdy build jest zatwierdzony.
6. Po aktywacji sprawdź dashboard i `/admin/downloads`.

### 15.7 Sprawdzić lead po rejestracji

Status: **istnieje**.

1. Wejdź w `/admin/leads`.
2. Odszukaj lead po e-mailu lub czasie utworzenia.
3. Sprawdź download consent i marketing consent.
4. Sprawdź powiązane download requests.
5. Nie kopiuj danych do dokumentów publicznych.

### 15.8 Sprawdzić status e-maila

Status: **istnieje**.

1. Wejdź w `/admin/emails`.
2. Odszukaj wiadomość w recent email logs.
3. Sprawdź `templateKey`, adres odbiorcy, status, transport mode i ewentualny błąd.
4. Przy `FAILED` sprawdź, czy problem dotyczy konfiguracji transportu, danych odbiorcy lub providera.
5. Nie wklejaj pełnej treści logu z linkiem pobrania do czatu.

### 15.9 Wykonać resend

Status: **istnieje dla wybranych wiadomości transakcyjnych**.

1. Wejdź w `/admin/emails`.
2. Upewnij się, że masz rolę `ADMIN`.
3. Sprawdź, czy log jest resendowalny.
4. Nie wykonuj resend dla `NEWSLETTER_CONFIRMATION` z panelu.
5. Jeżeli wiadomość zawiera link pobrania, potwierdź cel operacji.
6. Kliknij resend i sprawdź nowy wpis w logach.

### 15.10 Sprawdzić telemetrykę

Status: **istnieje jako podstawowy przegląd**.

1. Wejdź w `/admin/desktop/intake`.
2. Sprawdź liczbę telemetry events i error telemetry events.
3. Przejrzyj najnowsze rekordy.
4. Zwróć uwagę na `severity`, `eventType`, `appVersion` i `installationId`.
5. Przy powtarzalnym błędzie przygotuj syntetyczne podsumowanie bez danych wrażliwych.
6. Nie kopiuj pełnego `payloadJson`, jeśli może zawierać dane diagnostyczne użytkownika.

## 16. Czego administrator nie powinien robić

Administrator nie powinien:

- restartować produkcji bez decyzji,
- wykonywać deploymentu bez procedury,
- wykonywać restore produkcyjnego bez formalnej decyzji,
- zmieniać sekretów lub plików env bez zaakceptowanej procedury,
- commitować plików storage, backupów, dumpów, logów lub eksportów,
- aktywować builda bez fizycznego pliku i checksum,
- włączać pobierania bez zatwierdzonego release,
- wysyłać resend bez sprawdzenia skutków,
- traktować newsletter signup jako pełny system kampanii,
- używać telemetryki do zbierania nadmiarowych danych,
- wklejać do treści publicznych HTML, JavaScript, tokenów, logów lub wewnętrznych ścieżek,
- zmieniać slugów opublikowanych treści bez potrzeby,
- pobierać eksportów CSV bez celu operacyjnego,
- przesyłać eksportów CSV kanałami niezabezpieczonymi.

## 17. Znane ograniczenia post-MVP

Status: **planowane post-MVP albo częściowe, nie opisywać jako gotowe**.

Najważniejsze ograniczenia aktualnego panelu:

1. Brak WYSIWYG / rich text editor dla FAQ, bloga i desktop news.
2. Brak preview workflow dla treści.
3. Brak wersjonowania lub rollbacku treści.
4. Brak media managera.
5. Brak fizycznego uploadu plików z panelu.
6. Brak fizycznego uploadu PDF z panelu.
7. Brak fizycznego uploadu buildów z panelu.
8. Brak pełnej wysyłki newsletter campaigns z panelu.
9. Brak segmentacji newsletterowej.
10. Brak scheduler/test send/throttling dla kampanii.
11. Brak rozbudowanego telemetry dashboardu.
12. Brak filtrów i agregacji telemetryki.
13. Brak pełnego CRM workflow dla contact inquiries i enterprise interests.
14. Brak 2FA w panelu admina.
15. Brak resetu hasła jako potwierdzonego workflow panelu.
16. Universal Desktop Support API v1 wymaga osobnego workstreamu gap analysis i kontraktów.

## 18. Checklist administratora

### Codziennie lub po każdej kampanii/ruchu na stronie

- Sprawdź `/admin` pod kątem nowych leadów, formularzy i błędów.
- Sprawdź `/admin/emails`, czy nie ma nowych `FAILED`.
- Sprawdź `/admin/forms`, czy pojawiły się nowe contact inquiries lub enterprise interests.
- Sprawdź `/admin/desktop/intake`, czy nie ma wzrostu error telemetry.
- Nie pobieraj eksportów, jeśli nie są potrzebne.

### Co tydzień

- Przejrzyj `/admin/leads` i jakość nowych leadów.
- Przejrzyj status newsletter signups.
- Przejrzyj opublikowane FAQ i blog pod kątem aktualności.
- Przejrzyj desktop news i usuń lub odpublikuj przestarzałe komunikaty, jeśli to zasadne.
- Sprawdź audit log w `/admin/operations`.
- Potwierdź, że znane ograniczenia nie są mylnie komunikowane jako gotowe funkcje.

### Co miesiąc lub przed większą zmianą

- Zweryfikuj, czy backup/restore runbook jest aktualny.
- Zweryfikuj, czy automatyczne backupy działają zgodnie z runbookiem operacyjnym.
- Sprawdź, czy w storage nie ma niepotrzebnych lub błędnie nazwanych plików.
- Sprawdź, czy aktywne buildy i download policies odpowiadają aktualnemu release.
- Przejrzyj eksporty CSV na komputerze administratora i usuń niepotrzebne kopie.
- Przygotuj listę powtarzalnych telemetry events i feature requests jako wejście do backlogu.

## 19. Rekomendowana kolejność rozwoju po tym manualu

Ten manual nie rozszerza funkcjonalności produkcyjnej. Porządkuje sposób obsługi aktualnego panelu.

Rekomendowana kolejność dalszych prac:

1. `PMVP-ADMIN-001` – utrzymanie i akceptacja tego manuala.
2. `PMVP-ADMIN-002` – gap analysis dla admin/content.
3. Decyzja baseline dla kontrolowanego WYSIWYG.
4. Decyzja baseline dla media managera i safe file upload.
5. Decyzja baseline dla PDF/material upload workflow.
6. Decyzja baseline dla newsletter campaign composer and sending workflow.
7. Decyzja baseline dla telemetry dashboard improvements.
8. Osobny workstream Universal Desktop Support API v1.

Każdy z tych kroków wymaga porównania z `/docs/living-specification.md`, oceny wpływu na Decision Log i ewentualnego ADR przed implementacją.
