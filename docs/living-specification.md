# Żywy Dokument Specyfikacji

## 1. Cel dokumentu
Ten dokument jest głównym i aktualnym źródłem prawdy dla projektu eGen Labs Web Platform.
Opisuje uzgodniony zakres, wymagania, architekturę, decyzje, ryzyka oraz historię zmian.
Każda nowa propozycja, zmiana lub decyzja powinna być oceniana względem tego dokumentu.

## 2. Zasada źródła prawdy
- Ten plik jest nadrzędnym źródłem prawdy dla projektu.
- Wszystkie kolejne zmiany muszą być porównywane z tym dokumentem.
- Zmiana nie jest uznana za przyjętą, dopóki nie zostanie wyraźnie zaakceptowana.
- Po akceptacji zmiany dokument jest ręcznie aktualizowany.
- Nie wolno zakładać, że dokument został zaktualizowany, dopóki nie zostanie to potwierdzone.
- W każdej kolejnej dyskusji nowe pomysły, zmiany i decyzje muszą być oceniane względem tego pliku.
- Kod źródłowy, README, nazwy techniczne i komentarze w kodzie pozostają po angielsku, o ile nie zostanie ustalone inaczej.

## 3. Opis projektu
- Nazwa projektu: eGen Labs Web Platform
- Typ produktu: platforma webowa marki eGen Labs dla dystrybucji, komunikacji, obsługi leadów i wsparcia produktów software
- Krótki opis:
  Platforma webowa eGen Labs wspiera promocję firmy i produktów, dystrybucję aplikacji desktopowych, gromadzenie leadów, obsługę newslettera, publikację treści, telemetry intake oraz komunikację pomiędzy aplikacjami desktopowymi a zapleczem webowym. MVP koncentruje się na pierwszym produkcie: Fito Gen Essentials.

## 4. Cel biznesowy
Celem biznesowym projektu jest uruchomienie profesjonalnej, skalowalnej platformy webowej eGen Labs, która:
- wspiera budowę marki eGen Labs jako producenta oprogramowania,
- umożliwia skuteczną dystrybucję pierwszego produktu, Fito Gen Essentials,
- pozyskuje użytkowników i jakościowy feedback z rynku,
- buduje bazę kontaktów i zgód marketingowych,
- przygotowuje fundament pod wersję Pro oraz kolejne produkty eGen Labs.

Długoterminowo platforma ma wspierać model multi-product, a nie wyłącznie pojedynczy landing dla jednego programu.

## 5. Kryteria sukcesu
### Kryteria sukcesu MVP launch
- Serwis działa produkcyjnie pod domeną egenlabs.eu.
- Użytkownik może przejść pełny flow: wejście na stronę, rejestracja, zapis zgód, otrzymanie e-maila, pobranie aplikacji.
- Panel administracyjny pozwala zarządzać co najmniej:
  - leadami i rejestracjami,
  - zgodami,
  - buildami do pobrania,
  - FAQ,
  - blogiem,
  - news feedem,
  - podstawowymi materiałami PDF.
- Aplikacja desktopowa może:
  - sprawdzić aktualizację,
  - pobrać news feed,
  - wysłać telemetrię,
  - wysłać zgłoszenie ulepszenia,
  - wysłać zgłoszenie zapotrzebowania na oprogramowanie.
- Architektura serwisu pozwala dodać drugi produkt bez przebudowy fundamentu.

### Kryteria sukcesu biznesowego 30 dni po starcie
- 20 rejestracji pobrania.
- 5 aktywnych szkółek.
- 10 ważnych zgód marketingowych.
- 5 jakościowych feedbacków od użytkowników.

### Kryteria sukcesu biznesowego 90 dni po starcie
- 75 rejestracji pobrania.
- 10 aktywnych szkółek.
- 25 ważnych zgód marketingowych.
- 10 jakościowych feedbacków od użytkowników.
- 3 sygnały zainteresowania wersją Pro lub Enterprise.

## 6. Zakres
Pełny uzgodniony zakres projektu obejmuje:
- platformę webową eGen Labs projektowaną od początku jako system multi-product,
- publiczną stronę główną eGen Labs,
- prezentację i dystrybucję pierwszego produktu Fito Gen Essentials,
- mechanizmy rejestracji leadów i obsługi zgód,
- newsletter i komunikację e-mailową,
- sekcję pobrania aplikacji z konfigurowalnym trybem wydawania linków,
- panel administracyjny do zarządzania treściami, buildami, zgodami i podstawowymi danymi operacyjnymi platformy,
- FAQ, blog, formularz kontaktowy i materiały PDF,
- endpoint aktualizacji dla aplikacji desktopowej,
- news feed dla aplikacji desktopowej,
- telemetry intake dla aplikacji desktopowej,
- obsługę zgłoszeń ulepszeń, zapotrzebowania na oprogramowanie i zainteresowania wyższą edycją,
- wspólną warstwę Universal Desktop Support API v1 dla wielu aplikacji desktopowych publikowanych przez eGen Labs,
- manifesty i paczki referencyjne / słownikowe dla aplikacji desktopowych,
- podstawy bezpieczeństwa, backupu, obserwowalności i wdrożenia.

## 7. Zakres MVP
Do pierwszej wersji produkcyjnej wchodzi:
- strona główna eGen Labs,
- landing page produktu Fito Gen Essentials,
- sekcja pobrania aplikacji,
- obowiązkowa rejestracja e-mailowa przed pobraniem,
- oddzielna, opcjonalna zgoda marketingowa na newsletter,
- e-mail powitalny,
- e-mail z linkiem do pobrania,
- konfiguracja linków pobrania:
  - publiczny,
  - jednorazowy,
  - czasowy,
  - prywatny stały,
- formularz newslettera bez pobrania aplikacji,
- FAQ,
- blog z minimum 3 artykułami startowymi,
- materiał PDF one-pager o widoczności publicznej albo prywatnej,
- formularz kontaktowy,
- formularz zainteresowania Enterprise,
- panel administracyjny z ręcznym zarządzaniem treściami,
- zarządzanie buildami, kanałami wydań i politykami pobrania,
- endpoint aktualizacji,
- endpoint news feedu,
- endpoint telemetryczny,
- endpoint zgłoszeń ulepszeń,
- endpoint zapotrzebowania na nowe oprogramowanie,
- logowanie administracyjne,
- audyt działań administracyjnych,
- backup i restore na poziomie MVP,
- środowiska dev, staging i prod.

Zakres MVP pozostaje zorientowany na uruchomienie i obsługę pierwszego produktu.
Po zielonym checkpointcie MVP kolejną fazą platformy jest Universal Desktop Support API v1 jako wspólna warstwa wsparcia dla wielu aplikacji desktopowych publikowanych przez eGen Labs.

## 8. Poza zakresem
Poza MVP pozostają:
- pełny system licencji,
- zakup Pro z poziomu aplikacji,
- płatności online i checkout,
- konta użytkowników końcowych,
- synchronizacja danych desktopu z chmurą,
- publiczne API dla partnerów,
- rozbudowany telemetry dashboard,
- pełny marketplace kolejnych aplikacji,
- pełna wielojęzyczność,
- rozbudowany CMS klasy enterprise,
- zewnętrzne SSO,
- 2FA w pierwszej wersji, o ile nie zostanie dodane decyzją późniejszą.

