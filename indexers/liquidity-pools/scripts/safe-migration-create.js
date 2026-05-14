/**
 * Safe replacement for `squid-typeorm-migration generate`.
 *
 * Generates a new TypeORM migration against an isolated, throwaway "shadow" Postgres
 * container that has ONLY the existing native SQD migrations from `db/migrations/`
 * applied to it. Custom migrations from `src/customDbMigrations/migrations/` and
 * `src/apiSupport/apiMigrations/migrations/` are NEVER applied to the shadow DB.
 *
 * Why: when the generator runs against the developer's live DB, any object created
 * by a custom migration (indexes on entity tables, computed columns, views, triggers)
 * is invisible to the entity metadata and therefore shows up as drift to be DROPped
 * in the generated migration. Running against a clean shadow DB makes the diff
 * mathematically equal to "entity changes only".
 *
 * Flow:
 *   1. Start a fresh `postgres:15` container on a random host port.
 *   2. Wait for it to become ready.
 *   3. Run `squid-typeorm-migration apply` against it (env vars overridden).
 *   4. Run `squid-typeorm-migration generate` against it.
 *   5. Tear the container down (always, even on failure / Ctrl-C).
 *   6. Scan the newly created migration for DROP statements and print a heads-up
 *      so the developer can sanity-check whether any drop is expected.
 *
 * No manual steps. No dependency on docker-compose. Works in CI.
 */

const { spawn, spawnSync } = require('child_process');
const net = require('net');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const SHADOW_DB_NAME = 'shadow_db';
const SHADOW_DB_USER = 'postgres';
const SHADOW_DB_PASS = 'postgres';
const POSTGRES_IMAGE = 'postgres:15';
const CONTAINER_NAME = `sqd-shadow-db-${process.pid}-${Date.now()}`;
const MIGRATIONS_DIR = path.resolve(__dirname, '..', 'db', 'migrations');

function log(msg) {
  process.stdout.write(`[safe-migration-create] ${msg}\n`);
}

function logErr(msg) {
  process.stderr.write(`[safe-migration-create] ${msg}\n`);
}

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function runDocker(args, opts = {}) {
  const res = spawnSync('docker', args, { encoding: 'utf8', ...opts });
  if (res.error) throw res.error;
  return res;
}

async function startShadowContainer(port) {
  log(`Starting shadow Postgres container "${CONTAINER_NAME}" on 127.0.0.1:${port}...`);
  const res = runDocker([
    'run',
    '-d',
    '--rm',
    '--name', CONTAINER_NAME,
    '-e', `POSTGRES_DB=${SHADOW_DB_NAME}`,
    '-e', `POSTGRES_USER=${SHADOW_DB_USER}`,
    '-e', `POSTGRES_PASSWORD=${SHADOW_DB_PASS}`,
    '-p', `127.0.0.1:${port}:5432`,
    POSTGRES_IMAGE,
  ]);
  if (res.status !== 0) {
    throw new Error(`docker run failed (exit ${res.status}):\n${res.stderr}`);
  }
}

function stopShadowContainer() {
  log(`Stopping shadow container "${CONTAINER_NAME}"...`);
  runDocker(['rm', '-f', CONTAINER_NAME], { stdio: 'ignore' });
}

async function waitForReady(port, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  log('Waiting for shadow DB to accept connections...');
  while (Date.now() < deadline) {
    const client = new Client({
      host: '127.0.0.1',
      port,
      user: SHADOW_DB_USER,
      password: SHADOW_DB_PASS,
      database: SHADOW_DB_NAME,
    });
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      log('Shadow DB is ready.');
      return;
    } catch (err) {
      try { await client.end(); } catch (_) { /* ignore */ }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Shadow DB did not become ready within ${timeoutMs}ms`);
}

function runSqdMigration(subCmd, port) {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      DB_HOST: '127.0.0.1',
      DB_PORT: String(port),
      DB_NAME: SHADOW_DB_NAME,
      DB_USER: SHADOW_DB_USER,
      DB_PASS: SHADOW_DB_PASS,
      DB_SSL: 'false',
    };
    log(`Running: npx squid-typeorm-migration ${subCmd}`);
    const child = spawn('npx', ['squid-typeorm-migration', subCmd], {
      env,
      stdio: 'inherit',
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`squid-typeorm-migration ${subCmd} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return new Set();
  return new Set(fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.js')));
}

function scanGeneratedMigrationForDrops(beforeFiles) {
  const after = listMigrationFiles();
  const newFiles = [...after].filter((f) => !beforeFiles.has(f));
  if (newFiles.length === 0) {
    log('No new migration file was generated — entities match shadow DB schema.');
    return;
  }
  for (const file of newFiles) {
    const fullPath = path.join(MIGRATIONS_DIR, file);
    const contents = fs.readFileSync(fullPath, 'utf8');
    const dropPattern = /\bDROP\s+(INDEX|TABLE|VIEW|COLUMN|FUNCTION|TRIGGER|MATERIALIZED\s+VIEW|SCHEMA|CONSTRAINT)\b[^`"'\n]*?["`]([^"`]+)["`](?:\s*\.\s*["`]([^"`]+)["`])?/gi;
    const drops = [];
    let m;
    while ((m = dropPattern.exec(contents)) !== null) {
      const kind = m[1].toUpperCase().replace(/\s+/g, ' ');
      const name = m[3] ? `${m[2]}.${m[3]}` : m[2];
      drops.push(`DROP ${kind} ${name}`);
    }
    log(`Generated: ${file}`);
    if (drops.length > 0) {
      logErr('');
      logErr('================================================================');
      logErr(`WARNING: generated migration contains DROP statements:`);
      logErr(`  file: ${file}`);
      for (const d of drops) logErr(`    - ${d}`);
      logErr('');
      logErr('Because this migration was generated against a clean shadow DB,');
      logErr('every DROP here corresponds to a real removal in your entities');
      logErr('(deleted @Entity, deleted @Column, deleted @Index, etc.).');
      logErr('Verify each DROP is intentional before committing.');
      logErr('================================================================');
      logErr('');
    }
  }
}

let cleanedUp = false;
function cleanup() {
  if (cleanedUp) return;
  cleanedUp = true;
  try { stopShadowContainer(); } catch (e) {
    logErr(`Cleanup failed: ${e.message}`);
  }
}

async function main() {
  const dockerCheck = runDocker(['version', '--format', '{{.Server.Version}}']);
  if (dockerCheck.status !== 0) {
    throw new Error('Docker is not available. The shadow-DB workflow requires a running Docker daemon.');
  }

  const port = await findFreePort();
  const beforeFiles = listMigrationFiles();

  await startShadowContainer(port);

  process.on('exit', cleanup);
  process.on('SIGINT', () => { cleanup(); process.exit(130); });
  process.on('SIGTERM', () => { cleanup(); process.exit(143); });

  await waitForReady(port);
  await runSqdMigration('apply', port);
  await runSqdMigration('generate', port);

  scanGeneratedMigrationForDrops(beforeFiles);

  log('Done.');
}

main()
  .then(() => { cleanup(); process.exit(0); })
  .catch((err) => {
    logErr(err.stack || err.message || String(err));
    cleanup();
    process.exit(1);
  });
