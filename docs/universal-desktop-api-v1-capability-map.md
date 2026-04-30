# Universal Desktop Support API v1 – Capability Map

## Cel
Ten dokument definiuje wspólny zakres Universal Desktop Support API v1 dla aplikacji desktopowych publikowanych przez eGen Labs.
Pierwszym klientem tej warstwy jest Fito Gen Essentials, ale capability map ma pozostać uniwersalna dla kolejnych aplikacji.

## Zasady ogólne
- API jest wersjonowane od `/api/v1`.
- Aplikacje desktopowe pozostają offline-first.
- Platforma webowa publikuje kontrakty, manifesty i paczki wspierające.
- Platforma nie przejmuje operacyjnych danych domenowych aplikacji desktopowych.
- Nazwy endpointów, pól i payloadów pozostają po angielsku.

## Parametry wspólne kontraktów
- `product`
- `edition`
- `channel`
- `platform`
- `appVersion`
- `locale`

## Capability groups

### Core v1
1. **Update API**
   - manifest aktualizacji aplikacji
   - zgodność produktu / edycji / kanału / platformy / wersji
   - informacje o buildzie, release notes, checksum

2. **News Feed API**
   - news feed dla klienta desktopowego
   - filtrowanie po produkcie, edycji, kanale, wersji i kategorii
   - prosty payload JSON do wyświetlenia w aplikacji

3. **Dictionary Package API**
   - manifest wersji paczek referencyjnych / słownikowych
   - wersjonowane paczki zgodne z lokalnym importem aplikacji desktopowej
   - checksumy i metadane integralności

### Extended v1
4. **Feedback API**
   - zgłoszenia ulepszeń i zapotrzebowania na oprogramowanie
   - tekstowy intake bez ciężkich uploadów w pierwszym kroku

5. **Telemetry API**
   - intake zdarzeń diagnostycznych
   - dane wspierające utrzymanie, nie blokujące pracy aplikacji

## Priorytet dla Fito Gen Essentials
1. Update API
2. News Feed API
3. Dictionary Package API
4. Feedback API
5. Telemetry API

## Minimalne reguły kontraktowe
- Read-only API nie może ujawniać prywatnych ścieżek storage.
- Intake endpoints muszą być walidowane i objęte podstawowym rate limitingiem.
- Dictionary packages muszą mieć wersję, format, checksum i datę publikacji.
- Brak internetu nie może blokować podstawowej pracy aplikacji desktopowej.

## Poza zakresem v1
- cloud sync danych operacyjnych aplikacji desktopowych,
- centralny CRUD danych domenowych aplikacji,
- rozbudowany telemetry dashboard,
- binarne uploady załączników do feedbacku,
- pełny backend operacyjny dla klientów desktopowych.
