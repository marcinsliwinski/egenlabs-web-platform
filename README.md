# eGen Labs Web Platform

The official web platform for **eGen Labs** — a product platform for practical engineering solutions.

The repository contains the Web MVP for:

- the public eGen Labs website,
- the Fito Gen Essentials product module,
- the GEN-FED and CMC-GEN 261 amateur-radio catalog,
- public technical documentation,
- lead capture, consent, newsletter, contact, and download flows,
- the protected administration area,
- desktop support APIs for updates, news, telemetry, and feedback,
- operational backup, restore, audit, and release controls.

The single source of truth for project scope and accepted decisions is:

```text
docs/living-specification.md
```

## Product scope

### Fito Gen Essentials

Fito Gen Essentials is presented as a complete offline-first desktop product module for Polish plant nurseries. The final production binary and direct public download activation are handled as a separate product-release step.

### GEN-FED / CMC-GEN 261

The public catalog contains exactly 23 approved SKUs:

- 15 complete GEN-FED Kits,
- 4 standalone GEN-FED 1:49 Un-Uns,
- 4 standalone CMC-GEN 1:1 Chokes.

The catalog is informational. Storefront, cart, payments, and order processing are outside the Web MVP.

## Technology

- Node.js 24
- Next.js 16.2.9
- React 19
- TypeScript
- PostgreSQL 16
- Prisma 6
- Docker Compose
- GitHub Actions
- Brevo integration with a `LOG_ONLY` development fallback
- Cloudflare and Turnstile-ready configuration

## Local setup

```bash
cp .env.example .env
npm ci
npm run db:up
npm run prisma:generate
npx prisma migrate deploy
npm run catalog:bootstrap
npm run content:bootstrap
npm run desktop:bootstrap
npm run pdf:bootstrap
npm run dev
```

The application is available at:

```text
http://localhost:3000
```

Create the first local administrator with a non-production password:

```bash
npm run admin:create -- \
  --email=admin@example.com \
  --password=change-me-now \
  --role=ADMIN
```

## Quality gates

With the application and database running:

```bash
npm run typecheck
npm run lint
npm run smoke:storage-paths
npm run smoke:health
npm run smoke:mvp
npm run checkpoint:mvp
```

For a production build, PostgreSQL must be available because selected public pages read database content during prerendering:

```bash
npm run build
```

GitHub Actions runs the complete quality gate for pushes and pull requests targeting `main`.

## Storage rules

Runtime assets must use relative paths inside:

```text
storage/builds/...
storage/media/...
```

Absolute paths and paths escaping `storage/` are rejected. Private builds, runtime uploads, backups, database dumps, reports, and user exports must not be committed.

## Security

- Follow `SECURITY.md` for private vulnerability reporting.
- Never commit secrets, real `.env` files, private keys, production dumps, backups, or sensitive exports.
- Review `git status` and `git diff --check` before every commit.
- Use Gitleaks to scan the full repository history before releases.
- Do not use `npm audit fix --force` without a reviewed migration plan.

The accepted June 2026 security baseline is documented in:

```text
docs/security-review-2026-06-19.md
```

## Operations and release

Relevant documents:

- `docs/mvp-release-checkpoint.md`
- `docs/mvp-closure-plan-2026-06-18.md`
- `docs/staging-readiness-checklist.md`
- `docs/operations-backup-restore.md`
- `docs/product-image-guidelines.md`

## Repository policy

Code, technical identifiers, comments, and README content are maintained in English. Project governance and the living specification are maintained in Polish.
