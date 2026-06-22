# DEC-027 — topologia staging i production

Data: 2026-06-19  
Status: Accepted

## Zaakceptowana decyzja

- Staging i produkcja `egenlabs.eu` działają na dwóch odrębnych VPS w OVHcloud.
- Każde środowisko korzysta z planu VPS-1: 4 vCore, 8 GB RAM i 75 GB storage.
- System operacyjny: Ubuntu Server 24.04 LTS.
- Model uruchomieniowy: Docker Compose z reverse proxy, aplikacją Next.js i PostgreSQL w prywatnej sieci.
- Serwery są przeznaczone wyłącznie dla projektu `egenlabs.eu`; nie rezerwuje się zasobów dla innych projektów.
- Obecnie kupowany jest wyłącznie stagingowy VPS. Produkcyjny VPS zostanie kupiony dopiero po formalnej decyzji staging GO.
- Cloudflare Free obsługuje DNS, proxy i TLS `Full (strict)`.
- Staging i produkcja używają odrębnych kluczy Turnstile.
- Zaszyfrowane backupy bazy i storage są kopiowane do prywatnego Cloudflare R2.

## Uzasadnienie

Dwa małe, odrębne VPS zapewniają lepszą separację i bezpieczniejszy restore drill niż jeden wspólny host. Sizing ograniczony do jednego projektu minimalizuje koszt, a zakup produkcji dopiero po staging GO zapobiega opłacaniu niewykorzystanej infrastruktury.

## Warunki wdrożenia

- PostgreSQL nie publikuje portu do Internetu.
- Storage jest montowany poza repozytorium.
- Sekrety stagingu i produkcji są całkowicie odrębne.
- Publicznie wystawiony jest wyłącznie reverse proxy.
- Backup aplikacyjny jest testowany przez restore drill; snapshot VPS nie zastępuje dumpu bazy i archiwum storage.
- STG-GAP-001 musi zostać usunięty przed formalną akceptacją stagingu.

## Powiązane dokumenty

- `docs/living-specification.md`
- `docs/staging-readiness-checklist.md`
- `docs/mvp-closure-plan-2026-06-18.md`
- `docs/mvp-release-checkpoint.md`