## 9. Założenia
- Marka nadrzędna projektu to eGen.
- Operacyjną submarką software/web jest eGen Labs.
- Pierwszym produktem wspieranym przez platformę jest Fito Gen w edycji Essentials.
- Rynek startowy to Polska i język polski.
- Projekt ma być od początku gotowy architektonicznie pod kolejne produkty.
- MVP ma być realizowane solo, w modelu low-cost, w horyzoncie 1–2 miesięcy.
- Platforma webowa nie synchronizuje danych operacyjnych produktu desktopowego z chmurą w MVP.
- Desktop pozostaje głównym środowiskiem pracy użytkownika końcowego.
- Web platforma zna wyłącznie minimalne metadane potrzebne do download, update, news feedu i telemetrii.
- Link do pobrania może być wydawany różnymi politykami, zależnie od konfiguracji produktu lub builda.
- Zgody muszą być wersjonowane i rejestrowane.
- Produkt może mieć wiele buildów, ale tylko jeden aktywny build na kanał wydania.
- W MVP obsługiwane są kanały stable i beta.
- Blog startuje od razu z minimum 3 artykułami.
- PDF one-pager może być publiczny albo prywatny.
- Git i GitHub są obowiązkowymi elementami toolchainu projektu.
- Repozytorium projektu musi zawierać i utrzymywać aktualny plik `.gitignore`.
- Do repozytorium nie wolno commitować sekretów, plików środowiskowych, backupów, dumpów baz danych, logów z danymi wrażliwymi, prywatnych buildów, lokalnych uploadów ani eksportów danych użytkowników.
- Plik `/docs/living-specification.md` oraz pozostała dokumentacja projektowa nie mogą zawierać haseł, kluczy API, tokenów, danych osobowych użytkowników, surowych eksportów, prywatnych URL-i z tokenami ani innych danych wrażliwych.
- ORM dla web platformy to Prisma.
- Aplikacje desktopowe eGen Labs pozostają offline-first i nie mogą wymagać stałego połączenia z internetem do podstawowej pracy operacyjnej.
- Universal Desktop Support API v1 ma wspierać wiele aplikacji desktopowych, nie tylko Fito Gen.
- Web platforma publikuje manifesty, paczki i kontrakty wspierające, ale nie staje się właścicielem operacyjnych danych desktopowych aplikacji.
- Paczki referencyjne i słownikowe powinny być projektowane w sposób zgodny z lokalnym importem po stronie aplikacji desktopowej.
- Dokumentacja platformowa pozostaje po polsku, a techniczne nazwy endpointów, pól i payloadów pozostają po angielsku.

## 10. Pytania otwarte
- Czy oraz kiedy dodać 2FA do panelu administracyjnego po MVP lub w późniejszej fazie hardeningu.
- Czy reset hasła ma wejść do pierwszego inkrementu auth shell, czy do kolejnego kroku w ramach MVP panelu administracyjnego.
- Ostateczny model zgody dla telemetrii powiązanej z leadem i installation_id.
- Ostateczna polityka retencji danych po stronie zgodności i polityk prywatności.
- Szczegółowe reguły lifecycle stable/beta oraz kryteria promocji buildu między kanałami.
- Szczegółowy model preview i workflow redakcyjnego treści w panelu.
- Czy PDF one-pager w konkretnych kampaniach ma działać także w trybie gated.
- Dokładne progi biznesowe i produktowe uruchomienia wersji Pro.
- Czy Dictionary Package API v1 ma publikować paczki w formacie CSV, ZIP+CSV, czy JSON?
- Czy Telemetry API pozostaje częścią twardego zakresu Universal Desktop Support API v1, czy przechodzi do v1.1?
- Czy Feedback API v1 obejmuje tylko tekstowe zgłoszenia, czy również załączniki w późniejszej fazie?
- Czy paczki referencyjne mają być publikowane na etapie pierwszego wdrożenia wyłącznie dla Fito Gen, czy od razu jako mechanizm uniwersalny dla wielu aplikacji?

## 11. Role użytkowników i aktorzy
- Visitor – użytkownik publicznej strony, który przegląda ofertę, treści i formularze.
- Lead / Subscriber – osoba, która podała e-mail, przeszła rejestrację, pobrała aplikację lub zapisała się na komunikację.
- Admin – administrator panelu z pełnym dostępem do konfiguracji, buildów, treści, zgód i danych operacyjnych platformy.
- Editor – użytkownik panelu z uprawnieniami do zarządzania treściami bez pełnego dostępu do konfiguracji technicznej.
- Desktop Client – aplikacja desktopowa produktu korzystająca z API web platformy.
- Brevo – zewnętrzny dostawca komunikacji e-mailowej i newsletterowej.
- Cloudflare – warstwa DNS, proxy, CDN i podstawowej ochrony ruchu.

## 12. Wymagania funkcjonalne
- WF-001: System ma udostępniać publiczną stronę główną eGen Labs.
- WF-002: System ma udostępniać landing page produktu Fito Gen Essentials.
- WF-003: Użytkownik ma mieć możliwość rejestracji e-mailowej w celu pobrania aplikacji.
- WF-004: System ma umożliwiać zapis do newslettera bez pobierania aplikacji.
- WF-005: System ma rejestrować i wersjonować zgody użytkownika.
- WF-006: System ma wysyłać e-mail powitalny.
- WF-007: System ma wysyłać e-mail z linkiem do pobrania aplikacji.
- WF-008: System ma obsługiwać konfigurowalne polityki linków pobrania: publiczny, jednorazowy, czasowy, prywatny stały.
- WF-009: Administrator ma mieć możliwość zarządzania produktami, edycjami, kanałami i buildami.
- WF-010: Administrator ma mieć możliwość oznaczenia jednego aktywnego buildu na kanał wydania.
- WF-011: Administrator ma mieć możliwość zarządzania FAQ.
- WF-012: Administrator ma mieć możliwość zarządzania blogiem.
- WF-013: Administrator ma mieć możliwość zarządzania news feedem dla aplikacji desktopowej.
- WF-014: Administrator ma mieć możliwość zarządzania materiałami PDF i ich widocznością.
- WF-015: Administrator ma mieć możliwość zarządzania formularzami, definicjami zgód i treściami zgód.
- WF-016: Administrator ma mieć możliwość przeglądu leadów, zgód, download requests i logów e-maili.
- WF-017: Administrator ma mieć możliwość przeglądu i filtrowania telemetrii.
- WF-018: System ma udostępniać formularz kontaktowy.
- WF-019: System ma udostępniać formularz zainteresowania wersją Enterprise.
- WF-020: System ma umożliwiać pobranie materiału PDF.
- WF-021: Desktop ma mieć możliwość sprawdzenia aktualizacji przez API.
- WF-022: Desktop ma mieć możliwość pobrania news feedu przez API.
- WF-023: Desktop ma mieć możliwość wysłania telemetrii przez API.
- WF-024: Desktop ma mieć możliwość wysłania zgłoszenia ulepszenia przez API.
- WF-025: Desktop ma mieć możliwość wysłania zapotrzebowania na oprogramowanie przez API.
- WF-026: News feed ma być filtrowany po produkcie, edycji, wersji, kanale i kategorii.
- WF-027: Panel administracyjny ma obsługiwać wielu administratorów.
- WF-028: System ma prowadzić audyt działań administracyjnych.
- WF-029: System ma umożliwiać eksport leadów, zgód, kontaktów, Enterprise interest, feature requests, software demand requests i wybranej telemetrii do CSV.
- WF-030: System ma umożliwiać upload buildów instalatorów i materiałów marketingowych.
- WF-031: System ma udostępniać blog z minimum 3 artykułami startowymi w MVP.
- WF-032: System ma umożliwiać konfigurację publicznej lub prywatnej widoczności PDF one-pagera.
- WF-033: Platforma ma udostępniać Universal Desktop Support API v1 jako wspólną warstwę wsparcia dla wielu aplikacji desktopowych eGen Labs.
- WF-034: Universal Desktop Support API v1 ma rozróżniać co najmniej `product`, `edition`, `channel`, `platform`, `appVersion` i `locale`.
- WF-035: Platforma ma publikować Dictionary Package API v1 z manifestem wersji paczek referencyjnych i słownikowych.
- WF-036: Platforma ma udostępniać wersjonowane paczki referencyjne w formacie zgodnym z lokalnym importem po stronie aplikacji desktopowej.
- WF-037: Platforma ma utrzymywać wspólną dokumentację kontraktów Universal Desktop Support API v1 dla wielu aplikacji desktopowych.
- WF-038: Platforma nie może przejmować operacyjnych danych domenowych aplikacji desktopowych bez odrębnej zaakceptowanej decyzji architektonicznej.

