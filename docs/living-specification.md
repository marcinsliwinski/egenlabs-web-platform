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
- Typ produktu: platforma webowa i produktowe zaplecze marki eGen Labs dla komunikacji, obsługi leadów, publikacji treści, dystrybucji oraz wsparcia produktów eGen
- Krótki opis:
  Platforma webowa eGen Labs wspiera prezentację skalowalnych aplikacji i specjalistycznych rozwiązań inżynieryjnych, publikację wiedzy i dokumentacji, dystrybucję aplikacji desktopowych, gromadzenie leadów, obsługę newslettera, telemetry intake oraz komunikację pomiędzy aplikacjami desktopowymi a zapleczem webowym. MVP koncentruje się na pierwszym produkcie cyfrowym Fito Gen Essentials, a public site po decyzjach DEC-020 i DEC-021 obejmuje również pełny katalog techniczny GEN-FED / CMC-GEN 261: 15 kompletnych Kitów, 4 samodzielne Un-Uny i 4 samodzielne choke’i.

## 4. Cel biznesowy
Celem biznesowym projektu jest uruchomienie profesjonalnej, skalowalnej platformy webowej eGen Labs, która:
- wspiera budowę marki eGen Labs jako platformy produktowej i product lab ekosystemu eGen,
- umożliwia skuteczną dystrybucję pierwszego produktu, Fito Gen Essentials,
- pozyskuje użytkowników i jakościowy feedback z rynku,
- buduje bazę kontaktów i zgód marketingowych,
- przygotowuje fundament pod wersję Pro oraz kolejne produkty eGen Labs,
- umożliwia prezentację technicznej linii produktowej GEN-FED bez uruchamiania sklepu, koszyka ani systemu zamówień w MVP.

Długoterminowo platforma ma wspierać model multi-product, a nie wyłącznie pojedynczy landing dla jednego programu ani klasyczną narrację usługowego software studio.

## 5. Kryteria sukcesu
### Kryteria sukcesu Visual Launch Candidate
- Publiczna strona eGen Labs może zostać uruchomiona jako profesjonalna wizytówka marki przed publikacją finalnego programu Fito Gen Essentials.
- Strona główna, kontakt, newsletter, FAQ, blog i podstawowe materiały informacyjne są prezentowane po polsku i w spójnej estetyce eGen Labs.
- Fito Gen Essentials jest prezentowany jako kompletny moduł produktowy z profesjonalnym opisem możliwości i granic odpowiedzialności. Bezpośredni link pobrania pozostaje nieeksponowany do czasu zatwierdzenia finalnego buildu desktopowego.
- Główne CTA prowadzą do możliwości Fito Gen, kontaktu i newslettera; pobranie zostanie aktywowane po zatwierdzeniu finalnego buildu desktopowego.
- Publiczny przekaz jasno komunikuje eGen Labs jako platformę produktową / product lab, a nie software studio ani software house.

### Kryteria sukcesu GEN-FED / CMC-GEN public product section
- Public site zawiera linie GEN-FED i CMC-GEN jako osobny pion produktów technicznych, bez rozmywania komunikacji Fito Gen.
- Strona `/products/gen-fed` prezentuje serie GEN-FED 40-10 i 80-10 oraz samodzielne transformatory 1:49 Un-Un.
- Strona `/products/cmc-gen` prezentuje samodzielne dławiki CMC-GEN 1:1.
- Katalog publiczny obejmuje dokładnie 23 SKU z dokumentacji v20: 15 Kitów, 4 Un-Uny i 4 choke’i.
- Kity używają wyłącznie wariantów długości S/M; wariant S jest skrócony cewką, a wariant M jest półfalowy dla właściwej serii.
- `GEN-FED 80-10 M µQRP` nie jest planowany i nie może być generowany ani prezentowany jako produkt.
- Każdy GEN-FED Kit zawiera promiennik, przeciwwagę, Un-Un 1:49, dopasowany CMC-GEN 1:1 Choke oraz elementy montażowe.
- Każdy produkt ma własną stronę z opisem, parametrami, zawartością, zasadami bezpieczeństwa i dokumentami publicznymi. Dane identyfikacyjne producenta mogą pozostawać w zatwierdzonych dokumentach PDF v20.
- Biblioteka `/downloads/ham-radio` publikuje wyłącznie dwa zatwierdzone PDF-y v20: instrukcję obsługi i instalacji oraz kartę techniczną.
- Oświadczenie producenta, analiza ryzyka, instrukcja konstrukcyjna, kontrola jakości, kwalifikacja prawna i ewidencja SN pozostają poza publicznym katalogiem.
- Sklep, koszyk, płatności, stany magazynowe i system zamówień pozostają poza zakresem MVP.

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
- publiczną stronę główną eGen Labs jako platformy produktowej / product lab,
- publiczną sekcję rozwiązań dostępną technicznie pod `/products`, obejmującą Fito Gen oraz linie GEN-FED i CMC-GEN,
- publiczny katalog GEN-FED / CMC-GEN 261 obejmujący 23 SKU, strony serii, strony produktów i bibliotekę zatwierdzonych dokumentów v20,
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
- stronę linii produktowej GEN-FED,
- strony serii GEN-FED 40-10 i GEN-FED 80-10,
- strony 15 kompletnych Kitów GEN-FED zgodnych z BAZA_SKU v20,
- stronę katalogową i strony 4 samodzielnych transformatorów GEN-FED 1:49 Un-Un,
- stronę katalogową i strony 4 samodzielnych dławików CMC-GEN 1:1 Choke,
- bibliotekę `/downloads/ham-radio` z aktywnymi dokumentami: instrukcją obsługi i instalacji v20 oraz kartą techniczną v20,
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

Zakres MVP pozostaje dominująco zorientowany na uruchomienie i obsługę pierwszego produktu cyfrowego, a pion krótkofalarski wchodzi jako publiczny, statyczny katalog informacyjny: 23 produkty GEN-FED / CMC-GEN 261, dwa dokumenty PDF v20 i kontakt w sprawie dostępności, bez handlu elektronicznego.

Publiczny moduł Fito Gen jest prezentowany jako docelowa, profesjonalna strona produktu. Aktywacja bezpośredniego pobierania pozostaje osobnym krokiem release i nastąpi po zatwierdzeniu finalnego buildu desktopowego.

