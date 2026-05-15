# Kroki do zakończenia MVP po visual launch pass

## Status po bieżącym pakiecie

Publiczna warstwa wizualna została przygotowana pod szybki start strony eGen Labs bez publikowania finalnego linku do Fito Gen Essentials.

Szacunkowy stan:

- Web MVP: 98–99% względem visual launch candidate.
- Public site visual launch: 85–90%.
- Product Download Launch z finalnym Fito Gen: 65–70%, zależny od ukończenia programu desktopowego.
- Universal Desktop Support API v1 Core: 45–50% implementacyjnie, 60–65% decyzyjnie.

## Najbliższa kolejność prac

### 1. Lokalna walidacja techniczna

Uruchom:

```bash
npm ci
npm run typecheck
npm run lint
```

Jeżeli baza i środowisko są gotowe:

```bash
npm run smoke:health
npm run smoke:mvp
npm run checkpoint:mvp
```

### 2. QA public site

Sprawdź ręcznie:

- `/`
- `/contact`
- `/newsletter`
- `/enterprise`
- `/faq`
- `/blog`
- `/products/fito-gen`
- `/one-pager/fito-gen-one-pager`, jeśli PDF jest skonfigurowany

Kryteria QA:

- wszystkie publiczne komunikaty są po polsku,
- strona wygląda profesjonalnie na desktopie i mobile,
- główne CTA prowadzą do Fito Gen, kontaktu i newslettera, bez linku do pobrania programu,
- strona nie obiecuje pobrania niedokończonego programu,
- download flow nie jest eksponowany w głównej nawigacji.

### 3. Treści startowe

Uzupełnij albo zatwierdź:

- minimum 3 wpisy blogowe,
- FAQ startowe,
- teksty na stronie głównej,
- opis Fito Gen jako produktu w przygotowaniu,
- podstawowy PDF informacyjny, jeżeli ma być publiczny.

### 4. Deploy public visual launch

Po pozytywnej walidacji:

- wdrożenie staging,
- szybki smoke test staging,
- wdrożenie produkcyjne,
- sprawdzenie domeny `egenlabs.eu`,
- sprawdzenie formularzy kontaktu i newslettera.

### 5. Kolejny krok po ukończeniu Fito Gen Essentials

Dodać:

- finalny link do Fito Gen,
- finalny program do pobrania,
- pełny product download launch flow,
- instrukcje użytkowania,
- materiały onboardingowe,
- ewentualnie deklaracje i dokumenty techniczne, jeżeli dotyczą publikowanego produktu.

### 6. Powrót do Universal Desktop Support API v1 Core

Po visual launch albo równolegle w osobnym kroku:

- zamrozić kontrakty Update API,
- zamrozić kontrakty News Feed API,
- zaprojektować Dictionary Package API,
- dodać testy kontraktowe,
- przygotować pakiet integracyjny dla Fito Gen Essentials.

## Sekcja Elektronika / Krótkofalarstwo

Pomysł sekcji Elektronika / Krótkofalarstwo został oznaczony jako pytanie otwarte w `docs/living-specification.md`.

Rekomendacja: nie wdrażać tej sekcji w tym visual launch pass. Najpierw należy osobno zdecydować, czy ma to być:

- osobna kategoria treści eGen Labs,
- osobny produkt / linia produktów,
- subbrand,
- czy osobny projekt poza eGen Labs Web Platform MVP.

Powód: zbyt szybkie dodanie drugiego kierunku produktowego może rozmyć komunikację startową strony.


## Korekta pozycjonowania przed commitem

Przed commitem release candidate należy sprawdzić, że public site nie komunikuje eGen Labs jako software studio. Docelowe pozycjonowanie:

- eGen Labs jako platforma produktowa / product lab ekosystemu eGen,
- Fito Gen jako pierwszy produkt,
- Universal Desktop Support API jako zaplecze techniczne produktów desktopowych,
- Knowledge & Technical Products jako przyszły obszar treści i dokumentacji technicznej,
- brak głównej narracji usług programistycznych.
