# eGen Labs Web Platform

Official web platform for **eGen Labs**.

This repository contains the MVP foundation for:
- the public website and product landing pages,
- lead capture and consent handling,
- transactional email and newsletter workflows,
- application download management,
- an admin panel and content management,
- desktop support APIs for updates, news feed, telemetry, and feedback,
- a scalable multi-product foundation for future eGen Labs software.

## Project context

- Parent brand: **eGen**
- Software/web subbrand: **eGen Labs**
- Current project: **eGen Labs Web Platform**
- First supported product: **Fito Gen**
- Initial edition: **Essentials**
- Initial market: **Poland / Polish language**
- MVP strategy: **multi-product foundation**, while launch conversion focuses on **Fito Gen Essentials**

## Core goals

The platform should:
- build trust in the eGen Labs brand,
- support the launch and distribution of Fito Gen Essentials,
- collect leads, consents, and market feedback,
- support product communication via email, blog, FAQ, PDF, and desktop news feed,
- expose backend capabilities for desktop updates and telemetry,
- stay simple enough for solo, low-cost delivery,
- remain ready for future products without rewriting the foundation.

## MVP scope

The first production version includes:
- public homepage for eGen Labs,
- product landing page for Fito Gen Essentials,
- mandatory email registration before download,
- optional marketing consent handled separately,
- welcome email and download email,
- configurable download link policies,
- newsletter signup without product download,
- FAQ,
- blog with at least 3 launch articles,
- PDF one-pager with configurable visibility,
- contact form,
- Enterprise interest form,
- admin panel with manual content management,
- build and release-channel management,
- update endpoint,
- news feed endpoint,
- telemetry intake endpoint,
- feature request and software demand request endpoints,
- audit logging, CSV exports, backup, restore, and basic observability.

## Proposed stack

### Runtime
- **Next.js** (full-stack)
- **TypeScript**
- **PostgreSQL**
- **Prisma**
- **Docker / Docker Compose**
- **Cloudflare**
- **Brevo**
- **VPS storage** for build assets and downloadable files

### Engineering toolchain
- **Git**
- **GitHub**

## Architecture direction

- **Modular monolith** for MVP
- **Single repository**
- **Single web application** containing:
  - public site,
  - admin panel,
  - API for desktop integrations
- Versioned REST API from **`/api/v1`**
- No synchronization of desktop operational data to the cloud in MVP

## Recommended repository structure

```text
.
├── .env.example
├── .gitignore
├── README.md
├── docs/
│   ├── living-specification.md
│   └── repository-bootstrap-plan.md
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── server/
│   ├── styles/
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── images/
│   ├── files/
│   └── icons/
├── storage/
│   ├── builds/
│   └── media/
├── scripts/
├── tests/
│   ├── integration/
│   └── unit/
├── docker/
└── .github/
    └── workflows/
```

## Suggested module boundaries

- `features/public-site` - public pages and product presentation
- `features/lead-capture` - registration, forms, consents
- `features/downloads` - build metadata, link policies, assets
- `features/content` - blog, FAQ, PDF, news feed content
- `features/desktop-api` - update, news, telemetry, feedback endpoints
- `features/admin` - admin panel, auth, roles, audits

## Security rules for this repository

Never commit:
- real `.env` files,
- API keys, tokens, passwords, or secrets,
- production database dumps,
- backups,
- private build assets,
- user exports,
- telemetry exports containing identifying data,
- logs containing personal or operationally sensitive data,
- ZIP archives of the whole project,
- generated files that may accidentally contain secrets or user data.

Always use:
- `.env.example` for variable templates,
- placeholders in docs,
- `.gitignore` to protect local and sensitive files,
- a manual review of `git status` before every commit,
- a manual review of tracked files before the first push.

Important:
- `/docs/living-specification.md` must never contain secrets, personal data, raw exports, private signed URLs, or access tokens.
- Build assets and user-related exports should stay **outside Git**.
- Treat GitHub as safe for code and sanitized documentation, not as storage for operational data.

## Admin auth shell

