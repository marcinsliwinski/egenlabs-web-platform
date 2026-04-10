# eGen Labs Web Platform

Official web platform for **eGen Labs**.

This repository contains the MVP foundation for:
- public website and product landing pages,
- lead capture and consent handling,
- email delivery and newsletter workflows,
- application download management,
- admin panel and content management,
- desktop support APIs for updates, news feed, telemetry, and feedback.

## Project context

- Parent brand: **eGen**
- Software/web subbrand: **eGen Labs**
- First supported product: **Fito Gen**
- Initial edition: **Essentials**
- Initial market: **Poland / Polish language**
- Architecture target: **multi-product**, while MVP focuses on **Fito Gen Essentials**

## Tech stack (MVP)

- **Next.js** (full-stack)
- **TypeScript**
- **PostgreSQL**
- **Prisma**
- **Docker / Docker Compose**
- **Cloudflare**
- **Brevo**
- **VPS storage** for build assets and public/private downloadable files

## Repository goals

This repository should remain:
- modular,
- secure,
- easy to maintain,
- clean and predictable,
- safe to publish on GitHub without leaking sensitive data.

## Important security rules

Never commit:
- real `.env` files,
- API keys, tokens, passwords, or secrets,
- database dumps,
- backups,
- private build assets,
- user exports,
- telemetry exports,
- logs containing personal or operationally sensitive data.

Use:
- `.env.example` for variable templates,
- placeholders in docs,
- `.gitignore` to protect local and sensitive files.

## Recommended initial structure

```text
.
├── .env.example
├── .gitignore
├── README.md
├── docs/
│   └── living-specification.md
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
- `features/downloads` - build metadata, links, policies, assets
- `features/content` - blog, FAQ, PDF, news feed content
- `features/desktop-api` - update, news, telemetry, feedback endpoints
- `features/admin` - admin panel, auth, roles, audits

## Suggested first milestones

1. Bootstrap repository and project structure
2. Add living specification to `/docs/living-specification.md`
3. Initialize Next.js + TypeScript app
4. Configure Prisma + PostgreSQL
5. Add admin auth foundation
6. Implement lead capture and consent flow
7. Implement email and download flow
8. Implement admin content and build management
9. Implement update/news/telemetry endpoints
10. Harden, test, deploy

## Development notes

- Keep runtime architecture simple: **modular monolith**
- Prefer explicit module boundaries over premature abstractions
- Version APIs from `/api/v1`
- Commit migrations to version control
- Keep docs aligned with `/docs/living-specification.md`

## License

To be decided.