Po zielonym checkpointcie MVP kolejną fazą platformy pozostaje Universal Desktop Support API v1 jako wspólna warstwa wsparcia dla wielu aplikacji desktopowych publikowanych przez eGen Labs, ale bieżący priorytet operacyjny przesunięto na visual launch pass, aby jak najszybciej wystartować z profesjonalną stroną publiczną.

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
- 2FA w pierwszej wersji, o ile nie zostanie dodane decyzją późniejszą,
- sklep internetowy, koszyk, płatności online i system zamówień dla GEN-FED,
- stany magazynowe i obsługa fulfillmentu GEN-FED,
- SKU niewystępujące w zatwierdzonej BAZA_SKU v20, w szczególności `GEN-FED 80-10 M µQRP`,
- publiczna publikacja dokumentów wewnętrznych producenta, w tym analizy ryzyka, instrukcji konstrukcyjnej, karty kontroli jakości, kwalifikacji prawnej i ewidencji SN,
- automatyczny generator deklaracji zgodności i dokumentacji technicznej GEN-FED / CMC-GEN.

## 9. Założenia
- Marka nadrzędna projektu to eGen.
- Operacyjną submarką produktowo-webową i product lab ekosystemu eGen jest eGen Labs.
- Pierwszym produktem wspieranym przez platformę jest Fito Gen w edycji Essentials.
- Pierwszą zaakceptowaną techniczną linią produktową public site poza Fito Gen jest GEN-FED.
- Publiczny katalog GEN-FED / CMC-GEN jest oparty na dokumentacji v20 i BAZA_SKU zawierającej 23 produkty.
- Linie GEN-FED Kit obejmują serie 40-10 oraz 80-10 i używają wyłącznie wariantów długości S/M.
- S oznacza promiennik skrócony cewką, a M oznacza promiennik półfalowy dla właściwej serii.
- Każdy Kit zawiera Un-Un, promiennik, przeciwwagę, dopasowany CMC-GEN 1:1 Choke i elementy montażowe.
- Wariant `GEN-FED 80-10 M µQRP` nie jest planowany.
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
- Czy docelowo GEN-FED / CMC-GEN ma otrzymać sklep, koszyk, płatności i obsługę stanów magazynowych, czy pozostać przy kontakcie w sprawie dostępności.
- Czy w przyszłości publikować dodatkowe dokumenty zewnętrzne, np. podpisane Oświadczenie producenta, mimo że nie jest ono wymagane jako standardowy plik do pobrania.
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
- WF-002A: System ma umożliwiać publiczny visual launch eGen Labs bez eksponowania finalnego linku do Fito Gen Essentials, dopóki desktopowe MVP programu nie jest ukończone.
- WF-002B: System ma udostępniać publiczną sekcję produktów `/products` jako katalog linii produktowych eGen Labs.
- WF-002C: System ma udostępniać publiczną stronę linii produktowej GEN-FED.
- WF-002D: System ma udostępniać publiczne strony serii GEN-FED 40-10 i GEN-FED 80-10.
- WF-002E: System ma udostępniać publiczne strony wszystkich 15 Kitów GEN-FED zgodnych z BAZA_SKU v20.
- WF-002F: System ma udostępniać publiczny katalog i strony 4 samodzielnych transformatorów GEN-FED 1:49 Un-Un.
- WF-002G: System ma udostępniać publiczny katalog i strony 4 samodzielnych dławików CMC-GEN 1:1 Choke.
- WF-002H: System ma udostępniać publiczną bibliotekę dokumentów krótkofalarskich `/downloads/ham-radio`, bez wymagania logowania i bez systemu zamówień.
- WF-002I: Biblioteka ma publikować wyłącznie zatwierdzoną instrukcję obsługi i instalacji v20 oraz kartę techniczną v20.
- WF-002J: System nie może generować ani prezentować niezatwierdzonych SKU, w szczególności `GEN-FED 80-10 M µQRP`.
- WF-002K: Każda karta produktu ma prezentować SKU, podstawowe parametry, zawartość, ostrzeżenia i linki do dokumentów publicznych, bez eksponowania prywatnego imienia, nazwiska, adresu ani telefonu producenta.
- WF-002L: System ma udostępniać dyskretną stronę `/legal` z informacją o charakterze katalogu, dokumentacji i sposobie kontaktu, bez powielania prywatnych danych producenta z dokumentów PDF.
- WF-002M: Publiczna nawigacja ma używać etykiety „Rozwiązania” dla technicznej trasy `/products` i zapewniać pełne, dostępne menu mobilne bez poziomego ukrywania pozycji.
- WF-002N: Formularz newslettera ma być dostępny bezpośrednio na stronie głównej i stronie kontaktowej przy użyciu jednego współdzielonego komponentu.
- WF-002O: Katalog ma umożliwiać opcjonalne przypisanie zdjęcia głównego i galerii do serii oraz poszczególnych modeli bez wymogu wdrożenia panelu uploadu w MVP.
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
- WNF-016: Nawigacja, formularze, tabele, przyciski i treści akcentowe muszą zachować użyteczność, czytelność i dostępność na urządzeniach mobilnych.
- WNF-017: Publiczne treści mają być merytoryczne, profesjonalne i spójne z pozycjonowaniem eGen Labs jako marki własnych rozwiązań inżynieryjnych.
- WNF-018: Lokalne assety buildów i dokumentów mogą być odczytywane wyłącznie ze zweryfikowanych ścieżek wewnątrz katalogu `storage/`; ścieżki absolutne, traversal i wyjście przez dowiązania symboliczne są odrzucane.
- WNF-019: Każdy push i pull request do `main` musi przechodzić automatyczny quality gate obejmujący zależności, Prisma, migracje, bootstrap, typecheck, lint, kontrolę storage, build i smoke testy.

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
- Publiczny katalog krótkofalarski jest katalogiem informacyjnym opartym na kontrolowanej BAZA_SKU v20, a nie systemem magazynowym ani sprzedażowym.
- Nazwa, SKU, wariant S/M, linia mocy, parametry i zawartość produktu muszą być zgodne z dokumentacją v20.
- Dla Kitów moc całego zestawu ogranicza zastosowany Un-Un, nawet jeżeli samodzielny choke tej samej linii ma wyższy limit.
- Oświadczenie producenta i dokumentacja wewnętrzna nie są publikowane standardowo na stronie; pozostają w dokumentacji technicznej producenta.

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
- Staging i produkcja działają na dwóch odrębnych VPS w OVHcloud, aby rozdzielić system operacyjny, Docker daemon, bazę, storage i sekrety.
- Każde środowisko korzysta z OVHcloud VPS-1: 4 vCore, 8 GB RAM i 75 GB storage, z Ubuntu Server 24.04 LTS oraz Docker Compose.
- Serwery są przeznaczone wyłącznie dla projektu `egenlabs.eu`; zasoby nie są rezerwowane dla innych projektów.
- Produkcyjny VPS jest zamawiany dopiero po formalnej decyzji staging GO.
- Trwały storage aplikacji znajduje się na właściwym VPS poza checkoutem repozytorium.
- Zaszyfrowane backupy bazy i storage są kopiowane poza VPS do prywatnego Cloudflare R2; automatyczna kopia VPS dostawcy jest warstwą dodatkową, a nie zamiennikiem backupu aplikacyjnego.
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