## 13. Wymagania niefunkcjonalne
- WNF-001: Typowa odpowiedź publicznej strony powinna mieścić się w czasie poniżej 2 sekund.
- WNF-002: Typowa odpowiedź panelu administracyjnego powinna mieścić się w czasie poniżej 3 sekund.
- WNF-003: Endpointy update, news feed i telemetry intake powinny odpowiadać typowo poniżej 1 sekundy.
- WNF-004: Telemetry intake nie może blokować działania aplikacji desktopowej.
- WNF-005: System ma być stabilny i odtwarzalny operacyjnie mimo braku formalnego SLA w MVP.
- WNF-006: System ma logować operacje administracyjne w logu audytowym.
- WNF-007: System ma umożliwiać odtworzenie danych z kopii zapasowej.
- WNF-008: System ma stosować walidację wejścia oraz podstawową ochronę przed typowymi atakami webowymi.
- WNF-009: Panel administracyjny ma wymagać bezpiecznego uwierzytelniania i kontroli sesji.
- WNF-010: Architektura ma wspierać dodanie kolejnego produktu bez przebudowy fundamentu systemu.
- WNF-011: Kod ma być modularny, testowalny i utrzymywalny.
- WNF-012: System ma umożliwiać obserwację błędów backendu, e-maili, formularzy, pobrań i ruchu API.
- WNF-013: Backup i restore mają być częścią MVP, a nie zadaniem odłożonym po starcie.
- WNF-014: System ma być wdrażalny w środowiskach dev, staging i prod.
- WNF-015: Projekt ma minimalizować dług techniczny i unikać nadmiarowej złożoności architektonicznej.

## 14. Standardy jakości kodu i dobre praktyki programistyczne
- Stosować Clean Code i dobre praktyki właściwe dla użytego stacku.
- Utrzymywać czytelny, spójny, przewidywalny i łatwy w utrzymaniu kod.
- Unikać nadmiarowej abstrakcji i złożoności bez uzasadnienia biznesowego.
- Promować wysoką spójność modułów i niskie sprzężenie między nimi.
- Zachować czytelne granice modułów domenowych i technicznych.
- Projektować rozwiązania pod testowalność, refaktoryzację i dalszy rozwój.
- Stosować jednoznaczne nazewnictwo i sensowny podział odpowiedzialności.
- Kontrolować zależności i unikać ukrytego vendor lock-in bez uzasadnienia.
- Zapewnić walidację danych wejściowych i poprawną obsługę błędów.
- Zapewnić logowanie, obserwowalność i audyt tam, gdzie to potrzebne.
- Traktować migracje danych jako kontrolowaną część procesu dostarczania.
- Stosować Git i GitHub jako obowiązkowy workflow version control.
- Utrzymywać aktualny `.gitignore` i rozszerzać go przy dodawaniu nowych typów plików, narzędzi lub katalogów roboczych.
- Nie commitować do repozytorium sekretów, plików `.env`, kluczy API, haseł, certyfikatów prywatnych, backupów, dumpów baz, eksportów danych użytkowników, lokalnych uploadów, build artifacts ani logów zawierających dane wrażliwe.
- W dokumentacji, w tym w `/docs/living-specification.md`, używać wyłącznie placeholderów i opisów technicznych zamiast rzeczywistych sekretów, danych osobowych lub produkcyjnych identyfikatorów wrażliwych.
- Commitować historię migracji do repozytorium.
- Stosować checklistę review nawet przy pracy solo.
- Wykonywać regularną refaktoryzację i kontrolować dług techniczny.
- Utrzymywać testy jednostkowe dla logiki krytycznej i testy integracyjne dla endpointów o podwyższonym ryzyku.
- Przed wydaniem wykonywać smoke testy manualne.
- Kod, README, nazwy techniczne i komentarze w kodzie prowadzić po angielsku.

## 15. Reguły biznesowe
- Produkt w MVP jest reprezentowany przez markę Fito Gen i edycję Essentials.
- Jeden produkt może mieć wiele buildów.
- Dla jednego produktu i jednego kanału wydania może istnieć tylko jeden aktywny build.
- Kanały wydań w MVP to stable i beta.
- Lead może istnieć bez zgody marketingowej.
- Zgody muszą być wersjonowane, rejestrowane i możliwe do wykazania.
- Pobranie aplikacji wymaga rejestracji e-mailowej.
- Zgoda marketingowa musi być oddzielona od obowiązkowej rejestracji operacyjnej.
- Link do pobrania może być wydawany zgodnie z konfiguracją polityki pobrania.
- News feed musi być filtrowany po produkcie, edycji, wersji, kanale i kategorii.
- Telemetry intake nie może blokować pracy aplikacji desktopowej.
- Panel administracyjny ma obsługiwać wielu administratorów.
- PDF one-pager może być publiczny albo prywatny.
- Feature request i software demand request są elementem zakresu MVP.
- Platforma webowa nie jest w MVP systemem operacyjnej pracy użytkownika końcowego.

## 16. Przegląd architektury
Dla MVP przyjęto architekturę modularnego monolitu.
Jedna aplikacja webowa odpowiada za:
- publiczną stronę,
- panel administracyjny,
- API dla aplikacji desktopowych.

Architektura wysokiego poziomu:
- Frontend i backend w ramach Next.js full-stack.
- PostgreSQL jako główna baza danych web platformy.
- Prisma jako ORM i narzędzie migracji danych.
- REST API wersjonowane od `/api/v1`.
- Brevo do e-maili transakcyjnych i newslettera.
- Cloudflare jako warstwa DNS/proxy/CDN.
- VPS jako środowisko uruchomieniowe i storage dla plików.
- Desktop klient jako zewnętrzny konsument API dla update, news, telemetry i feedback.
- Panel administracyjny w MVP jest chroniony przez serwerowy model sesji oparty o logowanie e-mail i hasło.
- Pierwszy inkrement auth obejmuje minimalny admin auth shell: logowanie, utrzymanie sesji, wygasanie sesji, ochronę tras `/admin` oraz kontrolę dostępu opartą o role Admin i Editor.
- 2FA nie jest częścią pierwszego inkrementu auth i pozostaje poza MVP, chyba że zostanie zaakceptowane osobną decyzją.

Granica odpowiedzialności:
- Desktop jest systemem pracy użytkownika końcowego.
- Web platforma jest systemem promocji, dystrybucji, obsługi leadów, treści, komunikacji, update/news/telemetry i administracji.
- W MVP nie ma synchronizacji danych operacyjnych desktopu z chmurą.

Po checkpointcie MVP architektura platformy obejmuje dodatkowo wspólną warstwę Application Support / Universal Desktop Support API v1 dla aplikacji desktopowych publikowanych przez eGen Labs.
Warstwa ta dostarcza manifesty aktualizacji, news feed, manifesty i paczki referencyjne, feedback intake oraz telemetry intake, ale nie przejmuje odpowiedzialności za operacyjne dane domenowe aplikacji desktopowych.

## 17. Struktura modułów
- Auth Module – logowanie administracyjne e-mail + hasło, serwerowe sesje, role Admin/Editor, ochrona tras `/admin`, kontrola dostępu oraz reset hasła jako funkcja planowana w ramach MVP, lecz niekoniecznie w pierwszym inkremencie auth shell.
- Admin Module – panel administracyjny i operacje zaplecza.
- Product Catalog Module – produkty, edycje, kanały wydań, buildy, assets.
- Download Module – rejestracja pobrań, polityki pobrania, generowanie i walidacja linków.
- Lead & Consent Module – leady, zgody, wersje zgód, potwierdzenia.
- Email Module – szablony, integracja z Brevo, logi wysyłek.
- Content Module – blog, FAQ, news feed, PDF/media assets.
- Contact & Demand Module – formularz kontaktowy, Enterprise interest, feature requests, software demand requests.
- Telemetry Module – intake telemetrii, zapis zdarzeń, filtrowanie danych diagnostycznych.
- Audit Module – log audytowy działań administracyjnych.
- Public Website Module – publiczne renderowanie treści, landingów i formularzy.
- Universal Desktop Support API Module – wspólne kontrakty wsparcia dla wielu aplikacji desktopowych eGen Labs, obejmujące Update API, News Feed API, Dictionary Package API, Feedback API i Telemetry API.
- Infrastructure Module – konfiguracja środowisk, storage, backup, monitoring, integracje techniczne.

## 18. Przegląd modelu danych
### Właścicielstwo danych
- Desktop jest właścicielem danych operacyjnych produktu, takich jak rośliny, partie, kontrahenci, dokumenty, numeracja i dane EPPO.
- Web platforma jest właścicielem danych marketingowych, dystrybucyjnych, telemetrycznych i administracyjnych.

### Główne encje web platformy
- Product
- ProductEdition
- ReleaseChannel
- Build
- BuildAsset
- DownloadPolicy
- DownloadLink
- DownloadRequest
- Lead
- ConsentDefinition
- ConsentRecord
- EmailTemplate
- EmailLog
- BlogPost
- FaqItem
- NewsItem
- MediaAsset
- ContactRequest
- EnterpriseInterest
- FeatureRequest
- SoftwareDemandRequest
- TelemetryEvent
- AdminUser
- Role
- AdminAuditLog

