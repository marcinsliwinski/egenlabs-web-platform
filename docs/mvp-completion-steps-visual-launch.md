# Kroki do zakończenia MVP po wdrożeniu katalogu GEN-FED / CMC-GEN 261

## Status po bieżącym pakiecie

- Web MVP core: około 98–99%.
- Public site visual launch: około 94–96%.
- Katalog GEN-FED / CMC-GEN 261: około 90–95% implementacyjnie; wymaga lokalnego QA i publikacji.
- Dokumentacja publiczna v20: 100% dodana do projektu w zakresie dokumentów 01 i 02.
- Product Download Launch Fito Gen: około 65–70%; zależny od ukończenia programu desktopowego.
- Universal Desktop Support API v1 Core: około 45–50% implementacyjnie.

## 1. Lokalna walidacja techniczna

```bash
npm ci
npm run prisma:generate
npm run typecheck
npm run lint
```

Prisma Client musi być wygenerowany przed pełnym `typecheck`. Następnie, przy działającej bazie i aplikacji:

```bash
npm run db:up
npx prisma migrate deploy
npm run dev
```

W drugim terminalu:

```bash
npm run smoke:health
npm run smoke:mvp
npm run checkpoint:mvp
```

## 2. QA katalogu krótkofalarskiego

Sprawdź ręcznie na desktopie i telefonie:

- `/products`
- `/products/gen-fed`
- `/products/gen-fed/40-10`
- `/products/gen-fed/80-10`
- `/products/gen-fed/un-un`
- `/products/cmc-gen`
- reprezentatywne karty µQRP, QRP, STD i HD,
- `/downloads/ham-radio`,
- oba pliki PDF v20.

Kontrole merytoryczne:

- dokładnie 23 produkty,
- 15 Kitów, 4 Un-Uny, 4 choke’i,
- brak `GEN-FED 80-10 M µQRP`,
- wyłącznie warianty S/M,
- każdy Kit zawiera Un-Un, promiennik, przeciwwagę, choke i elementy montażowe,
- parametry mocy zgadzają się z kartą techniczną v20,
- CTA prowadzi do kontaktu, a nie do nieistniejącego sklepu.

## 3. QA dokumentów i zgodności treści

- opublikowane są tylko instrukcja obsługi i instalacji oraz karta techniczna v20,
- Oświadczenie producenta i dokumenty wewnętrzne nie znajdują się w `public/`,
- pusta strona identyfikacyjna instrukcji pozostaje jako miejsce na wklejkę SN,
- linki PDF działają i nie są chronione rejestracją,
- strona produktu pokazuje producenta, SKU, podstawowe parametry i ostrzeżenia.

## 4. Finalny visual/content pass

Przed publikacją dopracuj:

- zdjęcia lub ilustracje produktów,
- hierarchię strony głównej między Fito Gen a pionem krótkofalarskim,
- krótsze opisy marketingowe bez zmiany parametrów technicznych,
- mobile spacing tabel porównawczych,
- favicon, Open Graph i finalne metadane SEO,
- dane kontaktowe i polityki publiczne.

## 5. Commit katalogu

Po zielonych testach:

```bash
git status --short
git add src scripts docs public
git commit -m "Publish GEN-FED and CMC-GEN 261 catalog"
```

Nie commituj:

- ZIP-ów źródłowych,
- dokumentów wewnętrznych,
- plików DOCX,
- ewidencji SN,
- `.env`, sekretów, backupów, dumpów i logów,
- `node_modules`, `.next` ani `tsconfig.tsbuildinfo`.

## 6. Staging i produkcja

1. Wdrożenie na staging.
2. Smoke test z `BASE_URL` stagingu.
3. Ręczny QA katalogu i PDF-ów.
4. Wdrożenie produkcyjne.
5. Weryfikacja domeny, cache i formularzy kontaktowych.
6. Rejestracja checkpointu release w dokumentacji projektu.

## 7. Kolejny krok po public launch

Po uruchomieniu strony:

1. Dodać finalne zdjęcia produktowe i ewentualne ceny/tryb dostępności po osobnej decyzji.
2. Po ukończeniu Fito Gen uruchomić Product Download Launch programu.
3. Wrócić do Contract Design Freeze Universal Desktop Support API v1 Core.
4. Zaprojektować i wdrożyć Dictionary Package API oraz testy kontraktowe.


## Visual refinement pass — 2026-06-17

Wykonano klientocentryczną korektę public site:
- usunięto wewnętrzny język projektowy z treści publicznych,
- przebudowano stronę główną i indeks produktów,
- poprawiono kontrast, hierarchię, responsywność tabel i kart,
- dodano dyskretną stronę `/legal`,
- zachowano katalog 23 SKU i dwa publiczne PDF-y v20 bez zmian funkcjonalnych.

Po wdrożeniu należy zebrać pozostałe uwagi wizualne właściciela projektu w jednej liście, sklasyfikować je jako P0/P1/P2 i wykonać ostatni correction pass przed stagingiem.
