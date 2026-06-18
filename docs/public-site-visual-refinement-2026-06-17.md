# Public Site Visual Refinement — 2026-06-17

## Cel

Dopracowanie publicznej strony eGen Labs bez rozszerzania funkcji MVP. Pass koncentruje się na profesjonalnym odbiorze marki, czytelności katalogu produktów oraz spójności na desktopie i urządzeniach mobilnych.

## Zakres wykonany

- usunięto z publicznej strony język wewnętrzny, m.in. „public launch candidate”, „następny krok” i „strona jako wizytówka marki”,
- przebudowano hero strony głównej na przekaz produktowy skierowany do klienta,
- wyeksponowano trzy linie: Fito Gen, GEN-FED i CMC-GEN,
- uproszczono główną nawigację,
- przebudowano stopkę i dodano dyskretny link do `/legal`,
- dodano stronę `/legal` bez powielania prywatnych danych producenta,
- poprawiono hierarchię typografii, odstępy, cienie, obramowania i stany hover/focus,
- zwiększono kontrast tekstu na zielonych polach,
- poprawiono wygląd kart produktów oraz CTA,
- dodano informację o przewijaniu tabel na urządzeniach mobilnych,
- dodano obsługę `prefers-reduced-motion`,
- pozostawiono dane identyfikacyjne w zatwierdzonych dokumentach PDF v20 zgodnie z decyzją właściciela projektu.

## Granice

- nie dodano sklepu, koszyka, płatności ani systemu zamówień,
- nie zmieniono katalogu 23 SKU,
- nie zmieniono modeli Prisma ani API,
- nie zmieniono dwóch publicznych dokumentów PDF v20,
- nie dodano finalnego pobrania Fito Gen Essentials.

## Kryteria kontroli

- `npm run typecheck`,
- `npm run lint`,
- `npm run smoke:health`,
- `npm run smoke:mvp`,
- `npm run checkpoint:mvp`,
- ręczny przegląd strony głównej, katalogu, stron serii, kart produktów, dokumentów, formularzy i `/legal` na desktopie oraz telefonie.