### Minimalne metadane produktu po stronie web
- product_key
- edition_key
- channel_key
- current_version
- current_build_number
- latest_build_number
- min_supported_version
- installation_id
- lead_id
- os_name
- os_version
- locale

### Ograniczenia modelu danych
- Web platforma nie przechowuje pełnych danych operacyjnych Fito Gen.
- Jeden build należy do jednego produktu, jednej edycji i jednego kanału.
- Jeden kanał może mieć maksymalnie jeden build aktywny dla danego produktu i edycji.
- ConsentRecord jest powiązany z wersją definicji zgody.
- TelemetryEvent jest powiązany z installation_id oraz opcjonalnie z lead_id.
- MediaAsset obsługuje widoczność publiczną lub prywatną.
- Subscriber jako osobna encja nie jest potrzebny w MVP; stan subskrypcji wynika z Lead i ConsentRecord.
- Universal Desktop Support API v1 przechowuje wyłącznie metadane manifestów, paczek i kontraktów wspierających aplikacje desktopowe; nie przechowuje ich operacyjnych danych domenowych.

## 19. Integracje
### Integracje zewnętrzne
- Brevo – transactional e-mail i newsletter.
- Cloudflare – DNS, proxy, CDN i podstawowa ochrona ruchu.
- Cloudflare Turnstile – ochrona formularzy przed spamem i botami.
- VPS Filesystem Storage – przechowywanie buildów, PDF-ów i materiałów marketingowych.

### Integracje wewnętrzne i produktowe
- Desktop -> check_updates
- Desktop -> fetch_news_feed
- Desktop -> fetch_dictionary_manifest
- Desktop -> fetch_dictionary_package
- Desktop -> send_telemetry
- Desktop -> submit_feature_request
- Desktop -> submit_software_demand_request
- Web -> expose_release_metadata
- Web -> expose_news_items
- Web -> expose_download_targets
- Web -> expose_dictionary_manifests
- Web -> expose_reference_packages

Universal Desktop Support API v1 jest projektowane jako wspólna warstwa integracyjna dla wielu aplikacji desktopowych publikowanych przez eGen Labs, z pierwszym klientem w postaci Fito Gen Essentials.

### Import / eksport
- eksport leadów do CSV,
- eksport zgód do CSV,
- eksport formularzy kontaktowych do CSV,
- eksport Enterprise interest do CSV,
- eksport feature requests do CSV,
- eksport software demand requests do CSV,
- eksport filtrowanej telemetrii do CSV,
- upload buildów,
- upload PDF i innych materiałów marketingowych.

## 20. Założenia API i komunikacji
- REST API dla komunikacji synchronicznej.
- Wersjonowanie API od `/api/v1`.
- API ma być podzielone logicznie na grupy:
  - `/api/v1/auth/...`
  - `/api/v1/admin/...`
  - `/api/v1/registration/...`
  - `/api/v1/download/...`
  - `/api/v1/updates/...`
  - `/api/v1/news/...`
  - `/api/v1/telemetry/...`
  - `/api/v1/feedback/...`
  - `/api/v1/content/...` jako opcjonalna grupa publicznych treści strukturalnych, gdy będzie potrzebna
- Komunikacja desktopu z web platformą ma odbywać się przez JSON.
- Universal Desktop Support API v1 ma wspierać wspólny zestaw parametrów identyfikujących klienta desktopowego: `product`, `edition`, `channel`, `platform`, `appVersion`, `locale`.
- Capability groups Universal Desktop Support API v1 to: Update API, News Feed API, Dictionary Package API, Feedback API i Telemetry API.
- Read-only kontrakty manifestów i news feedu mają pozostawać publiczne lub półpubliczne zgodnie z konfiguracją produktu, ale nie mogą ujawniać prywatnych ścieżek storage.
- Dictionary Package API ma publikować manifesty i wersjonowane paczki referencyjne zgodne z lokalnym importem po stronie klienta desktopowego.
- Auth panelu administracyjnego w MVP korzysta z serwerowej sesji i mechanizmów aplikacji webowej; nie zakłada się publicznego token-based API dla logowania administratorów jako podstawowego modelu dostępu.
- Endpointy i akcje związane z auth mają służyć wyłącznie obsłudze panelu administracyjnego oraz kontroli sesji, a nie zewnętrznym integracjom.
- Wewnętrzne zdarzenia systemu pozostają w modularnym monolicie i nie wymagają brokera w MVP.
- Wewnętrzne zdarzenia obejmują co najmniej:
  - lead_registered
  - consent_recorded
  - marketing_consent_confirmed
  - download_requested
  - download_link_issued
  - build_published
  - news_item_published
  - telemetry_received
  - feature_request_submitted
  - software_demand_request_submitted
  - enterprise_interest_submitted
  - contact_request_submitted
  - email_sent
  - admin_content_changed

## 21. Bezpieczeństwo i kontrola dostępu
- Logowanie do panelu administracyjnego odbywa się przez e-mail i hasło.
- Panel administracyjny korzysta w MVP z serwerowego modelu sesji.
- Role: Admin i Editor w panelu administracyjnym.
- Pierwszy inkrement auth obejmuje logowanie, utrzymanie sesji, timeout sesji, wygasanie sesji oraz ochronę tras `/admin`.
- Bezpieczne hashowanie haseł jest obowiązkowe.
- Reset hasła e-mailem pozostaje funkcją docelową MVP, ale może zostać dostarczony po pierwszym inkremencie auth shell.
- Rate limiting dla logowania i wrażliwych endpointów.
- Podstawowa ochrona przed brute force.
- Walidacja wejścia i ochrona przed typowymi atakami webowymi, w tym XSS i CSRF, tam gdzie dotyczy.
- Sesje mają posiadać timeout i kontrolę wygasania.
- Log audytowy dla operacji krytycznych i zmian administracyjnych.
- Ochrona formularzy publicznych przez Turnstile.
- Ograniczanie dostępu do prywatnych zasobów i prywatnych PDF-ów.
- Kontrola uprawnień do treści, buildów i konfiguracji panelu.
- Telemetria traktowana jako dane diagnostyczne, wymagające świadomego modelu dostępu i retencji.
- 2FA pozostaje poza MVP jako potencjalne rozszerzenie i temat przyszłej decyzji hardeningowej.
- `.gitignore` jest obowiązkowym elementem ochrony operacyjnej repozytorium, ale nie zastępuje kontroli review, walidacji commitów i dyscypliny nieumieszczania danych wrażliwych w dokumentacji.
- Publiczne endpointy read-only Universal Desktop Support API v1 nie mogą ujawniać prywatnych ścieżek storage ani danych wrażliwych.
- Endpointy intake Universal Desktop Support API v1 muszą uwzględniać walidację wejścia, ograniczanie nadużyć i bezpieczne logowanie błędów.
- Paczki referencyjne publikowane przez platformę powinny posiadać metadane integralności, w szczególności checksumy.

## 22. Założenia infrastrukturalne i wdrożeniowe
- Środowiska: dev, staging, prod.
- Wdrożenie kontenerowe z użyciem Docker i Docker Compose.
- Hosting na VPS.
- Cloudflare przed warstwą aplikacyjną.
- PostgreSQL jako baza danych web platformy.
- Storage plików na VPS na start.
- Repozytorium kodu na GitHub.
- Version control: Git.
- CI/CD w wersji lekkiej, dostosowanej do pracy solo.
- Oddzielenie konfiguracji środowisk i sekretów od repozytorium.
- Migracje bazy uruchamiane w kontrolowany sposób.
- Staging wymagany ze względu na update flow, telemetry i panel administracyjny.
- Repozytorium GitHub musi publikować wyłącznie kod, dokumentację techniczną, migracje, bezpieczne przykłady konfiguracji oraz jawnie dozwolone assety.
- Pliki środowiskowe, sekrety, prywatne buildy, backupy, dumpy baz, lokalne storage i dane eksportowane z systemu muszą pozostawać poza repozytorium i być objęte `.gitignore`.
- Platforma musi wspierać publikację wersjonowanych manifestów i paczek dla Universal Desktop Support API v1.
- Wdrożenie Universal Desktop Support API v1 wymaga stabilnych URL-i dla manifestów i paczek oraz kontrolowanego procesu publikacji nowych wersji.

