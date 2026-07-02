import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

const compose = read("compose.production.yaml");
const caddy = read("deploy/production/Caddyfile");
const composeEnv = read("deploy/production/compose.env.example");
const appEnv = read("deploy/production/app.env.example");
const deployScript = read("scripts/deploy-production.sh");
const all = [compose, caddy, composeEnv, appEnv, deployScript].join("\n");

const serviceBlock = (serviceName) => {
  const marker = `  ${serviceName}:\n`;
  const start = compose.indexOf(marker);

  assert.notEqual(
    start,
    -1,
    `Missing Compose service: ${serviceName}`,
  );

  const contentStart = start + marker.length;
  const remainder = compose.slice(contentStart);
  const boundaries = [
    remainder.search(/^  [a-zA-Z0-9_-]+:\s*$/m),
    remainder.search(/^(?:networks|volumes):\s*$/m),
  ].filter((index) => index >= 0);

  const end =
    boundaries.length > 0
      ? contentStart + Math.min(...boundaries)
      : compose.length;

  return compose.slice(start, end);
};

const postgresService = serviceBlock("postgres");
const appService = serviceBlock("app");
const caddyService = serviceBlock("caddy");

assert.match(compose, /^name:\s+egenlabs-production$/m);
assert.match(compose, /\/var\/lib\/egenlabs-production\/storage/);
assert.match(compose, /\/etc\/egenlabs-production\/app\.env/);
assert.match(compose, /backend:\s*\n\s+internal:\s+true/m);
assert.match(compose, /\.\/deploy\/production\/Caddyfile/);

assert.doesNotMatch(postgresService, /^\s{4}ports:\s*$/m);
assert.doesNotMatch(appService, /^\s{4}ports:\s*$/m);
assert.match(appService, /^\s{4}expose:\s*$/m);
assert.match(appService, /^\s{6}- "3000"\s*$/m);
assert.match(caddyService, /^\s{4}ports:\s*$/m);
assert.match(caddyService, /^\s{6}- "80:80"\s*$/m);
assert.match(caddyService, /^\s{6}- "443:443"\s*$/m);

for (const forbidden of [
  "egenlabs-staging",
  "/etc/egenlabs-staging",
  "/var/lib/egenlabs-staging",
  "staging.egenlabs.eu",
]) {
  assert.equal(
    all.includes(forbidden),
    false,
    `Production configuration contains forbidden value: ${forbidden}`,
  );
}

assert.match(composeEnv, /^APP_DOMAIN=egenlabs\.eu$/m);
assert.match(composeEnv, /^POSTGRES_DB=egenlabs_production$/m);
assert.match(appEnv, /^NODE_ENV=production$/m);
assert.match(appEnv, /^APP_URL=https:\/\/egenlabs\.eu$/m);
assert.match(appEnv, /^EMAIL_TRANSPORT_MODE=BREVO$/m);
assert.match(appEnv, /^TURNSTILE_ENABLED=true$/m);
assert.match(deployScript, /EXPECTED_COMMIT/);
assert.match(deployScript, /git status --porcelain/);
assert.match(deployScript, /compose config --quiet/);
assert.match(deployScript, /run --rm migrate/);
assert.match(caddy, /reverse_proxy app:3000/);

const suspiciousAssignments = all
  .split("\n")
  .filter(
    (line) =>
      /(?:API_KEY|SECRET|PASSWORD)=/.test(line) &&
      !/(?:replace-with|example)/.test(line),
  );

assert.deepEqual(
  suspiciousAssignments,
  [],
  `Potential committed secret assignments: ${suspiciousAssignments.join(", ")}`,
);

console.log("Production configuration smoke checks passed.");
