# Ham Radio public privacy and visual correction

Data: 2026-06-17

## Zakres
- usunięcie publicznej sekcji `Identyfikacja i kontakt` z kart produktów,
- usunięcie prywatnych danych producenta z kodu źródłowego public site,
- pozostawienie danych identyfikacyjnych w zatwierdzonej karcie technicznej PDF v20,
- usunięcie końcowych kropek z nazw publicznych sekcji i nagłówków,
- zwiększenie kontrastu tekstu na zielonych kartach akcentowych.

## Bez zmian
- katalog 23 SKU,
- dokumenty PDF v20,
- pusta strona instrukcji przeznaczona na wklejkę SN,
- trasy, API, Prisma i baza danych.

## Walidacja po wdrożeniu
```bash
npm run typecheck
npm run lint
npm run smoke:health
npm run smoke:mvp
npm run checkpoint:mvp
```
