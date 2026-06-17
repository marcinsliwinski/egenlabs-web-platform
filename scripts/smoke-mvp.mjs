#!/usr/bin/env node
import process from 'node:process';

const baseUrl = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS ?? 10000);

const checks = [
  { path: '/', expectedStatus: 200, label: 'Homepage' },
  { path: '/products/fito-gen', expectedStatus: 200, label: 'Fito Gen product landing' },
  { path: '/products', expectedStatus: 200, label: 'Products index' },
  { path: '/products/gen-fed', expectedStatus: 200, label: 'GEN-FED line' },
  { path: '/products/gen-fed/40-10', expectedStatus: 200, label: 'GEN-FED 40-10 series' },
  { path: '/products/gen-fed/40-10/gf4010-s-uqrp-k261', expectedStatus: 200, label: 'GEN-FED 40-10 S µQRP product' },
  { path: '/products/gen-fed/40-10/gf4010-m-hd-k261', expectedStatus: 200, label: 'GEN-FED 40-10 M HD product' },
  { path: '/products/gen-fed/80-10', expectedStatus: 200, label: 'GEN-FED 80-10 series' },
  { path: '/products/gen-fed/80-10/gf8010-s-std-k261', expectedStatus: 200, label: 'GEN-FED 80-10 S STD product' },
  { path: '/products/gen-fed/80-10/gf8010-m-hd-k261', expectedStatus: 200, label: 'GEN-FED 80-10 M HD product' },
  { path: '/products/gen-fed/un-un', expectedStatus: 200, label: 'GEN-FED Un-Un catalog' },
  { path: '/products/gen-fed/un-un/gfu49-std-261', expectedStatus: 200, label: 'GEN-FED Un-Un STD product' },
  { path: '/products/cmc-gen', expectedStatus: 200, label: 'CMC-GEN catalog' },
  { path: '/products/cmc-gen/cmcg-std-261', expectedStatus: 200, label: 'CMC-GEN STD product' },
  { path: '/downloads/ham-radio', expectedStatus: 200, label: 'Ham radio downloads' },
  {
    path: '/downloads/ham-radio/gen-fed-cmc-gen-261/v20/instrukcja-obslugi-i-instalacji-gen-fed-cmc-gen-261-pl.pdf',
    expectedStatus: 200,
    label: 'GEN-FED public manual PDF'
  },
  {
    path: '/downloads/ham-radio/gen-fed-cmc-gen-261/v20/karta-techniczna-gen-fed-cmc-gen-261-pl.pdf',
    expectedStatus: 200,
    label: 'GEN-FED public technical card PDF'
  },
  { path: '/faq', expectedStatus: 200, label: 'FAQ page' },
  { path: '/blog', expectedStatus: 200, label: 'Blog list' },
  { path: '/newsletter', expectedStatus: 200, label: 'Newsletter form' },
  { path: '/contact', expectedStatus: 200, label: 'Contact form' },
  { path: '/enterprise', expectedStatus: 200, label: 'Enterprise form' },
  { path: '/download/register', expectedStatus: 200, label: 'Download registration' },
  { path: '/one-pager/fito-gen-one-pager', expectedStatus: 200, label: 'PDF detail page' },
  { path: '/api/v1/health', expectedStatus: 200, label: 'Health endpoint', validateJson: body => body?.status === 'ok' },
  {
    path: '/api/v1/desktop/update?product=fito-gen&edition=essentials&channel=stable&currentVersion=0.0.0',
    expectedStatus: 200,
    label: 'Desktop update endpoint',
    validateJson: body =>
      typeof body === 'object' &&
      body !== null &&
      typeof body.status === 'string' &&
      ['ok', 'active_build_missing'].includes(body.status)
  },
  {
    path: '/api/v1/desktop/news?product=fito-gen&edition=essentials&channel=stable&currentVersion=0.0.0',
    expectedStatus: 200,
    label: 'Desktop news endpoint',
    validateJson: body => typeof body === 'object' && body !== null && body.status === 'ok'
  }
];

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, redirect: 'follow' });
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  let failures = 0;
  console.log(`Running MVP smoke checks against ${baseUrl}`);

  for (const check of checks) {
    const url = `${baseUrl}${check.path}`;

    try {
      const response = await fetchWithTimeout(url);
      let jsonBody = null;
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        try {
          jsonBody = await response.clone().json();
        } catch {
          jsonBody = null;
        }
      }

      const statusOk = response.status === check.expectedStatus;
      const bodyOk = check.validateJson ? check.validateJson(jsonBody) : true;

      if (statusOk && bodyOk) {
        console.log(`✓ ${check.label}: ${response.status} ${check.path}`);
      } else {
        failures += 1;
        console.error(`✗ ${check.label}: got ${response.status}, expected ${check.expectedStatus} at ${check.path}`);
        if (check.validateJson && !bodyOk) {
          console.error(`  JSON payload did not match expected shape.`);
        }
      }
    } catch (error) {
      failures += 1;
      console.error(`✗ ${check.label}: request failed for ${check.path}`);
      console.error(`  ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures > 0) {
    console.error(`\nMVP smoke checks failed: ${failures} failing check(s).`);
    process.exitCode = 1;
    return;
  }

  console.log('\nAll MVP smoke checks passed.');
}

await main();
