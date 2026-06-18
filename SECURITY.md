# Security Policy

## Supported version

Security fixes are applied to the current `main` branch and the latest production release of eGen Labs Web Platform.

## Reporting a vulnerability

Do not disclose security vulnerabilities in a public GitHub issue.

Use one of the following private channels:

1. GitHub private vulnerability reporting / Security Advisory for this repository, when available.
2. The contact form published on `egenlabs.eu/contact`, with a clear request for a private security contact channel. Do not include secrets, personal data, exploit payloads or production credentials in the first message.

Include, where possible:

- affected route, module or version,
- concise reproduction steps,
- expected and observed behaviour,
- potential impact,
- suggested remediation, if known.

## Sensitive data

Never commit or attach:

- `.env` files or production configuration,
- API keys, access tokens or passwords,
- private keys or certificates,
- database dumps and backups,
- user exports,
- logs containing personal or authentication data,
- private application builds.

If a secret is exposed, revoke or rotate it immediately before removing it from the repository history.