Publiczny katalog krótkofalarski pozostaje statycznym modułem treściowym w kodzie aplikacji. Nie wymaga nowych encji bazy danych ani API w MVP; dane katalogowe są rozdzielone na moduły Kitów, Un-Unów, choke’ów i dokumentów, a wszystkie strony korzystają ze wspólnych typów i komponentów.

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
- Ham Radio Product Catalog Module – statyczny, modułowy katalog 23 produktów GEN-FED / CMC-GEN 261, współdzielone typy, strony serii, strony produktów i kontrolowane referencje do dokumentacji v20.
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
- Ochrona formularzy publicznych przez Cloudflare Turnstile. Token jest obowiązkowo weryfikowany po stronie serwera przez Siteverify przed zapisem danych, utworzeniem leada lub wysłaniem e-maila.
- Staging i produkcja używają odrębnych site key i secret key Turnstile; sekret nie może być dostępny po stronie klienta ani występować w logach.
- Ograniczanie dostępu do prywatnych zasobów i prywatnych PDF-ów.
- Kontrola uprawnień do treści, buildów i konfiguracji panelu.
- Telemetria traktowana jako dane diagnostyczne, wymagające świadomego modelu dostępu i retencji.
- 2FA pozostaje poza MVP jako potencjalne rozszerzenie i temat przyszłej decyzji hardeningowej.
- `.gitignore` jest obowiązkowym elementem ochrony operacyjnej repozytorium, ale nie zastępuje kontroli review, walidacji commitów i dyscypliny nieumieszczania danych wrażliwych w dokumentacji.
- Publiczne endpointy read-only Universal Desktop Support API v1 nie mogą ujawniać prywatnych ścieżek storage ani danych wrażliwych.
- Endpointy intake Universal Desktop Support API v1 muszą uwzględniać walidację wejścia, ograniczanie nadużyć i bezpieczne logowanie błędów.
- Paczki referencyjne publikowane przez platformę powinny posiadać metadane integralności, w szczególności checksumy.
- Publiczna warstwa UI ma stosować zasadę minimalizacji danych: prywatne dane producenta nie są powielane na kartach produktowych ani w stopce, ale mogą pozostać w zatwierdzonych dokumentach produktu udostępnianych do pobrania.
- Pełna historia Git jest skanowana narzędziem Gitleaks przed release; zaakceptowany baseline z 2026-06-19 obejmuje 31 commitów i 0 wykrytych sekretów.
- Zależności produkcyjne nie mogą posiadać niezaakceptowanych podatności critical ani high. Podatności moderate wymagają analizy ekspozycji i wpisu do rejestru ryzyka.
- Wartości `storagePath` muszą wskazywać relatywne pliki wewnątrz `storage/builds/...` albo `storage/media/...`; ścieżki absolutne i wychodzące poza storage są zabronione.

## 22. Założenia infrastrukturalne i wdrożeniowe
- Środowiska: dev, staging, prod.
- Wdrożenie kontenerowe z użyciem Docker i Docker Compose.
- Hosting na dwóch odrębnych VPS w OVHcloud: osobnym dla stagingu i osobnym dla produkcji.
- Docelowy sizing obu środowisk: OVHcloud VPS-1, 4 vCore, 8 GB RAM i 75 GB storage, Ubuntu Server 24.04 LTS.
- Produkcyjny VPS jest kupowany i konfigurowany dopiero po zaakceptowaniu stagingu i decyzji GO.
- Cloudflare Free przed warstwą aplikacyjną, z DNS proxy i TLS w trybie `Full (strict)`.
- Reverse proxy jest jedyną usługą aplikacyjną wystawioną publicznie; PostgreSQL nie publikuje portu do Internetu.
- PostgreSQL jako baza danych web platformy.
- Storage plików na właściwym VPS na start, montowany poza repozytorium i odseparowany pomiędzy stagingiem i produkcją.
- Prywatny Cloudflare R2 jest zewnętrznym celem dla zaszyfrowanych backupów bazy i storage; przekroczenie darmowego limitu wymaga przeglądu kosztów i retencji.
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
- GitHub Actions quality gate jest obowiązkową bramką dla `main` i musi pozostać zielony przed stagingiem oraz produkcją.
- Runtime storage jest montowany poza repozytorium; aplikacja otrzymuje wyłącznie minimalne wymagane uprawnienia do katalogów buildów i mediów.

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
- Backup aplikacyjny obejmuje dump PostgreSQL, archiwum storage i sumy kontrolne, jest szyfrowany przed wysłaniem do prywatnego Cloudflare R2 i przechowywany oddzielnie dla stagingu oraz produkcji.
- Automatyczna kopia całego VPS oferowana przez dostawcę jest dodatkową warstwą awaryjną i nie zastępuje testowalnego backupu aplikacyjnego.
- Monitoring infrastruktury obejmuje co najmniej dostępność health endpointu, stan kontenerów, wykorzystanie dysku, RAM i CPU oraz wynik zadania backupowego.
- Zwiększenie planu VPS następuje na podstawie pomiarów, w szczególności trwałego użycia RAM powyżej 70–75%, stałego swapu, dysku powyżej 70% albo pogorszenia czasu odpowiedzi pod rzeczywistym obciążeniem.
- Universal Desktop Support API v1 wymaga smoke testów kontraktów, kontroli zgodności payloadów oraz procedur publikacji i aktualizacji manifestów i paczek.
- Przed release wykonywane są: pełny Gitleaks historii, `npm audit`, kontrola czystości Git oraz weryfikacja, że raporty bezpieczeństwa robocze nie są commitowane.
- Wynik kontroli bezpieczeństwa i zaakceptowane ryzyka zależności są zapisywane w dokumentacji release.

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
- Faza 4A: Public Site Visual Launch Candidate
  - profesjonalizacja wyglądu public site,
  - polska komunikacja marki eGen Labs,
  - start strony bez finalnego linku do programu Fito Gen,
  - CTA na kontakt i newsletter,
  - publiczna sekcja produktów obejmująca Fito Gen, GEN-FED i CMC-GEN,
  - statyczny, modułowy katalog 23 produktów GEN-FED / CMC-GEN 261,
  - strony serii 40-10 i 80-10, katalog Un-Unów, katalog CMC-GEN i strony wszystkich SKU,
  - publikacja instrukcji obsługi i instalacji v20 oraz karty technicznej v20,
  - przygotowanie strony pod późniejszy Product Download Launch.
