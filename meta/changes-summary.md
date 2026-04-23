# Changes summary

## Specification updates
- Updated the living specification with the accepted baseline for the MVP admin auth shell.
- Added Decision Log entry DEC-015 and ADR-007.
- Closed the open question about the admin auth/session model.

## Non-specification updates
- Unified `DATABASE_URL` in `.env.example` and removed the duplicate variable.
- Kept the database name consistent with `compose.yaml` and the existing health flow (`egenlabs_web`).
- Changed the root HTML language from `en` to `pl`.
- Replaced `latest` version ranges in `package.json` with versions resolved in the existing lockfile.
- Updated the root package metadata inside `package-lock.json` to match `package.json`.

## Git note
- The source package does not include the `.git` directory, so no real Git commit object could be created inside this archive.
- `meta/proposed-commit-message.txt` contains the recommended commit message for applying these changes in the actual repository.
