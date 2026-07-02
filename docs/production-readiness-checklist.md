# Production readiness checklist

## Release identity

- [ ] Accepted application baseline is recorded.
- [ ] Production operations release commit is recorded.
- [ ] GitHub Actions quality gate is green for the operations release.
- [ ] Repository is clean and checked out at the exact approved commit.

## Isolation

- [ ] Compose project is `egenlabs-production`.
- [ ] Production database is `egenlabs_production`.
- [ ] Production uses `/etc/egenlabs-production`.
- [ ] Production storage uses `/var/lib/egenlabs-production/storage`.
- [ ] Production backups use `/var/backups/egenlabs-production`.
- [ ] No staging secret, key, volume, network, database, or storage path is reused.
- [ ] PostgreSQL has no published host port.
- [ ] Application has no published host port.
- [ ] Backend network is internal.
- [ ] Only Caddy publishes ports 80 and 443.

## Secrets and access

- [ ] Environment files are root-owned and mode `0600`.
- [ ] Production `AUTH_SECRET` is unique and sufficiently random.
- [ ] Production Brevo credentials are separate and sender identity is verified.
- [ ] Production Turnstile keys are separate and limited to production domains.
- [ ] SSH access and firewall rules are reviewed.
- [ ] No secret is stored in Git, reports, shell history, or chat.

## Data and recovery

- [ ] Clean pre-production database state is approved.
- [ ] Persistent storage content is approved.
- [ ] Database backup completed and checksum recorded.
- [ ] Storage backup completed and checksum recorded.
- [ ] Encrypted copy exists outside the production VPS.
- [ ] Restore procedure has been rehearsed in isolation.
- [ ] Rollback commit and backup identifiers are recorded.

## DNS, TLS, and public behavior

- [ ] `egenlabs.eu` and approved aliases resolve to the production VPS.
- [ ] Ports 80 and 443 are reachable.
- [ ] Caddy obtains a valid certificate.
- [ ] HTTPS redirect and security headers are confirmed.
- [ ] Public health endpoint is green.
- [ ] MVP smoke suite passes against `https://egenlabs.eu`.
- [ ] Download registration remains disabled unless separately approved.

## Final decision

- [ ] Production deployment evidence is archived without sensitive data.
- [ ] Known warnings and accepted risks are recorded.
- [ ] Formal `PRODUCTION GO` is explicitly approved.
