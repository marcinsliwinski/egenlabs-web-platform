# Walidacja katalogu GEN-FED / CMC-GEN 261

Data: 2026-06-17

## Zakres

- 23 unikalne SKU.
- 8 Kitów GEN-FED 40-10.
- 7 Kitów GEN-FED 80-10.
- 4 samodzielne Un-Uny.
- 4 samodzielne choke’i CMC-GEN.
- Brak nieplanowanego SKU `GF8010-M-UQRP-K261`.
- Dwa publiczne dokumenty PDF v20.

## Wyniki wykonane w środowisku pakietowania

- ESLint całego repo: PASS.
- Izolowany TypeScript check modułu katalogu, nowych tras i komponentów: PASS.
- Walidacja unikalności SKU i slugów: PASS.
- Walidacja liczebności grup: PASS.
- Walidacja obecności i rozmiaru obu PDF-ów: PASS.
- `node --check scripts/smoke-mvp.mjs`: PASS.
- `pdfinfo`: oba PDF-y są poprawnie rozpoznawane jako 4-stronicowe A4, PDF 1.7.

## Ograniczenie środowiska

Pełny `npm run typecheck` wymaga wygenerowanego Prisma Client. W środowisku pakietowania `npx prisma generate` nie mógł pobrać silnika z `binaries.prisma.sh` z powodu braku dostępu sieciowego. Wynik pełnego typechecku należy potwierdzić lokalnie po:

```bash
npm ci
npm run prisma:generate
npm run typecheck
npm run lint
```

Przy działającej aplikacji i bazie należy następnie wykonać:

```bash
npm run smoke:health
npm run smoke:mvp
npm run checkpoint:mvp
```
