# Public Site Visual Launch Plan

## Cel

Celem bieżącego kroku jest jak najszybsze przygotowanie profesjonalnej, publicznej strony eGen Labs zgodnej z kierunkiem marki eGen, bez przedwczesnego publikowania linku do Fito Gen Essentials ani samego programu.

## Zakres visual launch pass

- odświeżenie warstwy wizualnej public site,
- polska komunikacja publiczna,
- profesjonalny hero i spójna nawigacja,
- jasne pozycjonowanie eGen Labs jako platformy produktowej i product lab ekosystemu eGen,
- komunikacja Fito Gen Essentials jako produktu w przygotowaniu,
- pozostawienie download flow jako technicznego elementu MVP, bez eksponowania go w głównej nawigacji,
- poprawa wyglądu formularzy kontaktu, newslettera i zapytań firmowych,
- poprawa wyglądu bloga, FAQ i materiału PDF,
- brak zmian w panelu administracyjnym i brak zmian w logice domenowej.

## Granice odpowiedzialności

Ten krok nie dodaje nowych funkcji domenowych. Zmienia sposób prezentacji publicznej części strony, aby umożliwić szybszy start wizerunkowy.

Poza zakresem tego kroku pozostają:

- finalny link do pobrania Fito Gen Essentials,
- publikacja programu desktopowego,
- pełny product launch flow,
- rozbudowany visual identity system,
- osobna sekcja Elektronika / Krótkofalarstwo,
- implementacja nowych endpointów Universal Desktop Support API v1.

## Zmiany wdrożone w repo

- Dodano globalny system CSS w `src/app/globals.css`.
- Dodano wspólne komponenty public site w `src/components/public-site.tsx`.
- Zaktualizowano `src/app/layout.tsx` o globalne style i polskie metadane.
- Przebudowano publiczną stronę główną `src/app/page.tsx`.
- Przebudowano stronę produktu `src/app/products/[slug]/page.tsx`.
- Przebudowano publiczne strony: blog, FAQ, kontakt, newsletter, enterprise, PDF one-pager, download register i download access.
- Uporządkowano polskie treści bootstrapowe w `scripts/bootstrap-content.mjs`.
- Zaktualizowano opis PDF one-pagera w `scripts/bootstrap-pdf-one-pager.mjs`.

## Kolejność dalszych prac

1. Uruchomić `npm ci` w lokalnym środowisku.
2. Uruchomić `npm run typecheck`.
3. Uruchomić `npm run lint`.
4. Uruchomić aplikację lokalnie i sprawdzić publiczne trasy.
5. Uzupełnić treści startowe blog/FAQ w panelu administracyjnym lub bootstrapie.
6. Wykonać krótki content QA: język polski, CTA, brak obietnicy pobrania programu.
7. Wdrożyć stronę jako publiczną wizytówkę.
8. Po ukończeniu desktopowego Fito Gen dodać finalny product launch flow i link pobrania.

## Kryteria akceptacji

- Strona główna wygląda profesjonalnie i spójnie z kierunkiem eGen Labs jako platformy produktowej, a nie software studio.
- Publiczna komunikacja jest po polsku.
- Główne CTA prowadzą do kontaktu i newslettera, nie do niedokończonego programu.
- Fito Gen Essentials jest pokazany jako produkt w przygotowaniu.
- Download flow pozostaje technicznie dostępny, ale nie jest promowany w głównej nawigacji.
- Publiczne strony formularzy są czytelne i spójne wizualnie.
- Nie dodano cloud sync ani backendu danych operacyjnych desktopu.


## Brand correction pass

Po dodatkowym QA treści przyjęto korektę pozycjonowania marki:

- eGen Labs nie jest komunikowane jako software studio ani software house,
- główny przekaz to platforma produktowa i product lab ekosystemu eGen,
- strona ma pokazywać produkty własne, praktyczną dokumentację, wiedzę branżową i wsparcie aplikacji eGen,
- kontakt pozostaje kanałem rozmowy o produktach, dokumentacji i współpracy, a nie klasyczną ofertą usług programistycznych,
- sekcja Elektronika / Krótkofalarstwo pozostaje przyszłym kierunkiem treściowym wymagającym osobnej decyzji.