- Faza 4B: Security Closure & Staging Readiness
  - zielony GitHub Actions quality gate,
  - pełny skan historii Git i przegląd zależności,
  - udokumentowanie zaakceptowanych ryzyk upstream,
  - ograniczenie ścieżek lokalnego storage,
  - checklista stagingowa, backup i restore drill,
  - przygotowanie formalnego release checkpoint.
- Faza 4C: Staging, Production & Web MVP Closure
  - wdrożenie stagingu na odrębnym OVHcloud VPS-1,
  - usunięcie STG-GAP-001 przez pełną integrację Cloudflare Turnstile z walidacją Siteverify po stronie serwera,
  - testy integracji, QA, backup i restore drill,
  - formalna decyzja staging GO / NO-GO,
  - zakup i wdrożenie odrębnego produkcyjnego OVHcloud VPS-1 dopiero po staging GO,
  - produkcyjny smoke test, pierwszy backup i formalne zamknięcie Web MVP.
- Faza 5: Universal Desktop Support API v1
  - capability map,
  - dokumentacja kontraktów,
  - dictionary package manifest i paczki referencyjne,
  - gap analysis repo względem kontraktów,
  - wdrożenie brakujących kontraktów potrzebnych dla Fito Gen Essentials oraz kolejnych aplikacji.

## 25. Obszary backlogu
- Platform Foundation
- Public Website
- Public Site Visual Launch
- Brand & Visual Correction Pass
- Final Public Content, Mobile UX & Image-ready Catalog Pass
- GEN-FED / CMC-GEN Product Catalog 261
- Ham Radio Public Documentation v20
- Lead Capture & Consent
- Email & Newsletter
- Download Management
- Admin Panel & Content Management
- Desktop Support APIs
- Telemetry & Feedback
- Universal Desktop Support API v1
- Security & Compliance
- Security Closure & Staging Readiness
- Deployment & Operations

## 26. Kryteria akceptacyjne
### Kryteria akceptacyjne Visual Launch Candidate
- Strona główna wygląda profesjonalnie i jest spójna z kierunkiem eGen Labs jako platformy produktowej / product lab.
- Publiczna komunikacja jest po polsku.
- Główne CTA prowadzą do możliwości Fito Gen, kontaktu i newslettera; pobranie zostanie aktywowane po zatwierdzeniu finalnego buildu desktopowego.
- Publiczny przekaz jasno komunikuje eGen Labs jako platformę produktową / product lab, a nie software studio ani software house.
- Fito Gen Essentials jest prezentowany jako kompletny moduł produktowy bez komunikatów o niedokończeniu; bezpośrednie pobranie pozostaje nieeksponowane do zatwierdzenia finalnego buildu desktopowego.
- Download flow pozostaje technicznie dostępny, ale nie jest promowany w głównej nawigacji do czasu ukończenia desktopowego MVP.
- Publiczne strony formularzy, bloga, FAQ i materiału PDF są spójne wizualnie.
- Publiczna sekcja `/products` prezentuje Fito Gen, GEN-FED i CMC-GEN jako linie produktowe eGen Labs.
- Strony GEN-FED / CMC-GEN nie sugerują istnienia sklepu, koszyka ani dostępności sprzedażowej bez potwierdzenia.
- Katalog zawiera dokładnie 23 zatwierdzone SKU i nie zawiera wariantu `GEN-FED 80-10 M µQRP`.
- Każdy Kit jest opisany jako zestaw zawierający Un-Un, promiennik, przeciwwagę, CMC-GEN i elementy montażowe.
- Warianty długości są ograniczone do S/M i opisane zgodnie z dokumentacją v20.
- Biblioteka dokumentów udostępnia działające linki do dwóch PDF-ów v20: instrukcji obsługi i instalacji oraz karty technicznej.
- Strony reprezentatywnych produktów, landingów katalogowych oraz obu PDF-ów są objęte smoke testami.
- Publiczna strona `/legal` działa, jest dostępna ze stopki i nie publikuje prywatnych danych producenta.
- Nagłówki sekcji nie mają końcowych kropek, tekst na zielonych polach zachowuje czytelny kontrast, a tabele produktowe są użyteczne na urządzeniach mobilnych.
- Publiczna strona nie eksponuje wewnętrznych sformułowań projektowych typu „launch candidate”, „następny krok” ani „strona jako wizytówka marki”.
- Mobilna nawigacja pokazuje wszystkie pozycje w kontrolowanym panelu i jest obsługiwana klawiaturą.
- Widoczna nazwa głównej sekcji to „Rozwiązania”, przy zachowaniu stabilnego URL `/products`.
- Formularz newslettera jest dostępny bezpośrednio na stronie głównej i kontaktowej.
- Typografia nagłówków nie dominuje nad treścią na urządzeniach mobilnych.
- Katalog obsługuje opcjonalne zdjęcia serii i modeli zgodnie z udokumentowanym standardem plików.
- Ogólna komunikacja GEN-FED / CMC-GEN może wskazywać komponenty stosowane w rodzinie rozwiązań, a karty konkretnych SKU pozostają zgodne z ich rzeczywistą konfiguracją.
- GitHub Actions quality gate przechodzi dla bieżącego `main`.
- Pełny skan Gitleaks historii Git nie wykrywa sekretów, a `npm audit` nie zgłasza niezaakceptowanych podatności critical ani high.
- Odczyt lokalnych assetów jest ograniczony do `storage/` i objęty automatycznym testem ścieżek poprawnych oraz niedozwolonych.
- Istnieją aktualne raport bezpieczeństwa, plan zamknięcia i checklista stagingowa.

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
- Środowiska staging i prod są uruchomione na odrębnych VPS, używają odrębnych baz, storage i sekretów, a PostgreSQL nie jest publicznie dostępny.
- Wszystkie publiczne formularze wymagające ochrony Turnstile weryfikują token po stronie serwera przed zapisem danych i wysyłką e-maila.
- Backup bazy i storage jest kopiowany w postaci zaszyfrowanej poza VPS, a restore drill kończy się zielonym health i smoke testem.

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

