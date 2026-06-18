# Standard zdjęć dla katalogu eGen Labs

## Cel

Katalog publiczny jest przygotowany do przypisywania zdjęć do każdej linii, serii i pojedynczego modelu. W MVP pliki są przechowywane statycznie w repozytorium, bez panelu uploadu i bez zewnętrznego systemu zarządzania mediami.

## Typy materiałów

| Zastosowanie | Zalecana rozdzielczość | Proporcje | Format | Maksymalny rozmiar |
|---|---:|---:|---|---:|
| Zdjęcie linii lub serii | 1920 × 1080 px | 16:9 | WebP | 1,5 MB |
| Główne zdjęcie modelu | 1600 × 1200 px | 4:3 | WebP | 1 MB |
| Zdjęcie dodatkowe | 1600 × 1200 px | 4:3 | WebP | 1 MB |
| Packshot z przezroczystością | 1600 × 1600 px | 1:1 | WebP lub PNG | 2 MB |
| Minimalny akceptowany plik | 1200 × 900 px | 4:3 | WebP lub JPEG | 1 MB |

## Wymagania jakościowe

- przestrzeń barw sRGB,
- brak znaków wodnych i osadzonych danych kontaktowych,
- produkt w całości w kadrze,
- neutralne, uporządkowane tło,
- brak sztucznego powiększania małych plików,
- poprawna ostrość i ekspozycja,
- spójny kierunek kadrowania w obrębie serii,
- opis `alt` wskazujący model oraz widoczny element.

## Struktura katalogów

```text
public/images/solutions/
├── gen-fed/
│   ├── 40-10/
│   │   ├── series-cover.webp
│   │   └── gf4010-s-qrp-k261/
│   │       ├── cover.webp
│   │       ├── detail-01.webp
│   │       └── detail-02.webp
│   ├── 80-10/
│   └── un-un/
├── cmc-gen/
└── fito-gen/
```

## Sposób przypisywania

- zdjęcia modeli są przypisywane przez opcjonalne pole `media` w statycznym katalogu TypeScript,
- zdjęcia linii i serii są przypisywane w `src/features/ham-radio/media-catalog.ts`,
- brak zdjęcia nie może powodować błędu ani pustego, uszkodzonego komponentu,
- zdjęcia są renderowane przez `next/image`,
- panel administracyjny do uploadu pozostaje poza MVP i może zostać rozważony w v1.1.

## Procedura przyjmowania pliku

Przed dodaniem zdjęcia należy ustalić jego rolę:

1. zdjęcie linii lub serii,
2. główne zdjęcie modelu,
3. zdjęcie dodatkowe,
4. packshot.

Następnie należy zweryfikować rozdzielczość, format, rozmiar, nazwę pliku, opis alternatywny i zgodność z rzeczywistym produktem.
