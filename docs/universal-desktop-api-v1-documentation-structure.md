# Universal Desktop Support API v1 – Documentation Structure

## Cel
Ten dokument opisuje docelową strukturę dokumentacji API tak, aby była uniwersalna dla Fito Gen Essentials i kolejnych aplikacji desktopowych publikowanych przez eGen Labs.

## Pakiet dokumentacyjny

### 1. Architecture & Responsibility
Zakres:
- rola `egenlabs.eu` jako platformy wsparcia aplikacji desktopowych,
- granice odpowiedzialności między web platformą a klientem desktopowym,
- offline-first assumptions,
- ownerstwo danych.

### 2. API Contracts v1
Zakres:
- endpointy,
- parametry,
- payloady,
- statusy odpowiedzi,
- błędy,
- przykłady request / response.

### 3. Dictionary Package Specification
Zakres:
- format paczek,
- nagłówki CSV lub struktura JSON,
- wersjonowanie,
- checksumy,
- zgodność z importerami lokalnymi,
- polityka publikacji nowych wersji.

### 4. Desktop Client Integration Guide
Zakres:
- timeouts,
- retries,
- cache,
- fallback offline,
- kiedy nie blokować UI,
- polityka błędów,
- mapowanie ekranów klienta do endpointów.

## Zasada językowa
- kontekst, decyzje i opisy: po polsku,
- endpoint names, fields, enums i payload examples: po angielsku.

## Zasada wersjonowania
Dokumentacja kontraktów ma być jednoznacznie powiązana z `v1` i przygotowana do rozszerzenia o `v1.1` bez zrywania zgodności aktualnych klientów.
