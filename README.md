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
- audit logging, backup, restore, and basic observability.

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
- final public download endpoint delivery,
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
- final public file delivery.

## Transactional email and issuance shell

The repository now also includes the first accepted transactional-email and issuance shell baseline:
- `EmailTemplate`,
- `EmailLog`,
- transactional email logging after successful download registration,
- issued `DownloadLink` creation aligned with the configured `DownloadPolicy`,
- protected admin review page at `GET /admin/emails`,
- public issued-link validation shell at `GET /download/access`.

This step supports:
- creating two transactional email logs per accepted registration (`DOWNLOAD_WELCOME` and `DOWNLOAD_LINK`),
- generating a shell download link using the configured policy mode,
- reusing static/public shell links where appropriate,
- validating issued links through a public shell page,
- reviewing recent transactional email bodies and statuses in the admin panel.

This step does not yet include:
- external provider delivery through Brevo,
- marketing automation or newsletter campaigns,
- final file streaming or signed storage delivery.

## Getting started

1. Create an empty private GitHub repository.
2. Initialize the local repository:

```bash
git init -b main
```

3. Add the bootstrap files:
- `.gitignore`
- `.env.example`
- `README.md`
- `/docs/living-specification.md`

4. Verify tracked files:

```bash
git status
```

5. Commit the bootstrap state:

```bash
git add .
git commit -m "chore: bootstrap repository"
```

6. Connect the remote and push:

```bash
git remote add origin <REMOTE-URL>
git push -u origin main
```

## Development rules

- Keep runtime architecture simple.
- Prefer explicit module boundaries over premature abstraction.
- Commit Prisma migrations to version control.
- Keep documentation aligned with `/docs/living-specification.md`.
- Do not expand MVP scope without a business reason.
- Treat security and observability as part of MVP, not post-launch extras.

## License

To be decided.