The repository now includes a minimal admin authentication shell for MVP:
- email + password sign-in for admin users,
- opaque server-side sessions stored in PostgreSQL,
- role model: `ADMIN` and `EDITOR`,
- route protection for `/admin`,
- temporary lockout after repeated failed sign-in attempts.

Routes currently included:
- `GET /admin/login` - admin sign-in page
- `POST /api/v1/auth/login` - creates an admin session
- `POST /api/v1/auth/logout` - revokes the current session
- `GET /admin` - protected admin dashboard placeholder
- `GET /admin/catalog` - protected catalog overview with build creation and activation flows
- `GET /admin/downloads` - protected download policy configuration page
- `GET /admin/leads` - protected leads and consent review page
- `GET /admin/emails` - protected transactional email and issuance log review page
- `GET /download/register` - public MVP download registration shell
- `GET /download/access` - public issued-link validation shell
- `GET /api/v1/downloads/deliver` - final download delivery shell endpoint
- `GET /admin/content` - protected manual FAQ and blog content management page
- `GET /admin/pdfs` - protected PDF one-pager management page
- `GET /one-pager/[slug]` - public or admin-only PDF one-pager detail page
- `GET /api/v1/pdf/download` - PDF one-pager delivery endpoint
- `GET /products/fito-gen` - public product landing foundation for Fito Gen Essentials
- `GET /faq` - public FAQ page
- `GET /blog` - public blog list page
- `GET /blog/[slug]` - public blog article detail page
- `GET /newsletter` - public newsletter-only signup page
- `GET /contact` - public contact form page
- `GET /enterprise` - public Enterprise / Pro interest page
- `GET /admin/forms` - protected newsletter, contact, and enterprise admin review page
- `GET /admin/desktop` - protected desktop news feed management page
- `GET /api/v1/desktop/update` - desktop update check endpoint
- `GET /api/v1/desktop/news` - desktop news feed endpoint
- `POST /api/v1/desktop/telemetry` - desktop telemetry intake endpoint
- `POST /api/v1/desktop/feature-requests` - desktop feature request intake endpoint
- `POST /api/v1/desktop/software-demand` - desktop software demand intake endpoint
- `GET /admin/desktop/intake` - protected telemetry and desktop feedback review page
- `GET /admin/operations` - protected audit log, CSV export, and recovery operations page
- `GET /api/v1/admin/exports/[dataset]` - protected CSV export endpoint for operational datasets

### Bootstrap the first admin user

1. Copy `.env.example` to `.env` and adjust the values for your local environment.
2. Start PostgreSQL and apply Prisma migrations.
3. Create the first admin account:

```bash
npm run admin:create -- --email=admin@example.com --password=change-me-now --role=ADMIN
```

This script upserts the admin record, so it can also be used to rotate the password during local setup.

## Product catalog foundation

The repository now also includes the first domain data foundation for:
- products,
- product editions,
- release channels,
- builds,
- build assets.

To bootstrap the accepted baseline catalog for local development, run:

```bash
npm run catalog:bootstrap
```

This upserts:
- product `Fito Gen`,
- edition `Essentials`,
- release channels `stable` and `beta`.

This does not upload any build files yet. Download policies can now be configured separately in the admin panel.

The protected catalog page now also supports:
- creating build metadata records,
- optionally attaching one build asset metadata record during creation,
- activating exactly one build per product / edition / release channel,
- read-only catalog access for the `EDITOR` role.

## Download policy foundation

The repository now also includes the first foundation for the accepted download policy baseline:
- `DownloadPolicy`,
- `DownloadLink`,
- `DownloadRequest`,
- server-side policy resolution against the current active build,
- protected admin page at `GET /admin/downloads`.

This step supports:
- configuring one download policy per product / edition / release channel,
- selecting the policy mode (`PUBLIC_DIRECT`, `ONE_TIME`, `TEMPORARY`, `PRIVATE_STATIC`),
- toggling whether an active build is required,
- toggling whether future public flow will require email registration,
- storing a temporary-link TTL value and internal notes.

This step does not yet include:
- public registration flow,
- email issuance,
- storage-backed file upload or signed link generation.

## Lead and consent foundation

