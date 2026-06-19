# DEC-026 — Security closure and staging readiness baseline

Data: 2026-06-19  
Status: Accepted and implemented

## Cel

Zamknąć etap bezpieczeństwa Web MVP, zsynchronizować dokumentację ze stanem repozytorium oraz przygotować jednoznaczną bramkę wejścia na staging bez dodawania nowych funkcji produktowych.

## Zakres wykonany

- zapisano wynik pełnego skanu Gitleaks i audytu zależności,
- udokumentowano zaakceptowane ryzyko PostCSS,
- zsynchronizowano status Fito Gen z DEC-024,
- oznaczono częściowe zastąpienie ADR-010,
- zaktualizowano plan zamknięcia MVP i release checkpoint,
- dodano checklistę stagingową,
- przywrócono projektowy README zamiast instrukcji pojedynczego patcha,
- ograniczono lokalne ścieżki buildów i PDF do katalogu `storage/`,
- dodano kontrolę dowiązań symbolicznych przez weryfikację realpath,
- dodano automatyczny smoke test storage do lokalnego checkpointu i CI.

## Zakres bez zmian

- brak zmian modeli Prisma i migracji,
- brak zmian publicznych kontraktów API,
- brak nowych funkcji użytkowych,
- brak zmian katalogu 23 SKU,
- brak zmian dokumentów PDF v20,
- brak panelu uploadu i zewnętrznego storage.

## Decyzja dotycząca storage

Wartości `storagePath` muszą być ścieżkami relatywnymi zaczynającymi się od:

```text
storage/
```

Dozwolone przykłady:

```text
storage/builds/fito-gen/1.0.0/fito-gen.exe
storage/media/fito-gen-one-pager.pdf
```

Odrzucane są ścieżki absolutne, traversal, puste ścieżki i prefiksy podobne do `storage/`.

## Walidacja

W pakiecie wykonano:

- `node scripts/smoke-storage-paths.mjs` — PASS,
- kontrolę modułu TypeScript dla eksportów storage — PASS,
- kontrolę składni skryptów — PASS,
- kontrolę braku nieaktualnego statusu Fito Gen w aktywnych kryteriach — PASS,
- kontrolę wpisu DEC-026 i dokumentów staging/security — PASS.

Pełny quality gate należy wykonać po wgraniu pakietu do repozytorium i potwierdzić w GitHub Actions.
