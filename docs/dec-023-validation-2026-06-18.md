# Walidacja DEC-023

Data: 2026-06-18

## Wyniki w środowisku pakietowania

- `npm ci --ignore-scripts`: PASS,
- ESLint: PASS,
- składnia `scripts/smoke-mvp.mjs`: PASS,
- kontrola starych sformułowań i sekcji: PASS,
- kontrola nagłówków zakończonych kropką: PASS,
- kontrola nieplanowanego `GEN-FED 80-10 M µQRP` w kodzie publicznym: PASS.

## Ograniczenie środowiska

`prisma generate` nie zakończyło się z powodu braku dostępu DNS do `binaries.prisma.sh`. Pełny `typecheck` bez wygenerowanego Prisma Client zgłasza błędy wtórne w istniejących modułach zależnych od Prisma. Nie wykryto odrębnych błędów ESLint w nowych komponentach DEC-023.

## Walidacja wymagana lokalnie

```bash
npm ci
npm run prisma:generate
npm run typecheck
npm run lint
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
