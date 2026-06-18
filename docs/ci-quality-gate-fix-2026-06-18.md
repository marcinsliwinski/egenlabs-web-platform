# CI quality gate fix — 2026-06-18

## Problem

The quality workflow declared `NODE_ENV=production` at job level. npm therefore omitted `devDependencies` during `npm ci`. The missing packages included TypeScript declarations for React and Node.js, causing errors such as missing `JSX.IntrinsicElements`, `react/jsx-runtime` declarations, and the `process` global.

The workflow also used `actions/checkout@v4` and `actions/setup-node@v4`, which run on the deprecated Node.js 20 action runtime.

## Fix

- Removed job-level `NODE_ENV=production`.
- Changed dependency installation to `npm ci --include=dev`.
- Added an explicit toolchain verification step for TypeScript and declaration packages.
- Applied `NODE_ENV=production` only to the build and application start steps.
- Upgraded `actions/checkout` and `actions/setup-node` to v5, which use the Node.js 24 action runtime.

## Scope

This is a CI configuration bug fix. It does not change application architecture, product scope, API contracts, database models, or production dependencies.