The repository now also includes the first accepted lead-capture baseline for download registration:
- `Lead`,
- `ConsentDefinition`,
- `ConsentRecord`,
- a public registration shell at `GET /download/register`,
- admin review page at `GET /admin/leads`.

This step supports:
- recording a public download registration request tied to a selected product / edition / release channel,
- separating required operational registration from optional marketing consent,
- versioned consent definitions stored in the database,
- linking the resulting `DownloadRequest` to a `Lead`,
- reviewing recent lead and consent data in the admin panel.

This step does not yet include:
- newsletter automation,
- Brevo integration,
- external provider delivery.

## Transactional email and issuance shell

The repository now also includes the first accepted transactional-email, issuance, and delivery shell baseline:
- `EmailTemplate`,
- `EmailLog`,
- transactional email logging after successful download registration,
- issued `DownloadLink` creation aligned with the configured `DownloadPolicy`,
- protected admin review page at `GET /admin/emails`,
- public issued-link validation shell at `GET /download/access`.
- final download delivery shell endpoint at `GET /api/v1/downloads/deliver`.

This step supports:
- creating two transactional email logs per accepted registration (`DOWNLOAD_WELCOME` and `DOWNLOAD_LINK`),
- generating a shell download link using the configured policy mode,
- reusing static/public shell links where appropriate,
- validating issued links through a public shell page,
- delivering local build assets when available or a manifest attachment fallback when the file is not present yet,
- reviewing recent transactional email bodies and statuses in the admin panel.

This step does not yet include:
- external provider delivery through Brevo,
- marketing automation or newsletter campaigns,
- external storage-backed signed delivery.


## Public forms foundation

The repository now also includes the accepted public-form foundation for the remaining MVP communication entry points:
- newsletter-only signup without download,
- contact form,
- Enterprise / Pro interest form,
- protected admin review page at `GET /admin/forms`.

This step supports:
- storing newsletter signups as dedicated records linked to existing `Lead` entries,
- recording marketing consent history for newsletter-only, contact, and enterprise submissions,
- storing contact inquiries and enterprise-interest submissions in dedicated tables,
- reviewing the latest submissions in the admin panel.

This step intentionally avoids:
- marketing automation,
- CRM pipeline orchestration,
- advanced anti-spam or routing workflows.

## Backup and restore shell

The repository now also includes the accepted MVP shell for operational backup and restore:
- PostgreSQL backup via `pg_dump` inside the Docker Compose postgres service,
- storage backup for `storage/builds` and `storage/media`,
- manual restore commands for both database and storage,
- a documented runbook in `docs/operations-backup-restore.md`,
- admin visibility for recovery commands and export operations at `GET /admin/operations`.

Available commands:

```bash
npm run ops:backup:all
npm run ops:backup:db
npm run ops:backup:storage
npm run ops:restore:db -- --file=/path/to/postgres.sql
npm run ops:restore:storage -- --file=/path/to/storage.tar.gz
```

Backups are intentionally written **outside the Git repository** by default to:

```text
../egenlabs-web-platform-backups
```

This step intentionally avoids:
- automated backup scheduling,
- in-app restore execution,
- backup storage inside Git,
- advanced retention orchestration.

## Getting started

1. Clone the public repository:

```bash
git clone https://github.com/marcinsliwinski/egenlabs-web-platform.git
cd egenlabs-web-platform
```

2. Copy the local environment template:

```bash
cp .env.example .env
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Install dependencies:

```bash
npm ci
```

5. Generate Prisma Client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

6. Bootstrap the accepted local catalog baseline:

```bash
npm run catalog:bootstrap
```

7. Bootstrap starter content, desktop news, and the PDF one-pager sample:

```bash
npm run content:bootstrap
npm run desktop:bootstrap
npm run pdf:bootstrap
```

8. Create the first admin account:

```bash
npm run admin:create -- --email=admin@example.com --password=change-me-now --role=ADMIN
```

9. Start the application:

```bash
npm run dev
```

10. Optional: create a full local backup shell snapshot outside the repository:

```bash
npm run ops:backup:all
```

11. Open the main flows locally:
- `http://localhost:3000/`
- `http://localhost:3000/admin/login`
- `http://localhost:3000/download/register`
- `http://localhost:3000/newsletter`
- `http://localhost:3000/contact`
- `http://localhost:3000/enterprise`
- `http://localhost:3000/admin/emails`
- `http://localhost:3000/admin/forms`
- `http://localhost:3000/admin/pdfs`
- `http://localhost:3000/one-pager/fito-gen-one-pager`