### Ryzyka publicznego visual launch
- Ryzyko opublikowania strony zbyt technicznej lub zbyt anglojęzycznej względem polskiego rynku startowego.
- Ryzyko obietnicy pobrania programu przed ukończeniem desktopowego Fito Gen Essentials.
- Ryzyko rozmycia pozycjonowania marki przez zbyt wiele kierunków produktowych naraz, w tym przez zbyt mocne eksponowanie GEN-FED przed pełnym dopracowaniem Fito Gen.
- Ryzyko rozjazdu danych między BAZA_SKU v20, kartami produktów i publicznymi PDF-ami.
- Ryzyko przypadkowego wygenerowania niezatwierdzonego wariantu `GEN-FED 80-10 M µQRP`.
- Ryzyko publikacji dokumentacji wewnętrznej producenta lub ewidencji SN w katalogu publicznym.
- Ryzyko sugerowania gotowości sprzedażowej GEN-FED / CMC-GEN, mimo że MVP obejmuje katalog, dokumenty i kontakt w sprawie dostępności.
- Ryzyko opóźnienia Product Download Launch, jeśli visual pass zacznie rozszerzać zakres zamiast poprawiać prezentację.
- Ryzyko błędnego pozycjonowania eGen Labs jako software studio lub software house zamiast platformy produktowej / product lab.
- Ryzyko pozostawienia na stronie publicznej wewnętrznego języka projektowego, który obniża wiarygodność marki dla klienta końcowego.
- Ryzyko niskiego kontrastu tekstu na polach akcentowych i utrudnionej obsługi tabel katalogowych na urządzeniach mobilnych.
- Ryzyko ukrywania pozycji nawigacji na wąskich ekranach bez czytelnego mechanizmu menu.
- Ryzyko rozjazdu między ogólnymi deklaracjami marketingowymi o komponentach rodziny produktów a faktyczną konfiguracją pojedynczego SKU.
- Ryzyko publikacji nieoptymalnych zdjęć o niewłaściwym formacie, rozdzielczości lub opisie alternatywnym.
- RISK-SEC-001: Next.js 16.2.9 dostarcza zależność PostCSS raportowaną jako moderate; aktualny zakres nie przyjmuje niezaufanego CSS, ryzyko jest tymczasowo zaakceptowane i monitorowane przy aktualizacjach frameworka.
- Ryzyko nieprawidłowej konfiguracji runtime storage lub dowiązań symbolicznych; ograniczone przez walidację ścieżek, realpath i smoke test.

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
- Ryzyko braku komercyjnego SLA w planie Cloudflare Free; dla obecnej skali zaakceptowane, monitorowane po uruchomieniu produkcji.
- Ryzyko utraty dostępności pojedynczego środowiska przy awarii jego VPS; ograniczone przez rozdzielenie stagingu i produkcji, backup poza VPS i procedurę odtworzeniową.
- Ryzyko przekroczenia darmowego limitu Cloudflare R2 lub błędnej retencji backupów; ograniczone przez monitoring rozmiaru, rotację i alert progowy.
- Ryzyko obsługi dwóch hostów przy pracy solo; ograniczone przez identyczny stack Docker Compose, checklisty i automatyzację powtarzalnych czynności.

## 28. Dziennik zmian
- 2026-04-10 – utworzono początkową wersję dokumentu po zakończeniu etapów inicjacji projektu.
- 2026-04-10 – dodano baseline architektury, zakresu MVP, integracji i modelu dostarczania.
- 2026-04-10 – dodano Decision Log oraz ADR-y dla kluczowych decyzji długoterminowych.
- 2026-04-10 – dodano wymagania repozytoryjne dotyczące `.gitignore`, higieny repozytorium i ochrony danych wrażliwych przed publikacją na GitHubie.
- 2026-04-23 – doprecyzowano baseline auth dla panelu administracyjnego: logowanie e-mail + hasło, serwerowe sesje, role Admin/Editor oraz ochrona tras `/admin`.
- 2026-04-23 – zamknięto otwarte pytanie dotyczące modelu auth i sesji dla panelu administracyjnego oraz dodano decyzję i ADR dla admin auth shell MVP.
- 2026-05-15 – zaakceptowano korektę pozycjonowania public site: eGen Labs jako platforma produktowa / product lab ekosystemu eGen, nie software studio ani software house.
- 2026-05-15 – zaakceptowano dodanie linii produktowej GEN-FED do public site w ograniczonym zakresie: strony produktowe, biblioteka planowanych instrukcji i deklaracji PDF oraz kontakt w sprawie dostępności, bez sklepu, koszyka i systemu zamówień.
- 2026-06-17 – DEC-021 zastąpiła szczegółowy startowy zakres GEN-FED pełnym katalogiem GEN-FED / CMC-GEN 261 obejmującym 23 SKU, model S/M, dokumentację v20 i dwa publiczne PDF-y.
- 2026-06-17 – potwierdzono, że pusta strona identyfikacyjna instrukcji pozostaje miejscem na wklejkę z numerem seryjnym, a Oświadczenie producenta pozostaje dokumentem technicznym niepublikowanym standardowo.
- 2026-06-17 – usunięto z publicznych kart produktów sekcję zawierającą prywatne dane identyfikacyjne producenta. Zaakceptowano pozostawienie danych identyfikacyjnych w zatwierdzonych dokumentach PDF v20. Ujednolicono nagłówki bez końcowych kropek i zwiększono kontrast tekstu na zielonych polach.
- 2026-06-17 – zaakceptowano dyskretną stronę informacji prawnych i wykonanie pełnego visual refinement pass bez rozszerzania funkcji MVP; usunięto wewnętrzny język projektowy z publicznej strony, poprawiono hierarchię, responsywność katalogu i czytelność CTA.

- 2026-06-18 – zaakceptowano i wdrożono DEC-023: finalny public content, mobile UX i image-ready catalog pass. Zmieniono widoczną etykietę „Produkty” na „Rozwiązania”, dodano pełne menu mobilne, osadzono newsletter, poprawiono typografię i kontrast, dodano opis jakości GEN-FED / CMC-GEN oraz opcjonalny model zdjęć serii i produktów.

- 2026-06-18 – zaakceptowano i wdrożono DEC-024: zmniejszono skalę publicznych nagłówków, skrócono główny komunikat do „Praktyczna inżynieria” oraz przebudowano Fito Gen Essentials jako docelowy moduł produktowy bez wewnętrznego języka o stanie prac.
- 2026-06-18 – zaakceptowano i wdrożono DEC-025: dodano GitHub Actions quality gate dla instalacji, Prisma, migracji, bootstrapu, typecheck, lint, build i smoke testów oraz publiczną politykę SECURITY.md.
- 2026-06-19 – zaakceptowano i wdrożono DEC-026: zamknięto kontrolę bezpieczeństwa, zapisano wynik Gitleaks i audytu zależności, zaakceptowano RISK-SEC-001, ograniczono ścieżki assetów do `storage/`, dodano test regresji storage oraz checklistę stagingową.
- 2026-06-19 – zaakceptowano DEC-027 i ADR-011: staging i produkcja zostaną wdrożone na odrębnych OVHcloud VPS-1 z Ubuntu Server 24.04 LTS i Docker Compose, wyłącznie dla `egenlabs.eu`; produkcyjny VPS zostanie zakupiony dopiero po staging GO, a zaszyfrowane backupy aplikacyjne będą kopiowane do prywatnego Cloudflare R2.