## 23. Aspekty operacyjne
- Centralne logowanie aplikacyjne backendu.
- Monitoring błędów backendu, nieudanych logowań, e-maili, formularzy, pobrań i endpointów update/news/telemetry.
- Backup bazy danych.
- Backup plików konfiguracyjnych i uploadów.
- Okresowy przegląd `.gitignore` oraz listy plików śledzonych przez Git przed publikacją zmian na GitHubie.
- Procedura operacyjna ma wymagać sprawdzenia, czy commit lub pull request nie zawiera danych wrażliwych, sekretów, prywatnych eksportów, backupów ani logów diagnostycznych z danymi użytkowników.
- Procedura restore dla MVP.
- Okresowe testy odtwarzania.
- Retencja danych roboczo:
  - Lead – 24 miesiące od ostatniej aktywności, potem przegląd i usunięcie lub anonimizacja.
  - ConsentRecord – przez czas aktywnego przetwarzania oraz 3 lata jako roboczy okres dowodowy po zakończeniu przetwarzania.
  - EmailLog – 12 miesięcy.
  - ContactRequest – 24 miesiące od ostatniej interakcji.
  - EnterpriseInterest – 24 miesiące od ostatniej interakcji.
  - FeatureRequest – 24 miesiące.
  - SoftwareDemandRequest – 24 miesiące.
  - TelemetryEvent – 12 miesięcy w formie identyfikowalnej, potem anonimizacja albo agregacja.
  - AdminAuditLog – 24 miesiące.
- Retencja wymaga późniejszego potwierdzenia prawnego i operacyjnego.
- Telemetria identyfikowalna powinna mieć krótszy cykl życia niż dane stricte biznesowe.
- Backup snapshots powinny mieć kontrolowaną rotację.
- Universal Desktop Support API v1 wymaga smoke testów kontraktów, kontroli zgodności payloadów oraz procedur publikacji i aktualizacji manifestów i paczek.

## 24. Fazy dostarczenia
- Faza 1: Foundation
  - architektura repo,
  - admin auth shell oparty o logowanie e-mail + hasło i serwerowe sesje,
  - ochrona tras `/admin`,
  - baza danych,
  - modele encji,
  - podstawy panelu,
  - podstawy strony publicznej.
- Faza 2: MVP Go-to-Market
  - landing,
  - formularze,
  - rejestracja i zgody,
  - e-maile,
  - download flow,
  - FAQ,
  - blog,
  - PDF,
  - kontakt.
- Faza 3: Product Support APIs
  - update endpoint,
  - news feed,
  - telemetry intake,
  - feature request,
  - software demand request,
  - Enterprise interest.
- Faza 4: Hardening & Launch
  - testy,
  - backup,
  - observability,
  - polityki,
  - staging/prod deploy,
  - treści launchowe.
- Faza 5: Universal Desktop Support API v1
  - capability map,
  - dokumentacja kontraktów,
  - dictionary package manifest i paczki referencyjne,
  - gap analysis repo względem kontraktów,
  - wdrożenie brakujących kontraktów potrzebnych dla Fito Gen Essentials oraz kolejnych aplikacji.

## 25. Obszary backlogu
- Platform Foundation
- Public Website
- Lead Capture & Consent
- Email & Newsletter
- Download Management
- Admin Panel & Content Management
- Desktop Support APIs
- Telemetry & Feedback
- Universal Desktop Support API v1
- Security & Compliance
- Deployment & Operations

## 26. Kryteria akceptacyjne
### Kryteria akceptacyjne MVP
- Strona publiczna działa na produkcji.
- Użytkownik może się zarejestrować i otrzymać e-mail z linkiem do pobrania.
- Zgody są zapisane, wersjonowane i możliwe do wykazania.
- Administrator może zarządzać buildami, treściami, linkami i materiałami PDF.
- Panel administracyjny wymaga poprawnego logowania e-mail + hasło.
- Dostęp do tras `/admin` jest chroniony sesją i kontrolą ról.
- Użytkownik z rolą Editor nie ma dostępu do operacji zastrzeżonych dla Admin.
- Blog, FAQ, kontakt i PDF działają.
- Blog zawiera minimum 3 artykuły startowe.
- Desktop może sprawdzić update i pobrać news feed.
- Telemetry intake działa i zapisuje dane.
- Feature request i software demand request działają.
- Backup i restore są opisane i sprawdzone.
- Środowiska staging i prod są uruchomione.

### Kryteria akceptacyjne fazy Universal Desktop Support API v1
- Istnieje zatwierdzona capability map Universal Desktop Support API v1.
- Istnieje kompletna dokumentacja kontraktów API v1 dla klientów desktopowych.
- Zidentyfikowano i opisano granice odpowiedzialności między web platformą a aplikacjami desktopowymi.
- Zidentyfikowano lukę między obecnym repo a wymaganymi kontraktami dla Fito Gen Essentials.
- Wdrożono lub zaplanowano brakujące kontrakty dla Update API, News Feed API i Dictionary Package API.

### Definition of done dla pojedynczego feature
Feature jest ukończony, gdy:
- działa funkcjonalnie,
- ma walidację i obsługę błędów,
- jest zabezpieczony adekwatnie do ryzyka,
- ma logowanie tam, gdzie to potrzebne,
- ma testy odpowiednie do ryzyka,
- dla funkcji związanych z auth i bezpieczeństwem posiada testy integracyjne odpowiednie do ryzyka,
- jest wdrażalny,
- jest opisany na tyle, aby dało się go utrzymać później.

## 27. Ryzyka
### Ryzyka techniczne
- Przeciążenie scope’u przez zbyt szerokie myślenie multi-product już w MVP.
- Zbyt rozbudowany panel administracyjny.
- Niedoszacowanie auth i bezpieczeństwa.
- Zbyt szeroka telemetria bez dopracowanego modelu danych i retencji.
- Zbyt skomplikowany download flow.
- Problemy z deliverability e-maili.
- Narastający dług techniczny przy pracy solo i szybkim tempie.
- Zbyt wczesne komplikowanie procesu stable/beta.

### Ryzyka biznesowe
- Niski współczynnik konwersji download po formularzu.
- Zbyt mała liczba jakościowego feedbacku od szkółek.
- Trudność dotarcia do producentów sadzonek i szkółek.
- Ryzyko przypadkowego opublikowania na GitHubie sekretów, plików środowiskowych, dumpów danych, buildów prywatnych lub dokumentacji zawierającej dane wrażliwe.
- Rozjazd między budową marki eGen Labs a potrzebą skupienia się na jednym produkcie.
- Za wczesne przejście do Pro bez walidacji Essentials.
- Zbyt słaba wartość treści marketingowych na starcie.
- Ryzyko, że formalny przepływ zgód i e-maili obniży konwersję, jeśli UX będzie zbyt ciężki.

### Ryzyka prawne i operacyjne
- Nieprawidłowe rozdzielenie zgody marketingowej od rejestracji operacyjnej.
- Niewystarczająco uzasadnione okresy retencji danych.
- Braki w audycie działań administracyjnych.
- Brak regularnego testu odtwarzania backupu.
- Ryzyko wycieku prywatnych assetów lub linków pobrania przy złej konfiguracji.
- Ryzyko scope creepu po stronie web platformy, jeśli Universal Desktop Support API v1 zacznie przejmować rolę backendu operacyjnego dla aplikacji desktopowych.

## 28. Dziennik zmian
- 2026-04-10 – utworzono początkową wersję dokumentu po zakończeniu etapów inicjacji projektu.
- 2026-04-10 – dodano baseline architektury, zakresu MVP, integracji i modelu dostarczania.
- 2026-04-10 – dodano Decision Log oraz ADR-y dla kluczowych decyzji długoterminowych.
- 2026-04-10 – dodano wymagania repozytoryjne dotyczące `.gitignore`, higieny repozytorium i ochrony danych wrażliwych przed publikacją na GitHubie.
- 2026-04-23 – doprecyzowano baseline auth dla panelu administracyjnego: logowanie e-mail + hasło, serwerowe sesje, role Admin/Editor oraz ochrona tras `/admin`.
- 2026-04-23 – zamknięto otwarte pytanie dotyczące modelu auth i sesji dla panelu administracyjnego oraz dodano decyzję i ADR dla admin auth shell MVP.

## 29. Decision Log

