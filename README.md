# eGen Labs CI quality gate fix

Copy the package contents into the repository root.

Then run:

```bash
git diff --check
git status --short
git add .github/workflows/quality.yml docs/ci-quality-gate-fix-2026-06-18.md
git commit -m "Fix CI development dependency installation"
git push origin main
```

Open GitHub Actions and verify that the `Quality gate` workflow is green.