## 29. Decision Log

### DEC-001
- ADR ID: Brak
- Tytuł: Struktura marek i produktu
- Status: Accepted
- Data: 2026-04-10
- Kategoria: Product
- Podsumowanie: Przyjęto strukturę eGen jako marka nadrzędna, eGen Labs jako submarka produktowo-webowa / product lab oraz Fito Gen jako produkt z edycją Essentials.
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

### DEC-017
- ADR ID: ADR-009
- Tytuł: Contract Design Freeze dla Universal Desktop Support API v1 Core
- Status: Accepted
- Data: 2026-05-13
- Kategoria: Architecture / Integration / API / Product
- Podsumowanie: Po zielonym Web MVP checkpoint kolejnym etapem projektu jest stabilizacja kontraktów Core Universal Desktop Support API v1 przed dalszym kodowaniem i integracją Fito Gen Essentials. Core v1 obejmuje Update API, News Feed API i Dictionary Package API.
- Sekcje, których dotyczy: 10, 12, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27

### DEC-018
- ADR ID: ADR-010
- Tytuł: Public Site Visual Launch Candidate przed publikacją programu Fito Gen
- Status: Accepted; status publicznej prezentacji Fito Gen częściowo zastąpiony przez DEC-024
- Data: 2026-05-15
- Kategoria: Product / UX / Brand / Delivery
- Podsumowanie: Priorytet bieżącego kroku zostaje przesunięty na profesjonalny visual launch publicznej strony eGen Labs. Link do Fito Gen Essentials i sam program zostaną dodane w kolejnym kroku po ukończeniu desktopowego MVP. Strona ma startować jako spójna, polska i wiarygodna wizytówka marki z CTA na kontakt i newsletter.
- Sekcje, których dotyczy: 4, 5, 6, 7, 9, 10, 12, 24, 25, 26, 27

### DEC-019
- ADR ID: Brak
- Tytuł: Pozycjonowanie public site jako eGen product platform, nie software studio
- Status: Accepted
- Data: 2026-05-15
- Kategoria: Product / UX / Brand
- Podsumowanie: Publiczna strona eGen Labs ma komunikować markę jako platformę produktową i product lab ekosystemu eGen. Główny przekaz nie może sugerować klasycznego software studio, software house ani usług programistycznych na zamówienie. Strona ma eksponować produkty własne, praktyczną dokumentację, wiedzę branżową, Fito Gen jako pierwszy produkt oraz przyszłe kierunki produktowe bez rozmywania startu MVP.
- Sekcje, których dotyczy: 3, 4, 5, 6, 7, 9, 24, 25, 26, 27

### DEC-020
- ADR ID: Brak
- Tytuł: Dodanie linii produktowej GEN-FED do public site
- Status: Accepted
- Data: 2026-05-15
- Kategoria: Product / UX / Content / Compliance
- Podsumowanie: Zaakceptowano utworzenie linii produktowej GEN-FED jako osobnego pionu produktów technicznych eGen Labs. Pierwotny szczegółowy zakres trzech produktów startowych został następnie zastąpiony przez DEC-021 pełnym katalogiem GEN-FED / CMC-GEN 261. Sklep, koszyk, płatności i system zamówień pozostają poza zakresem.
- Sekcje, których dotyczy: 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 17, 24, 25, 26, 27


### DEC-021
- ADR ID: Brak
- Tytuł: Pełny publiczny katalog GEN-FED / CMC-GEN 261 i dokumentacja v20
- Status: Accepted
- Data: 2026-06-17
- Kategoria: Product / UX / Content / Compliance
- Podsumowanie: Szczegółowy startowy zakres z DEC-020 zostaje zastąpiony pełnym publicznym katalogiem opartym na BAZA_SKU v20. Katalog obejmuje 15 kompletnych Kitów GEN-FED, 4 samodzielne transformatory 1:49 Un-Un i 4 samodzielne choke’i CMC-GEN. Kity używają wyłącznie wariantów S/M i zawierają Un-Un, promiennik, przeciwwagę, dopasowany choke oraz elementy montażowe. Wariant `GEN-FED 80-10 M µQRP` nie jest planowany. Publicznie udostępniane są instrukcja obsługi i instalacji v20 oraz karta techniczna v20. Oświadczenie producenta i dokumenty wewnętrzne pozostają w dokumentacji technicznej producenta. Pusta strona identyfikacyjna instrukcji pozostaje przeznaczona na wklejkę z numerem seryjnym. Publiczne karty produktów nie prezentują prywatnego imienia, nazwiska, adresu ani telefonu producenta; zatwierdzone dane identyfikacyjne mogą pozostawać w publicznych dokumentach PDF v20.
- Sekcje, których dotyczy: 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 17, 24, 25, 26, 27, 28

### DEC-022
- ADR ID: Brak
- Tytuł: Dyskretna sekcja prawna i pełny visual refinement public site
- Status: Accepted
- Data: 2026-06-17
- Kategoria: Product / UX / Brand / Privacy
- Podsumowanie: Public site otrzymuje dyskretną stronę `/legal` dostępną ze stopki, bez powielania prywatnych danych producenta na kartach produktowych. Dane identyfikacyjne mogą pozostać w zatwierdzonych dokumentach PDF v20. Visual refinement obejmuje usunięcie wewnętrznego języka projektowego z treści publicznych, poprawę hierarchii wizualnej, kontrastu zielonych pól, responsywności tabel, nawigacji, kart produktowych i CTA bez dodawania nowych funkcji domenowych.
- Sekcje, których dotyczy: 6, 7, 12, 13, 21, 24, 25, 26, 27, 28


### DEC-023
- ADR ID: Brak
- Tytuł: Finalny public content, mobile UX i image-ready catalog pass
- Status: Accepted
- Data: 2026-06-18
- Kategoria: Product / UX / Brand / Content
- Podsumowanie: Public site używa widocznej etykiety „Rozwiązania” przy zachowaniu technicznej trasy `/products`, otrzymuje pełne menu mobilne, ograniczoną skalę typografii, profesjonalne i krótsze treści, zintegrowany układ kontaktu i newslettera, poprawiony kontrast CTA oraz opcjonalny model zdjęć dla serii i modeli. Podpis marki brzmi „Rozwiązania inżynieryjne do praktycznych zastosowań”. Ogólny opis GEN-FED / CMC-GEN wskazuje komponenty stosowane w rodzinie produktów, w tym rdzenie Amidon produkowane przez Fair-Rite, przewody HUBER+SUHNER, złącza Amphenol i izolacje FEP, PTFE oraz kaptonowe, bez automatycznego przypisywania wszystkich komponentów każdemu SKU.
- Sekcje, których dotyczy: 3, 5, 6, 7, 12, 13, 15, 17, 24, 25, 26, 27, 28