### DEC-001
- ADR ID: Brak
- Tytuł: Struktura marek i produktu
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Product
- Podsumowanie: Przyjęto strukturę eGen jako marka nadrzędna, eGen Labs jako submarka software/web oraz Fito Gen jako produkt z edycją Essentials.
- Sekcje, których dotyczy: 3, 4, 6, 7, 9

### DEC-002
- ADR ID: Brak
- Tytuł: Platforma multi-product z naciskiem MVP na Fito Gen Essentials
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Product
- Podsumowanie: Platforma eGen Labs jest projektowana od początku jako multi-product, ale MVP konwersyjnie koncentruje się na Fito Gen Essentials.
- Sekcje, których dotyczy: 4, 6, 7, 16, 24

### DEC-003
- ADR ID: Brak
- Tytuł: Zakres MVP i lista funkcji poza MVP
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Product
- Podsumowanie: Zatwierdzono zakres MVP obejmujący public site, admin panel, download flow, e-mail flow, update/news/telemetry i feedback, a także listę funkcji odłożonych poza MVP.
- Sekcje, których dotyczy: 6, 7, 8, 12, 26

### DEC-004
- ADR ID: ADR-002, ADR-003
- Tytuł: Stack i architektura MVP
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Architecture
- Podsumowanie: Przyjęto modularny monolit oparty o Next.js full-stack, TypeScript, PostgreSQL, Prisma, Docker, Cloudflare, VPS storage i Brevo.
- Sekcje, których dotyczy: 16, 17, 19, 20, 22

### DEC-005
- ADR ID: ADR-001
- Tytuł: Rozdzielenie danych desktopowych i danych web platformy
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Data
- Podsumowanie: Desktop pozostaje właścicielem danych operacyjnych produktu, a web platforma danych marketingowych, dystrybucyjnych, telemetrycznych i administracyjnych.
- Sekcje, których dotyczy: 16, 18, 19, 20

### DEC-006
- ADR ID: ADR-004
- Tytuł: REST API `/api/v1` dla funkcji wsparcia desktopu
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Integration
- Podsumowanie: Przyjęto wersjonowane REST API dla download, updates, news, telemetry, feedback i auth/admin.
- Sekcje, których dotyczy: 17, 19, 20

### DEC-007
- ADR ID: Brak
- Tytuł: Stable i beta jako kanały wydań MVP
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Product
- Podsumowanie: Produkt może mieć wiele buildów, ale jeden aktywny build na kanał, a kanały w MVP to stable i beta.
- Sekcje, których dotyczy: 7, 12, 15, 18

### DEC-008
- ADR ID: Brak
- Tytuł: Model dostarczania projektu
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Infrastructure
- Podsumowanie: Przyjęto model realizacji solo, low-cost, w horyzoncie 1–2 miesięcy oraz strategię startu hybrid.
- Sekcje, których dotyczy: 5, 22, 24, 25, 26, 27

### DEC-009
- ADR ID: ADR-005
- Tytuł: Custom admin panel zamiast zewnętrznego CMS
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Architecture
- Podsumowanie: Przyjęto własny panel administracyjny ze względu na niestandardowe modele buildów, zgód, download flow, telemetry intake i treści.
- Sekcje, których dotyczy: 7, 16, 17, 18, 20, 21

### DEC-010
- ADR ID: ADR-006
- Tytuł: Wewnętrzne zdarzenia bez message brokera w MVP
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Integration
- Podsumowanie: Wewnętrzna komunikacja zdarzeniowa pozostaje w modularnym monolicie bez zewnętrznego brokera.
- Sekcje, których dotyczy: 17, 19, 20

### DEC-011
- ADR ID: Brak
- Tytuł: Git i GitHub jako obowiązkowy toolchain projektu
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Infrastructure
- Podsumowanie: Przyjęto Git i GitHub jako obowiązkowy workflow version control i publikacji kodu.
- Sekcje, których dotyczy: 14, 22, 24, 25

### DEC-012
- ADR ID: ADR-003
- Tytuł: Prisma jako ORM dla web platformy
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Architecture
- Podsumowanie: Przyjęto Prisma jako ORM i narzędzie migracji dla web platformy.
- Sekcje, których dotyczy: 16, 18, 22

### DEC-013
- ADR ID: Brak
- Tytuł: Widoczność PDF one-pagera
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Product
- Podsumowanie: PDF one-pager może być publiczny albo prywatny, zgodnie z konfiguracją MediaAsset.
- Sekcje, których dotyczy: 7, 12, 15, 18, 21

### DEC-014
- ADR ID: Brak
- Tytuł: Higiena repozytorium i ochrona danych wrażliwych w GitHub
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Security
- Podsumowanie: Repozytorium projektu musi utrzymywać aktualny `.gitignore` i nie może zawierać sekretów, plików środowiskowych, dumpów danych, prywatnych buildów ani dokumentacji z danymi wrażliwymi.
- Sekcje, których dotyczy: 9, 14, 21, 22, 23, 27

### DEC-015
- ADR ID: ADR-007
- Tytuł: Minimalny admin auth shell dla MVP
- Status: Accepted
- Data: 2026-04-23
- Kategoria: Security
- Podsumowanie: Przyjęto, że pierwszy inkrement auth dla panelu administracyjnego będzie oparty o logowanie e-mail + hasło, serwerowe sesje, role Admin/Editor oraz ochronę tras `/admin`, bez 2FA w tym etapie.
- Sekcje, których dotyczy: 10, 16, 17, 20, 21, 24, 26

### DEC-016
- ADR ID: ADR-008
- Tytuł: Universal Desktop Support API v1 jako capability platformy
- Status: Accepted
- Data: 2026-04-30
- Kategoria: Architecture / Integration / Product
- Podsumowanie: Platforma egenlabs.eu zostaje rozszerzona o wspólną warstwę Universal Desktop Support API v1 dla aplikacji desktopowych publikowanych przez eGen Labs. Warstwa ta dostarcza kontrakty wsparcia, manifesty i paczki referencyjne, ale nie przejmuje operacyjnych danych domenowych aplikacji desktopowych.
- Sekcje, których dotyczy: 6, 7, 9, 10, 12, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

## 30. ADR-001: Separation of Operational Product Data and Web Platform Data
Status: Accepted
Data: 2026-04-10

### Kontekst
Fito Gen Essentials działa jako aplikacja desktopowa i posiada własne dane operacyjne użytkownika końcowego. Równolegle powstaje web platforma wspierająca marketing, dystrybucję, treści, leady, e-maile, update/news i telemetry intake. Istniało ryzyko zmieszania tych odpowiedzialności i niekontrolowanego rozszerzenia MVP w kierunku pełnego cloud backendu produktu.

### Decyzja
Desktop pozostaje właścicielem danych operacyjnych produktu. Web platforma pozostaje właścicielem danych marketingowych, dystrybucyjnych, telemetrycznych i administracyjnych. Web zna tylko minimalne metadane produktu potrzebne do download, update, news i telemetrii.

### Rozważane opcje
- Opcja A: web jako pełny backend dla danych operacyjnych produktu już w MVP
- Opcja B: pełne rozdzielenie właścicielstwa danych
- Opcja C: częściowa synchronizacja wybranych danych operacyjnych już w MVP

### Uzasadnienie
Wybrana opcja minimalizuje scope, ogranicza ryzyko architektoniczne, utrzymuje prostotę offline desktopu i chroni projekt przed przedwczesnym wejściem w cloud sync oraz złożoną zgodność danych.

### Konsekwencje
- Pozytywna konsekwencja 1: wyraźna granica odpowiedzialności między systemami.
- Pozytywna konsekwencja 2: prostsze MVP i mniejsze ryzyko wdrożeniowe.
- Negatywna konsekwencja 1: brak synchronizacji operacyjnej i self-service cloud w MVP.

### Ryzyka
- Późniejsza migracja do modelu cloud może wymagać dodatkowego etapu projektowego.
- Telemetria powiązana z leadem wymaga ostrożnej polityki prywatności i retencji.

### Dalsze działania
- Utrzymać minimalny zestaw metadanych produktu po stronie web.
- Nie wprowadzać cloud sync bez osobnej decyzji i aktualizacji ADR.

### Powiązane sekcje
- 16. Przegląd architektury
- 18. Przegląd modelu danych
- 19. Integracje
- 20. Założenia API i komunikacji

### Zastępuje / Zastąpiony przez
- Brak

## 31. ADR-002: Modular Monolith for eGen Labs Web Platform MVP
Status: Accepted
Data: 2026-04-10

