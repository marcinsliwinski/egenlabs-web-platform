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
const backupScript = read("scripts/backup-production.sh");
const backupVerifyScript = read("scripts/verify-production-backup-artifact.sh");
const backupEnv = read("deploy/production/backup.env.example");
const backupService = read("deploy/production/systemd/egenlabs-production-backup.service");
const backupTimer = read("deploy/production/systemd/egenlabs-production-backup.timer");
const all = [
  compose,
  caddy,
  composeEnv,
  appEnv,
  deployScript,
  backupScript,
  backupVerifyScript,
  backupEnv,
  backupService,
  backupTimer,
].join("\n");

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
assert.match(appEnv, /^BREVO_SENDER_EMAIL=kontakt@egenlabs\.eu$/m);
assert.match(appEnv, /^BREVO_SENDER_NAME=eGen Labs Web Platform$/m);
assert.match(appEnv, /^TURNSTILE_ENABLED=true$/m);
assert.match(deployScript, /EXPECTED_COMMIT/);
assert.match(deployScript, /git status --porcelain/);
assert.match(deployScript, /compose config --quiet/);
assert.match(deployScript, /run --rm migrate/);
assert.match(deployScript, /docker inspect/);
assert.doesNotMatch(deployScript, /compose ps --format json app[\s\S]*node -e/);
assert.match(caddy, /reverse_proxy app:3000/);

assert.match(backupEnv, /^APP_DIR=\/opt\/egenlabs-production\/app$/m);
assert.match(backupEnv, /^COMPOSE_PROJECT=egenlabs-production$/m);
assert.match(backupEnv, /^COMPOSE_ENV_FILE=\/etc\/egenlabs-production\/compose\.env$/m);
assert.match(backupEnv, /^STORAGE_ROOT=\/var\/lib\/egenlabs-production\/storage$/m);
assert.match(backupEnv, /^BACKUP_ROOT=\/var\/backups\/egenlabs-production\/automated$/m);
assert.match(backupEnv, /^RCLONE_DESTINATION=r2:egenlabs-production-backups\/production\/automated$/m);
assert.match(backupEnv, /^LOCAL_RETENTION_DAYS=14$/m);
assert.match(backupEnv, /^REMOTE_RETENTION_DAYS=30$/m);
assert.match(backupScript, /AGE_RECIPIENT is required/);
assert.match(backupScript, /rclone copyto/);
assert.match(backupScript, /rclone delete/);
assert.match(backupScript, /pg_dump/);
assert.match(backupScript, /sha256sum -c SHA256SUMS/);
assert.match(backupScript, /rm -rf -- "\$\{WORK_DIR\}"/);
assert.match(backupScript, /No secrets and plaintext payloads must not be printed|Secrets and plaintext payloads must not be printed/);
assert.doesNotMatch(backupScript, /cat .*compose\.env/);
assert.doesNotMatch(backupScript, /cat .*backup\.env/);
assert.match(backupVerifyScript, /DOWNLOAD-BACK SHA256: PASS/);
assert.match(backupVerifyScript, /AGE_IDENTITY_FILE/);
assert.match(backupService, /ExecStart=\/opt\/egenlabs-production\/app\/scripts\/backup-production\.sh/);
assert.match(backupService, /Environment=EGENLABS_BACKUP_CONFIG=\/etc\/egenlabs-production\/backup\.env/);
assert.match(backupTimer, /OnCalendar=\*-\*-\* 03:20:00 Europe\/Warsaw/);
assert.match(backupTimer, /RandomizedDelaySec=20min/);

const suspiciousAssignments = all
  .split("\n")
  .filter(
    (line) =>
      /(?:API_KEY|SECRET|PASSWORD)=/.test(line) &&
      !/(?:replace-with|example)/.test(line) &&
      !line.includes('PGPASSWORD="$POSTGRES_PASSWORD"'),
  );

assert.deepEqual(
  suspiciousAssignments,
  [],
  `Potential committed secret assignments: ${suspiciousAssignments.join(", ")}`,
);

console.log("Production configuration smoke checks passed.");