### DEC-024
- ADR ID: Brak
- Tytuł: Kompaktowa hierarchia typografii i docelowy moduł Fito Gen
- Status: Accepted
- Data: 2026-06-18
- Kategoria: Product / UX / Brand / Content
- Podsumowanie: Publiczne nagłówki otrzymują mniejszą, bardziej profesjonalną skalę. Główny komunikat strony brzmi „Praktyczna inżynieria”. Fito Gen Essentials jest prezentowany jako kompletny moduł produktowy z opisem możliwości, modelu offline-first i granic danych, bez komunikatów o niedokończonym produkcie, buildach i wewnętrznych etapach prac. Bezpośredni link pobrania pozostaje odrębnym krokiem release po zatwierdzeniu finalnego buildu desktopowego.
- Sekcje, których dotyczy: 3, 5, 6, 7, 12, 13, 24, 25, 26, 27, 28

### DEC-025
- ADR ID: Brak
- Tytuł: Automatyczny quality gate CI i polityka zgłaszania podatności
- Status: Accepted
- Data: 2026-06-18
- Kategoria: Infrastructure / Security / Quality
- Podsumowanie: Repozytorium otrzymuje workflow GitHub Actions uruchamiany dla push i pull request do `main`. Quality gate wykonuje instalację zależności, generowanie Prisma Client, migracje, bootstrap danych testowych, typecheck, lint, build, uruchomienie aplikacji i smoke testy. Dodano `SECURITY.md` określający prywatne zgłaszanie podatności i zakaz publikowania sekretów oraz danych wrażliwych.
- Sekcje, których dotyczy: 13, 14, 21, 22, 23, 24, 25, 26, 27, 28

### DEC-026
- ADR ID: Brak
- Tytuł: Security closure and staging readiness baseline
- Status: Accepted
- Data: 2026-06-19
- Kategoria: Security / Infrastructure / Operations / Quality
- Podsumowanie: Zamknięto kontrolę bezpieczeństwa Web MVP na podstawie pełnego skanu historii Git, audytu zależności i zielonego quality gate. Udokumentowano tymczasowo zaakceptowane ryzyko PostCSS, ograniczono lokalne ścieżki buildów i PDF do katalogu `storage/`, dodano kontrolę realpath i smoke test ścieżek oraz przygotowano checklistę stagingową i zaktualizowany release checkpoint.
- Sekcje, których dotyczy: 13, 14, 17, 21, 22, 23, 24, 25, 26, 27, 28, 39

### DEC-027
- ADR ID: ADR-011
- Tytuł: Odrębne VPS dla stagingu i produkcji Web MVP
- Status: Accepted
- Data: 2026-06-19
- Kategoria: Infrastructure / Security / Operations / Deployment
- Podsumowanie: Staging i produkcja `egenlabs.eu` działają na odrębnych OVHcloud VPS-1 z Ubuntu Server 24.04 LTS i Docker Compose. Oba serwery są przeznaczone wyłącznie dla tego projektu. Produkcyjny VPS jest kupowany dopiero po formalnej decyzji staging GO. Bazy, storage, sieci i sekrety są rozdzielone, PostgreSQL nie jest wystawiony publicznie, a zaszyfrowane backupy aplikacyjne są kopiowane do prywatnego Cloudflare R2.
- Sekcje, których dotyczy: 16, 21, 22, 23, 24, 26, 27, 28

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


## 38. ADR-009: Contract Design Freeze dla Universal Desktop Support API v1 Core
Status: Accepted
Data: 2026-05-13

### Kontekst
Po osiągnięciu zielonego Web MVP checkpoint projekt eGen Labs Web Platform przechodzi do kolejnej fazy v1 związanej z Universal Desktop Support API v1. Repozytorium zawiera fundamenty wybranych endpointów desktopowych, ale Dictionary Package API i pełne kontrakty wymagają stabilizacji przed integracją Fito Gen Essentials.

### Decyzja
Projekt przyjmuje etap Contract Design Freeze dla Universal Desktop Support API v1 Core. Core v1 obejmuje Update API, News Feed API i Dictionary Package API. Najpierw należy przygotować stabilne kontrakty endpointów, parametrów, payloadów, statusów, błędów i testów kontraktowych, a dopiero potem wdrażać brakujące capability.

### Rozważane opcje
- Opcja A: najpierw implementować brakujące endpointy, a dokumentację przygotować później.
- Opcja B: najpierw zamrozić kontrakty Core v1, potem wdrożyć brakujące endpointy i testy.
- Opcja C: odłożyć Dictionary Package API do v1.1.

### Uzasadnienie
Wybrano opcję B, ponieważ Fito Gen Essentials jest rozwijany poza repozytorium web platformy i wymaga stabilnych kontraktów integracyjnych.

### Konsekwencje
- Dokumentacja kontraktów API staje się wymaganym krokiem przed implementacją brakujących capability.
- Existing Update API i News Feed API mogą wymagać ujednolicenia pól.
- Testy kontraktowe i smoke testy Core v1 stają się warunkiem akceptacji fazy.

### Ryzyka
- Zbyt długi etap dokumentacyjny może opóźnić implementację.
- Zbyt wczesne zamrożenie payloadów może utrudnić korekty wynikające z realnej integracji.
- Niejasność `currentVersion` vs `appVersion` może utrudnić utrzymanie API.

### Dalsze działania
- Przygotować szczegółową dokumentację kontraktów Core v1.
- Zaprojektować Dictionary Package API.
- Po akceptacji kontraktów przejść do implementacji brakujących endpointów i testów.

### Powiązane sekcje
- 10, 12, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27

### Zastępuje / Zastąpiony przez
- Brak.

## 39. ADR-010: Public Site Visual Launch Candidate przed publikacją programu Fito Gen
Status: Accepted; częściowo zastąpiony przez DEC-024 w zakresie sposobu prezentacji Fito Gen
Data: 2026-05-15

### Kontekst
Po zielonym checkpointcie MVP i po rozpoczęciu planowania Universal Desktop Support API v1 pojawiła się potrzeba jak najszybszego uruchomienia profesjonalnej publicznej strony eGen Labs. Fito Gen Essentials pozostaje produktem rozwijanym poza tym repozytorium i nie jest jeszcze gotowy do publikacji jako finalny program do pobrania.

### Decyzja
Projekt przyjmuje Public Site Visual Launch Candidate jako bieżący priorytet operacyjny. Publiczna strona eGen Labs ma zostać wizualnie dopracowana i uruchomiona jako wiarygodna wizytówka marki, bez eksponowania finalnego linku do programu Fito Gen Essentials. Link do Fito Gen i sam program zostaną dodane w kolejnym kroku po ukończeniu desktopowego MVP.

