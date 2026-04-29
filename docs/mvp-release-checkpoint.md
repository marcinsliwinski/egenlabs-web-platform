# MVP Release Checkpoint

This document is a practical release-readiness checklist for the current MVP baseline.
It is intentionally operational and does not replace `docs/living-specification.md`.

## Current checkpoint summary

The repository already includes the accepted MVP foundations for:
- public site and product landing pages,
- admin auth and protected admin area,
- download registration, consent handling, issuance and delivery shells,
- transactional email foundation with Brevo and `LOG_ONLY` fallback,
- FAQ, blog, PDF one-pager and public forms,
- desktop-facing API for update, news, telemetry and feedback,
- audit logging, CSV export, and backup/restore shell.

## Release checkpoint commands

Run these commands before a final MVP checkpoint review:

```bash
npx prisma generate
npx prisma migrate deploy
rm -rf .next
npm run typecheck
npm run lint
npm run smoke:health
npm run smoke:mvp
```

> `npm run smoke:mvp` assumes the application is already running locally under `http://localhost:3000`.

## Recommended local launch sequence

```bash
cp .env.example .env
docker compose up -d
npx prisma generate
npx prisma migrate deploy
npm run catalog:bootstrap
npm run content:bootstrap
npm run desktop:bootstrap
npm run pdf:bootstrap
rm -rf .next
npm run dev
```

## Manual admin checkpoint

Validate these flows manually after login:

### Admin authentication
- login through `/admin/login`
- access `/admin`
- logout and confirm route protection still works

### Catalog and downloads
- create a build metadata record
- activate exactly one build for `product + edition + channel`
- review `/admin/downloads`
- confirm policy changes are reflected in delivery flow

### Leads, forms, and emails
- submit `/download/register`
- confirm lead and consent records in `/admin/leads`
- review issuance and email logs in `/admin/emails`
- test manual resend for an existing email log entry
- submit `/newsletter`, `/contact`, `/enterprise`
- review `/admin/forms`

### Content and PDF
- review `/admin/content`
- create or update one FAQ entry
- create or update one blog post
- review `/admin/pdfs`
- confirm `/one-pager/fito-gen-one-pager` and `/api/v1/pdf/download?slug=fito-gen-one-pager`

### Desktop-facing API
- review `/admin/desktop`
- review `/admin/desktop/intake`
- call desktop endpoints:
  - `/api/v1/desktop/update`
  - `/api/v1/desktop/news`
  - `/api/v1/desktop/telemetry`
  - `/api/v1/desktop/feature-requests`
  - `/api/v1/desktop/software-demand`

### Operations
- review `/admin/operations`
- download at least one CSV export
- execute:
  - `npm run ops:backup:db`
  - `npm run ops:backup:storage`
- confirm backup artifacts are written outside Git

## Release-readiness criteria for the checkpoint

Treat the MVP checkpoint as ready when all of the following are true:
- `typecheck`, `lint`, `smoke:health`, and `smoke:mvp` are green,
- Prisma migrations apply cleanly on a fresh local database,
- the public registration and download flow works end-to-end,
- Brevo or `LOG_ONLY` mode is intentionally configured and understood,
- admin routes are protected and usable,
- backup and restore procedures are documented and tested manually,
- no secrets, backups, dumps, or user exports are present in Git.

## Known remaining gaps before a production-style 1.0 checkpoint

The current repository is close to the accepted MVP baseline, but these items remain partial or intentionally minimal:
- build upload is still metadata/storage-path oriented rather than a full upload manager,
- consent definition management exists at data level but not yet as a dedicated admin UX for editing consent content versions,
- telemetry review exists, but advanced filtering is still minimal,
- admin multi-user support exists at data/auth level, but there is no dedicated admin-user management screen,
- staging and production environments are part of the baseline, but deployment automation remains intentionally light.

These are not blockers for the repository checkpoint itself, but they are the most relevant items to review before calling the MVP fully closed.