### Kontekst
Projekt jest realizowany solo, low-cost, w krótkim horyzoncie czasowym. MVP musi obsłużyć public site, panel administracyjny i API dla desktopu, ale jednocześnie pozostać otwarte na rozwój multi-product. Podejście mikroserwisowe byłoby przedwczesne i kosztowne operacyjnie.

### Decyzja
MVP web platformy jest budowane jako modularny monolit w jednej aplikacji i jednym repozytorium.

### Rozważane opcje
- Opcja A: modularny monolit
- Opcja B: frontend i osobny backend API jako dwa systemy
- Opcja C: mikroserwisy od początku

### Uzasadnienie
Modularny monolit daje najlepszy kompromis między prostotą wdrożenia, szybkością pracy, testowalnością i możliwością dalszego rozwoju. Pozwala też zachować czytelne granice modułów bez zwiększania kosztu operacyjnego.

### Konsekwencje
- Pozytywna konsekwencja 1: prostszy deployment i utrzymanie.
- Pozytywna konsekwencja 2: łatwiejsze refaktoryzacje i krótsze pętle implementacyjne.
- Negatywna konsekwencja 1: większa dyscyplina modułowa jest wymagana wewnątrz jednego kodbase’u.

### Ryzyka
- Rozlanie odpowiedzialności między modułami, jeśli granice nie będą pilnowane.
- Nadmierna centralizacja logiki w jednym kodbase bez wyraźnych kontraktów.

### Dalsze działania
- Utrzymać jawny podział modułów.
- Pilnować wysokiej spójności i niskiego sprzężenia.
- Rozważyć późniejsze wydzielenie komponentów dopiero po realnej potrzebie.

### Powiązane sekcje
- 16. Przegląd architektury
- 17. Struktura modułów
- 22. Założenia infrastrukturalne i wdrożeniowe

### Zastępuje / Zastąpiony przez
- Brak

## 32. ADR-003: Next.js Full-Stack as the Primary Web Platform Runtime
Status: Accepted
Data: 2026-04-10

### Kontekst
Potrzebny był stack umożliwiający szybkie dowiezienie publicznego serwisu, panelu administracyjnego i API w jednym systemie, z zachowaniem niskiego kosztu utrzymania i dobrej ergonomii pracy solo. Rozważano również osobny backend API oraz alternatywne ORM-y.

### Decyzja
Web platforma używa Next.js full-stack z TypeScript, PostgreSQL i Prisma.

### Rozważane opcje
- Opcja A: Next.js full-stack + PostgreSQL + Prisma
- Opcja B: Next.js frontend + osobny backend API
- Opcja C: alternatywny full-stack runtime i/lub Drizzle jako ORM

### Uzasadnienie
Wybrany stack najlepiej wspiera szybki rozwój MVP, prostszy deployment i spójność kodu. Prisma daje wygodne migracje, historię SQL, dobrą ergonomię pracy z relacyjnym modelem danych i przydatne narzędzia operacyjne.

### Konsekwencje
- Pozytywna konsekwencja 1: jedna aplikacja obsługuje UI, admin i API.
- Pozytywna konsekwencja 2: prostszy model wdrożenia i mniejszy koszt pracy solo.
- Negatywna konsekwencja 1: część decyzji technicznych jest silniej związana z ekosystemem Next.js i Prisma.

### Ryzyka
- Nadmierne poleganie na jednym runtime bez kontroli granic modułów.
- Ryzyko zbyt luźnego modelowania bazy, jeśli migracje nie będą dyscyplinowane.

### Dalsze działania
- Utrzymać jawne migracje w repozytorium.
- Oddzielać logikę domenową od warstwy frameworkowej.
- Weryfikować wybór ORM przy wzroście złożoności projektu.

### Powiązane sekcje
- 16. Przegląd architektury
- 18. Przegląd modelu danych
- 22. Założenia infrastrukturalne i wdrożeniowe

### Zastępuje / Zastąpiony przez
- Brak

## 33. ADR-004: REST Versioned API for Desktop Support Features
Status: Accepted
Data: 2026-04-10

### Kontekst
Aplikacja desktopowa potrzebuje stabilnego, prostego i przewidywalnego interfejsu do sprawdzania aktualizacji, pobierania news feedu, wysyłania telemetrii i zgłoszeń. API musi być łatwe do wdrożenia i testowania w MVP.

### Decyzja
Przyjęto wersjonowane REST API od `/api/v1` dla download, updates, news, telemetry, feedback, auth i admin.

### Rozważane opcje
- Opcja A: REST JSON z wersjonowaniem
- Opcja B: GraphQL
- Opcja C: niewersjonowane endpointy ad hoc

### Uzasadnienie
REST JSON jest najprostsze, wystarczające i dobrze dopasowane do aplikacji desktopowej oraz pracy solo. Wersjonowanie od początku ogranicza ryzyko chaotycznych zmian kontraktów.

### Konsekwencje
- Pozytywna konsekwencja 1: przewidywalne kontrakty i prostsze testy integracyjne.
- Pozytywna konsekwencja 2: łatwiejsza ewolucja API w przyszłości.
- Negatywna konsekwencja 1: dodatkowa dyscyplina wersjonowania już od MVP.

### Ryzyka
- Rozrost liczby endpointów bez spójnych zasad.
- Ryzyko niespójności modeli odpowiedzi między modułami.

### Dalsze działania
- Utrzymać spójne nazewnictwo i modele odpowiedzi.
- Zdefiniować minimalne kontrakty dla desktopu.
- Dodać testy integracyjne dla endpointów wysokiego ryzyka.

### Powiązane sekcje
- 17. Struktura modułów
- 19. Integracje
- 20. Założenia API i komunikacji

### Zastępuje / Zastąpiony przez
- Brak

## 34. ADR-005: Custom Admin Panel Instead of External CMS for MVP
Status: Accepted
Data: 2026-04-10

### Kontekst
System musi zarządzać nie tylko treściami marketingowymi, ale także buildami, politykami pobrania, zgodami, logami e-maili, telemetrią i niestandardowymi formularzami. Zewnętrzny CMS nie pokrywa dobrze tych modeli bez znaczącej adaptacji.

### Decyzja
Przyjęto własny custom admin panel jako część tej samej aplikacji webowej.

### Rozważane opcje
- Opcja A: custom admin panel
- Opcja B: headless CMS z własnymi rozszerzeniami
- Opcja C: zewnętrzny CMS i osobne zaplecze administracyjne

### Uzasadnienie
Własny panel pozwala lepiej obsłużyć niestandardowe encje i workflow, ogranicza złożoność integracyjną i daje większą kontrolę nad bezpieczeństwem i UX administratora.

### Konsekwencje
- Pozytywna konsekwencja 1: pełna kontrola nad modelem danych i workflow.
- Pozytywna konsekwencja 2: łatwiejsza integracja z buildami, zgodami i telemetrią.
- Negatywna konsekwencja 1: większa odpowiedzialność za bezpieczeństwo i jakość panelu po stronie projektu.

### Ryzyka
- Rozrost zakresu panelu ponad realne potrzeby MVP.
- Niedoszacowanie czasu implementacji panelu przy pracy solo.

### Dalsze działania
- Ograniczać panel do funkcji realnie potrzebnych w MVP.
- Projektować role i uprawnienia z myślą o dalszym wzroście.
- Rozważyć rozbudowę workflow redakcyjnego dopiero później.

### Powiązane sekcje
- 7. Zakres MVP
- 17. Struktura modułów
- 18. Przegląd modelu danych
- 21. Bezpieczeństwo i kontrola dostępu

### Zastępuje / Zastąpiony przez
- Brak

## 35. ADR-006: Eventing Inside a Modular Monolith Without External Broker in MVP
Status: Accepted
Data: 2026-04-10

### Kontekst
System ma obsługiwać zdarzenia takie jak rejestracja leada, zapis zgody, wygenerowanie linku pobrania, publikacja buildu, telemetria i wysyłka e-maili. Trzeba było zdecydować, czy wprowadzać zewnętrzny broker wiadomości już w MVP.

### Decyzja
Wewnętrzne zdarzenia pozostają wewnątrz modularnego monolitu, bez osobnego brokera wiadomości.

### Rozważane opcje
- Opcja A: wewnętrzne eventing w modularnym monolicie
- Opcja B: zewnętrzny broker wiadomości od początku
- Opcja C: brak jawnego modelu zdarzeń