### Rozważane opcje
- Opcja A: kontynuować najpierw prace nad Universal Desktop Support API v1 i odłożyć visual pass.
- Opcja B: wykonać visual launch pass teraz, bez publikowania niedokończonego programu.
- Opcja C: opublikować stronę od razu z linkiem do nieukończonego programu.

### Uzasadnienie
Wybrano opcję B, ponieważ umożliwia szybki start wizerunkowy, budowanie zaufania i zbieranie kontaktów bez ryzyka obiecywania pobrania produktu, który nie jest jeszcze gotowy. Decyzja nie usuwa Universal Desktop Support API v1 z planu, tylko przesuwa bieżący operacyjny priorytet na publiczną prezentację marki.

### Konsekwencje
- Główne CTA public site prowadzą do kontaktu i newslettera.
- Download flow pozostaje technicznie dostępny, ale nie jest eksponowany w głównej nawigacji.
- Historycznie strona produktu Fito Gen komunikowała status produktu w przygotowaniu; od DEC-024 prezentuje kompletny moduł produktowy bez eksponowania finalnego linku pobrania.
- Visual pass nie dodaje nowych funkcji domenowych i nie zmienia granic danych desktopu.
- Sekcja Elektronika / Krótkofalarstwo wymaga osobnej decyzji, aby nie rozmyć publicznego startu eGen Labs.

### Ryzyka
- Zbyt wczesne dodanie wielu kierunków produktowych może osłabić jasność komunikacji.
- Publiczna strona może wymagać kolejnego dopracowania po dodaniu finalnego programu i materiałów użytkownika.
- Jeżeli visual pass zacznie obejmować nowe funkcje, może opóźnić launch.

### Dalsze działania
- Uruchomić lokalnie stronę i wykonać QA wizualno-treściowe.
- Dopisać brakujące treści blog/FAQ w języku polskim.
- Wdrożyć publiczną stronę jako wizytówkę eGen Labs.
- Po ukończeniu Fito Gen Essentials dodać finalny link, program i materiały użytkownika.

### Powiązane sekcje
- 4, 5, 6, 7, 9, 10, 12, 24, 25, 26, 27

### Zastępuje / Zastąpiony przez
- DEC-024 zastępuje część dotyczącą komunikowania Fito Gen jako produktu w przygotowaniu.
- Pozostaje obowiązująca decyzja o nieeksponowaniu finalnego linku pobrania do czasu zatwierdzenia buildu desktopowego.

## 40. ADR-011: Odrębne środowiska staging i produkcyjne na VPS
Status: Accepted
Data: 2026-06-19

### Kontekst
Web MVP wymaga kontrolowanego przejścia przez staging, restore drill i produkcję. Projekt jest utrzymywany solo, ma niewielką początkową skalę i nie uzasadnia Kubernetes, zarządzanej orkiestracji ani rezerwowania zasobów dla innych projektów. Współdzielenie jednego hosta przez staging i produkcję zwiększałoby blast radius, ryzyko błędu restore oraz konkurencję o zasoby.

### Decyzja
- Staging działa na osobnym OVHcloud VPS-1: 4 vCore, 8 GB RAM, 75 GB storage, Ubuntu Server 24.04 LTS.
- Produkcja działa na drugim, odrębnym OVHcloud VPS-1 o tej samej konfiguracji.
- Oba hosty są przeznaczone wyłącznie dla `egenlabs.eu`.
- Produkcyjny VPS jest kupowany dopiero po formalnym zaakceptowaniu stagingu i decyzji GO.
- Oba środowiska korzystają z tego samego utrzymywalnego wzorca Docker Compose, ale mają odrębne bazy, sieci, storage i sekrety.
- PostgreSQL nie publikuje portu do Internetu. Publicznie dostępny jest wyłącznie reverse proxy.
- Cloudflare obsługuje DNS/proxy/TLS, a Turnstile używa osobnych kluczy stagingowych i produkcyjnych.
- Backup aplikacyjny jest szyfrowany i kopiowany do prywatnego Cloudflare R2. Automatyczna kopia VPS pozostaje wyłącznie dodatkową warstwą ochronną.
- Skalowanie VPS następuje po pomiarach, bez zakupu zapasu dla hipotetycznych przyszłych projektów.

### Rozważane opcje
- Dwa odrębne VPS dla stagingu i produkcji.
- Jeden większy VPS z dwoma projektami Docker Compose.
- Platforma zarządzana lub Kubernetes.

### Uzasadnienie
Wybrana opcja zapewnia pełniejszą separację środowisk, bezpieczniejszy restore drill i mniejszy blast radius, a przy sizingu ograniczonym do jednego projektu utrzymuje niski koszt. Identyczne konfiguracje serwerów upraszczają promocję commita ze stagingu na produkcję. Zakup produkcji dopiero po staging GO zapobiega ponoszeniu kosztu przed osiągnięciem gotowości release.

### Konsekwencje
- Pozytywne: separacja hostów, baz i sekretów; bezpieczniejsze testy; prostszy rollback; brak kosztu niewykorzystanego zapasu.
- Pozytywne: możliwość niezależnego zatrzymania, przebudowy i odtworzenia stagingu.
- Negatywne: dwa systemy operacyjne, firewalle i zestawy aktualizacji do utrzymania.
- Negatywne: każdy VPS pozostaje pojedynczym punktem awarii dla swojego środowiska.

### Ryzyka
- Niewystarczający sizing po wzroście ruchu lub storage.
- Błąd konfiguracji powodujący różnicę między stagingiem i produkcją.
- Brak komercyjnego SLA dla bezpłatnych usług Cloudflare.
- Błędna retencja lub przekroczenie limitu R2.

### Dalsze działania
- Kupić wyłącznie stagingowy OVHcloud VPS-1.
- Wykonać read-only inspection i hardening Ubuntu Server 24.04 LTS.
- Przygotować kontrolowany stack Docker Compose, reverse proxy, trwały storage i prywatną sieć PostgreSQL.
- Usunąć STG-GAP-001 przez implementację Turnstile z serwerową walidacją Siteverify.
- Przeprowadzić pełną checklistę stagingową i restore drill.
- Kupić produkcyjny VPS dopiero po jawnej decyzji staging GO.

### Powiązane sekcje
- 16. Przegląd architektury
- 21. Bezpieczeństwo i kontrola dostępu
- 22. Założenia infrastrukturalne i wdrożeniowe
- 23. Aspekty operacyjne
- 24. Fazy dostarczenia
- 26. Kryteria akceptacyjne
- 27. Ryzyka

### Zastępuje / Zastąpiony przez
- Brak

