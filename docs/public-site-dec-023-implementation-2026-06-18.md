# DEC-023 — implementacja finalnego public content i mobile UX pass

Data: 2026-06-18

## Zakres wykonany

- mobilna nawigacja z przyciskiem Menu i pełną listą pozycji,
- widoczna nazwa „Rozwiązania” zamiast „Produkty”, bez zmiany adresu `/products`,
- podpis marki „Rozwiązania inżynieryjne do praktycznych zastosowań”,
- ograniczona skala typografii nagłówków,
- profesjonalizacja tekstów strony głównej, katalogu i dokumentacji,
- przebudowa strony kontaktowej w układzie 2/3 + 1/3,
- osadzony formularz newslettera na stronie głównej i stronie kontaktowej,
- poprawiony kontrast przycisków i treści na zielonych polach,
- usunięta publiczna sekcja „Identyfikacja egzemplarza”,
- dodany ogólny opis marketingowo-techniczny GEN-FED / CMC-GEN,
- katalog przygotowany do opcjonalnych zdjęć serii i modeli,
- dodany standard rozdzielczości i formatów zdjęć.

## Granice

- nie dodano panelu uploadu,
- nie zmieniono katalogu 23 SKU,
- nie zmieniono dokumentacji PDF v20,
- nie dodano sklepu, koszyka ani płatności,
- nie zmieniono API, Prisma ani modeli danych.

## Walidacja wymagana lokalnie

```bash
npm run prisma:generate
npm run typecheck
npm run lint
npm run smoke:health
npm run smoke:mvp
npm run checkpoint:mvp
```

Po testach wymagany jest ręczny przegląd menu mobilnego, formularzy, kontrastu, tabel oraz najważniejszych tras publicznych.