### Uzasadnienie
Wewnętrzne zdarzenia dają porządek architektoniczny bez kosztu operacyjnego brokera. Pozwalają zachować modularność i przygotować projekt pod ewentualną późniejszą ewolucję.

### Konsekwencje
- Pozytywna konsekwencja 1: prostsze wdrożenie i utrzymanie.
- Pozytywna konsekwencja 2: lepsze oddzielenie odpowiedzialności między modułami.
- Negatywna konsekwencja 1: przyszła migracja do brokera może wymagać dodatkowej warstwy adaptacyjnej.

### Ryzyka
- Eventing może zostać zaimplementowany zbyt luźno i bez spójnego kontraktu.
- Zdarzenia mogą zacząć pełnić rolę ukrytego, trudnego do śledzenia przepływu logiki.

### Dalsze działania
- Nazwać i utrzymać listę zdarzeń jawnie.
- Logować kluczowe zdarzenia operacyjne.
- Rozważyć broker dopiero po realnym wzroście złożoności i skali.

### Powiązane sekcje
- 17. Struktura modułów
- 19. Integracje
- 20. Założenia API i komunikacji

### Zastępuje / Zastąpiony przez
- Brak

## 36. ADR-007: Minimalny Admin Auth Shell dla MVP
Status: Accepted
Data: 2026-04-23

### Kontekst
Panel administracyjny jest częścią zakresu MVP i stanowi krytyczny punkt bezpieczeństwa platformy. Wcześniej baseline określał wymaganie logowania administracyjnego, ról i kontroli dostępu, ale pozostawiał otwarte pytanie o dokładny model auth i sesji. Projekt jest realizowany solo, w krótkim horyzoncie, a MVP nie powinno być przeciążone przedwczesną złożonością.

### Decyzja
Przyjęto, że pierwszy inkrement auth dla panelu administracyjnego będzie oparty o:
- logowanie e-mail + hasło,
- bezpieczne hashowanie haseł,
- serwerowy model sesji,
- timeout i wygasanie sesji,
- ochronę tras `/admin`,
- role Admin i Editor.

2FA nie wchodzi do tego inkrementu i pozostaje poza MVP, chyba że zostanie przyjęte osobną decyzją.
Reset hasła pozostaje funkcją docelową MVP, ale nie musi wejść do pierwszego inkrementu auth shell.

### Rozważane opcje
- Opcja A: serwerowe sesje dla panelu administracyjnego
- Opcja B: stateless auth oparty głównie o tokeny/JWT dla panelu administracyjnego
- Opcja C: bardziej rozbudowany model auth od startu, obejmujący 2FA i szersze flow bezpieczeństwa

### Uzasadnienie
Wybrana opcja daje najlepszy kompromis między bezpieczeństwem, prostotą wdrożenia, testowalnością i kosztem utrzymania na etapie MVP. Serwerowy model sesji dobrze pasuje do panelu administracyjnego w modularnym monolicie i ogranicza niepotrzebną złożoność w pierwszym etapie implementacji.

### Konsekwencje
- Pozytywna konsekwencja 1: prostszy i bardziej przewidywalny model bezpieczeństwa dla panelu administracyjnego.
- Pozytywna konsekwencja 2: szybsze domknięcie foundation bez rozszerzania MVP.
- Pozytywna konsekwencja 3: czytelna baza pod dalsze role, audyt i hardening.
- Negatywna konsekwencja 1: 2FA zostaje odłożone i wymaga osobnej decyzji w przyszłości.
- Negatywna konsekwencja 2: reset hasła może zostać dostarczony w kolejnym kroku, a nie w pierwszym inkremencie auth shell.

### Ryzyka
- Niedoszacowanie wymagań bezpieczeństwa panelu administracyjnego przy dalszym rozwoju.
- Zbyt szybkie rozszerzenie auth poza minimalny potrzebny zakres MVP.
- Ryzyko błędnej implementacji sesji, timeoutów lub ochrony tras bez odpowiednich testów integracyjnych.

### Dalsze działania
- Zaimplementować minimalny admin auth shell zgodny z tą decyzją.
- Dodać testy integracyjne dla logowania, sesji i ochrony tras.
- Ustalić w kolejnym kroku, czy reset hasła wchodzi od razu po auth shell.
- Rozważyć 2FA dopiero po ustabilizowaniu panelu administracyjnego i podstaw operacyjnych.

### Powiązane sekcje
- 10. Pytania otwarte
- 16. Przegląd architektury
- 17. Struktura modułów
- 20. Założenia API i komunikacji
- 21. Bezpieczeństwo i kontrola dostępu
- 24. Fazy dostarczenia
- 26. Kryteria akceptacyjne

### Zastępuje / Zastąpiony przez
- Brak

## 37. ADR-008: Universal Desktop Support API v1 jako wspólna warstwa wsparcia aplikacji desktopowych
Status: Accepted
Data: 2026-04-30

### Kontekst
Platforma egenlabs.eu została zbudowana jako web platforma promocyjno-dystrybucyjna dla produktów eGen Labs. W toku rozwoju pojawiła się potrzeba wspólnego, wieloproduktowego API wspierającego aplikacje desktopowe, w szczególności Fito Gen Essentials, a docelowo także inne aplikacje publikowane przez eGen Labs.

Aplikacje desktopowe wymagają wspólnej warstwy wsparcia dla:
- aktualizacji aplikacji,
- news feedu,
- manifestów i paczek referencyjnych,
- zgłoszeń ulepszeń,
- telemetrii.

Jednocześnie produkty desktopowe, w tym Fito Gen, pozostają aplikacjami offline-first i przechowują własne operacyjne dane domenowe lokalnie.

### Decyzja
Platforma egenlabs.eu przyjmuje odpowiedzialność za Universal Desktop Support API v1 jako wspólną capability platformy.

Warstwa ta obejmuje:
- Update API
- News Feed API
- Dictionary Package API
- Feedback API
- Telemetry API

Platforma publikuje kontrakty, manifesty, metadane i wersjonowane paczki wspierające aplikacje desktopowe, ale nie przejmuje operacyjnych danych domenowych tych aplikacji.

### Rozważane opcje
- Opcja A: osobne, niespójne API dla każdego produktu desktopowego
- Opcja B: wspólne Universal Desktop Support API v1 dla wielu produktów
- Opcja C: pełny backend operacyjny dla aplikacji desktopowych

### Uzasadnienie
Wybrano opcję B, ponieważ:
- wspiera wiele produktów bez duplikacji kontraktów,
- zachowuje prostotę i niski koszt utrzymania,
- nie wymusza migracji danych operacyjnych do chmury,
- jest zgodna z offline-first charakterem Fito Gen Essentials,
- tworzy spójną podstawę dla kolejnych aplikacji desktopowych eGen Labs.

Nie wybrano opcji A, ponieważ prowadziłaby do duplikacji i rozjazdu kontraktów.
Nie wybrano opcji C, ponieważ byłaby zbyt szeroka, zbyt kosztowna i wykraczałaby poza obecny zakres platformy.

### Konsekwencje
- Platforma uzyskuje nową, wspólną capability dla wielu aplikacji desktopowych.
- Kontrakty API muszą być projektowane jako wieloproduktowe i wersjonowane.
- Potrzebna jest jawna dokumentacja odpowiedzialności i granic integracji.
- Wymagane są testy kontraktowe i smoke testy manifestów oraz paczek.
- Dane operacyjne aplikacji desktopowych pozostają poza zakresem platformy webowej.

### Ryzyka
- scope creep po stronie web platformy,
- rozjechanie wspólnego kontraktu przez potrzeby kolejnych produktów,
- niejasność właścicielstwa danych referencyjnych,
- pokusa rozszerzenia platformy do roli backendu operacyjnego.

### Dalsze działania
- przygotować Capability Map v1,
- przygotować pełną dokumentację Universal Desktop Support API v1,
- wykonać gap analysis obecnego repo,
- wdrożyć brakujące kontrakty wymagane przez Fito Gen Essentials,
- dodać testy kontraktowe i smoke testy API.

### Powiązane sekcje
- 16. Przegląd architektury
- 17. Struktura modułów
- 19. Integracje
- 20. Założenia API i komunikacji
- 21. Bezpieczeństwo i kontrola dostępu
- 23. Aspekty operacyjne

### Zastępuje / Zastąpiony przez
- Brak
