# Project Development Plan – Post-MVP to Universal Desktop Support API v1

## Cel
Plan opisuje najlepszą kolejność dalszego rozwoju projektu po zielonym checkpointcie MVP.

## Zasady prowadzące
- nie rozszerzać MVP bez świadomej decyzji,
- najpierw doprecyzować kontrakty i granice odpowiedzialności,
- wdrażać tylko capability potrzebne do realnego wydania Fito Gen Essentials,
- zachować prostotę operacyjną i offline-first charakter klientów desktopowych.

## Etap 1 – Capability Map i dokumentacja bazowa
### Zakres
- doprecyzowanie Universal Desktop Support API v1,
- rozdzielenie `Core v1` i `Extended v1`,
- przygotowanie pełnej dokumentacji architektury i kontraktów.

### Deliverables
- capability map,
- documentation structure,
- architecture & responsibility document,
- API contracts draft.

## Etap 2 – Gap Analysis repo `egenlabs-web-platform`
### Zakres
- porównanie dokumentacji z istniejącym repo,
- identyfikacja brakujących endpointów i payloadów,
- identyfikacja niezgodności nazw i statusów.

### Deliverables
- gap analysis,
- lista zmian implementacyjnych,
- lista smoke / contract tests.

## Etap 3 – Wdrożenie brakujących capability dla Fito Gen Essentials
### Priorytet
1. Update API
2. News Feed API
3. Dictionary Package API
4. Feedback API
5. Telemetry API

### Deliverables
- brakujące kontrakty v1,
- manifesty i paczki referencyjne,
- smoke tests i testy kontraktowe,
- przykładowe payloady dla Fito Gen Essentials.

## Etap 4 – Integracyjny pakiet dla Fito Gen
### Zakres
- client integration guide,
- mapowanie ekranów Fito Gen do endpointów,
- polityka timeoutów i retry,
- cache i fallback offline,
- checklista integracyjna przed wydaniem Essentials.

### Deliverables
- integration guide,
- release checklist for Fito Gen,
- przykłady request/response.

## Etap 5 – Visual Alignment Pass dla public site
### Zakres
- dopracowanie warstwy publicznej MVP,
- hero i sekcje produktu Fito Gen,
- formularze publiczne,
- FAQ / blog / PDF one-pager,
- spójność z brandbookiem eGen przy zachowaniu polskiego języka i prostego, praktycznego stylu Fito Gen.

### Deliverables
- visual audit,
- plan zmian sekcja po sekcji,
- front-end implementation pass.

## Etap 6 – Release Preparation
### Zakres
- finalna checklista publikacyjna,
- domena, SMTP, Cloudflare, środowisko prod,
- smoke tests release candidate,
- release notes i pierwszy pilot z użytkownikami.

## Rekomendacja co do organizacji pracy
Najlepiej rozpocząć nowy czat dla workstreamu:
**Universal Desktop Support API v1 + Fito Gen integration**

Powód:
- obecny czat domknął MVP web platformy,
- nowy workstream ma osobny zakres architektoniczny i dokumentacyjny,
- łatwiej utrzymać porządek decyzji, zmian i artefaktów.

## Szacunkowy stan projektu
- Zielony checkpoint MVP web platformy: około 97–98% MVP
- Kolejny workstream: rozszerzenie platformowe v1 dla aplikacji desktopowych + polish public site + release prep
