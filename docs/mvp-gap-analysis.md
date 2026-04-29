# MVP Gap Analysis

This document is a pragmatic implementation-status note for the current repository checkpoint.
It does not change the baseline in `docs/living-specification.md`.

## Current estimate

- MVP completion estimate: **around 96%**
- The estimate is directional and based on accepted baseline coverage, not on file count or commit count.

## Implemented foundations

Implemented and operational at foundation level:
- public homepage and product landing,
- lead capture, consent recording, forms and newsletter-only signup,
- transactional email foundation and download issuance shell,
- configurable download policies and delivery shell,
- FAQ, blog, PDF one-pager,
- desktop update and news feed API,
- desktop telemetry and feedback intake,
- audit logging, CSV exports, backup and restore shell.

## Partial areas still worth reviewing

### WF-015 – consent definitions and consent content management
The repository handles consent data and versioned records, but a dedicated admin UX for managing consent definition content is still limited.

### WF-017 – telemetry review and filtering
Telemetry review is available, but filtering is still operationally basic rather than rich.

### WF-027 – multiple administrators
The auth model supports multiple admin users at data level, but there is no explicit admin-user management screen yet.

### WF-030 – upload build installers and marketing assets
The repository supports build metadata and storage-path based delivery, but not a full upload manager UI.

### Environment hardening
The baseline mentions dev, staging, and prod. The repository currently focuses on dev-first operability with lightweight runbooks rather than full deployment automation.

## Recommended interpretation

The repository is strong enough for a final MVP checkpoint review, but it is still worth treating the items above as the last practical review points before calling the MVP fully closed.
