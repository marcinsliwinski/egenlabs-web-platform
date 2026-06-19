# Raport zamknięcia kontroli bezpieczeństwa Web MVP

Data: 2026-06-19  
Zakres: repozytorium `egenlabs-web-platform`, historia Git, zależności npm, quality gate oraz lokalne ścieżki storage.

## Wynik końcowy

Kontrola bezpieczeństwa dla baseline Web MVP została zakończona wynikiem pozytywnym z jednym zaakceptowanym ryzykiem zależności pośredniej.

| Kontrola | Wynik |
|---|---|
| Gitleaks — pełna historia Git | PASS |
| Przeskanowane commity | 31 |
| Wykryte sekrety | 0 |
| Podatności critical | 0 |
| Podatności high | 0 |
| Podatności moderate | 2 — PostCSS dostarczany przez Next.js |
| TypeScript | PASS |
| ESLint | PASS |
| Build / GitHub Actions | PASS |
| Health i MVP smoke tests | PASS |
| Kontrola ścieżek storage | PASS po DEC-026 |

## Skan historii Git

Skan wykonano oficjalnym obrazem Gitleaks:

```bash
docker run --rm \
  -v "$PWD:/repo" \
  ghcr.io/gitleaks/gitleaks:latest \
  git \
  --redact \
  --report-format json \
  --report-path /repo/gitleaks-report.json \
  --log-opts="--all" \
  /repo
```

Wynik:

```text
31 commits scanned
no leaks found
```

Raport roboczy został usunięty po kontroli i nie jest przechowywany w repozytorium.

## Aktualizacja zależności

Next.js i powiązana konfiguracja ESLint zostały zaktualizowane do wersji `16.2.9`. Po bezpiecznym `npm audit fix` usunięto podatności poziomu high i wcześniejsze podatności zależności pośrednich.

Nie zastosowano:

```bash
npm audit fix --force
```

Automatyczna operacja wymuszała niezgodną, breaking zmianę wersji Next.js i nie spełniała kryteriów kontrolowanej aktualizacji.

## RISK-SEC-001 — PostCSS transitive dependency

### Stan

`npm audit` raportuje dwa wpisy moderate dla PostCSS starszego niż `8.5.10`, dostarczanego jako zależność pośrednia Next.js.

### Ocena ekspozycji

Aktualny Web MVP:

- nie przyjmuje CSS od użytkowników,
- nie udostępnia edytora stylów,
- nie serializuje niezaufanego CSS do znaczników `<style>`,
- wykorzystuje style kontrolowane przez repozytorium.

Praktyczne ryzyko wykorzystania w aktualnym zakresie jest niskie.

### Decyzja

Ryzyko zaakceptowano tymczasowo. Należy monitorować stabilne wydania Next.js i ponowić `npm audit` przy kolejnej kontrolowanej aktualizacji. Nie należy stosować wymuszonych downgrade’ów ani niezweryfikowanych overrides zależności.

### Kryterium ponownego otwarcia

Ryzyko należy ponownie ocenić, gdy:

- stabilny Next.js zacznie dostarczać poprawioną wersję PostCSS,
- platforma zacznie przyjmować lub generować CSS pochodzący od użytkowników,
- zmieni się klasyfikacja lub zakres podatności.

## Utwardzenie ścieżek storage — DEC-026

Dostęp do lokalnych buildów i dokumentów został ograniczony do relatywnych ścieżek wewnątrz:

```text
storage/builds/...
storage/media/...
```

Odrzucane są:

- ścieżki absolutne,
- ścieżki Windows i POSIX wskazujące poza storage,
- traversal z użyciem `..`,
- katalog `storage/` bez nazwy pliku,
- ścieżki o podobnym prefiksie, np. `storage-other/`.

Przed odczytem istniejącego pliku wykonywana jest również kontrola ścieżki rzeczywistej, co ogranicza możliwość wyjścia poza storage przez dowiązanie symboliczne.

Kontrola regresji:

```bash
npm run smoke:storage-paths
```

## Wymagania operacyjne

Przed każdym release należy:

1. potwierdzić zielony GitHub Actions quality gate,
2. uruchomić `npm audit`,
3. przeskanować historię Gitleaks,
4. sprawdzić `git status --short` i `git diff --check`,
5. upewnić się, że raporty, backupy i eksporty nie są śledzone przez Git,
6. zweryfikować sekrety staging/prod poza repozytorium.

## Status

Kontrola bezpieczeństwa Web MVP: **CLOSED / ACCEPTED WITH DOCUMENTED UPSTREAM RISK**.