### Optional: recovery runbook

See `docs/operations-backup-restore.md` for manual backup and restore procedures.

### Optional: enable Brevo transactional delivery

The default local mode remains `EMAIL_TRANSPORT_MODE=LOG_ONLY`, which records email logs without calling an external provider.
To test real transactional delivery, set:
- `EMAIL_TRANSPORT_MODE=BREVO`
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`

Then restart the dev server.

## Development rules

- Keep runtime architecture simple.
- Prefer explicit module boundaries over premature abstraction.
- Commit Prisma migrations to version control.
- Keep documentation aligned with `/docs/living-specification.md`.
- Do not expand MVP scope without a business reason.
- Treat security and observability as part of MVP, not post-launch extras.

## License

To be decided.

## Transactional delivery shell

The repository now also includes the accepted foundation for:
- transactional email transport abstraction,
- final download delivery shell via `GET /api/v1/downloads/deliver`,
- validation and use of issued links according to the configured `DownloadPolicy`,
- one-time link consumption at the delivery endpoint,
- temporary-link expiration handling,
- local file delivery when the referenced build asset exists on disk,
- manifest attachment fallback when the asset file is not present yet.

This step still does not include:
- external storage-backed signed URLs,
- newsletter automation,
- campaign management.

## Brevo transactional delivery and operational hardening

The repository now also includes the accepted operational hardening step for transactional email delivery:
- `BREVO` transport mode in addition to `LOG_ONLY`,
- provider-aware email transport abstraction,
- `providerName` and `providerMessageId` metadata stored on `EmailLog`,
- admin resend action for selected transactional email logs,
- improved admin visibility for provider-backed and fallback deliveries.

This step supports:
- real transactional delivery through Brevo when `EMAIL_TRANSPORT_MODE=BREVO`,
- safe local development through `LOG_ONLY`,
- recording provider delivery identifiers when Brevo accepts the request,
- reviewing resend attempts and provider metadata in `GET /admin/emails`.

This step still does not include:
- newsletter automation,
- marketing campaigns,
- queue workers or advanced retry orchestration.


## Content module foundation

The repository now also includes the accepted shell for public-site and content management MVP scope:
- `FaqEntry`
- `BlogPost`
- manual content management at `GET /admin/content`
- public content routes:
  - `GET /faq`
  - `GET /blog`
  - `GET /blog/[slug]`
  - `GET /products/fito-gen`

To bootstrap the accepted local starter content, run:

```bash
npm run content:bootstrap
```

This upserts:
- 3 published FAQ entries,
- 3 published launch blog posts.

This step intentionally avoids:
- enterprise CMS workflow,
- preview publishing,
- rich asset management,
- advanced editorial states beyond `DRAFT` and `PUBLISHED`.


### Tip after schema changes

If a newly added Prisma model appears as `undefined` during `next dev`, regenerate Prisma Client and clear the local Next.js cache before restarting the server:

```bash
npx prisma generate
npx prisma migrate deploy
rm -rf .next
npm run dev
```


## PDF one-pager foundation

The repository now also includes the accepted MVP foundation for product PDF handling:
- `MarketingPdf`
- public/private visibility configuration
- protected admin page at `GET /admin/pdfs`
- public or admin-only PDF page at `GET /one-pager/[slug]`
- PDF delivery endpoint at `GET /api/v1/pdf/download?slug=...`

To bootstrap the accepted baseline PDF record for local development, run:

```bash
npm run pdf:bootstrap
```

This step supports:
- one PDF one-pager per product,
- public or private visibility,
- manual storage-path configuration without a full asset manager,
- direct PDF delivery from `storage/media` when the file exists.

This step intentionally avoids:
- multi-asset media library workflows,
- gated PDF campaigns,
- full upload management for all marketing materials.

## Desktop API foundation

The repository now also includes the accepted desktop-facing API foundation for:
- desktop update checks,
- desktop news feed retrieval,
- manual admin management of desktop news items.

To bootstrap the accepted baseline desktop news feed for local development, run:

```bash
npm run desktop:bootstrap
```

This upserts three published desktop news feed items for:
- product `Fito Gen`,
- edition `Essentials`,
- channel `stable`.

The desktop API foundation currently includes:
- `GET /api/v1/desktop/update?product=fito-gen&edition=essentials&channel=stable&currentVersion=0.0.0`
- `GET /api/v1/desktop/news?product=fito-gen&edition=essentials&channel=stable&currentVersion=0.0.0`
- `GET /admin/desktop`

This step intentionally does not yet include:
- telemetry intake,
- feature request intake,
- software demand request intake.


## Desktop telemetry and feedback intake foundation

The repository now also includes the accepted MVP foundation for desktop-side write APIs:
- telemetry intake endpoint,
- feature request intake endpoint,
- software demand intake endpoint,
- protected admin review page at `GET /admin/desktop/intake`.

This step supports:
- `POST /api/v1/desktop/telemetry` with product / edition / channel scoping,
- `POST /api/v1/desktop/feature-requests`,
- `POST /api/v1/desktop/software-demand`,
- admin visibility into accepted telemetry events and desktop-side feedback records.

Example telemetry request:

```bash
curl -X POST http://localhost:3000/api/v1/desktop/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "product": "fito-gen",
    "edition": "essentials",
    "channel": "stable",
    "installationId": "demo-installation-001",
    "appVersion": "0.1.0",
    "eventType": "APP_STARTED",
    "severity": "INFO",
    "message": "Desktop client started successfully",
    "payload": {"launchMode": "manual"}
  }'
