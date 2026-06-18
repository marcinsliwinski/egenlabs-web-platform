# CI quality gate

## Workflow

`.github/workflows/quality.yml` runs for pushes and pull requests targeting `main`.

The job:

1. starts PostgreSQL 16,
2. installs dependencies with `npm ci`,
3. generates Prisma Client,
4. applies migrations,
5. bootstraps product, content, desktop-news and PDF test data,
6. runs TypeScript checks and ESLint,
7. creates a production build,
8. starts the application,
9. waits for the health endpoint,
10. runs health and MVP smoke tests.

## Security

- Workflow secrets are not stored in the repository.
- CI uses disposable test-only credentials.
- `SECURITY.md` describes private vulnerability reporting and repository hygiene.
- Production environment values remain outside Git and GitHub Actions workflow files.