```

Example feature request:

```bash
curl -X POST http://localhost:3000/api/v1/desktop/feature-requests \
  -H "Content-Type: application/json" \
  -d '{
    "product": "fito-gen",
    "edition": "essentials",
    "channel": "stable",
    "installationId": "demo-installation-001",
    "appVersion": "0.1.0",
    "title": "Add batch label printing",
    "description": "It would help nursery operations if labels could be printed in batches for selected plants."
  }'
```

Example software demand request:

```bash
curl -X POST http://localhost:3000/api/v1/desktop/software-demand \
  -H "Content-Type: application/json" \
  -d '{
    "product": "fito-gen",
    "edition": "essentials",
    "channel": "stable",
    "installationId": "demo-installation-001",
    "appVersion": "0.1.0",
    "requestedSoftwareName": "eGen Inventory",
    "useCase": "We need a lightweight inventory and stock tracking tool for nursery operations.",
    "company": "Demo Nursery"
  }'
```

## Audit logging and CSV export foundation

The repository now also includes the first operational foundation for:
- audit logging of key administrative write actions,
- protected CSV exports for operational datasets,
- a protected operations page at `GET /admin/operations`.

Current CSV exports include:
- leads,
- consent records,
- newsletter subscriptions,
- contact inquiries,
- enterprise-interest submissions,
- desktop feature requests,
- desktop software demand requests,
- desktop telemetry events.

Exports are available through the admin UI and protected endpoints under `GET /api/v1/admin/exports/[dataset]`.


## MVP release checkpoint

The repository now includes a dedicated release-checkpoint layer for final MVP review:
- `docs/mvp-release-checkpoint.md` - operational release-readiness checklist,
- `docs/mvp-gap-analysis.md` - practical implementation gap summary,
- `npm run smoke:mvp` - automated smoke checks for public routes and desktop-facing read APIs,
- `npm run checkpoint:mvp` - shorthand for `typecheck`, `lint`, `smoke:health`, and `smoke:mvp`.

Before a final checkpoint review, run:

```bash
npx prisma generate
npx prisma migrate deploy
rm -rf .next
npm run checkpoint:mvp
```

Then review the manual checkpoint steps in `docs/mvp-release-checkpoint.md`.
