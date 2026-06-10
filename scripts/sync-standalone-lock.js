#!/usr/bin/env node
/*
 * Regenerate a *standalone* package-lock.json for a workspace member that is
 * built in isolation by Docker (`COPY package.json package-lock.json; npm ci`).
 *
 * Why this exists:
 *   Members of this npm workspace normally have no lockfile of their own — deps
 *   hoist to the root lockfile. The Docker builds for `indexers/liquidity-pools`
 *   (and `indexers/storage-dictionary`) copy only the member's package.json +
 *   package-lock.json and run `npm ci` standalone, so each needs a lockfile that
 *   is valid on its own.
 *
 *   The old approach copied the *workspace-root* lockfile into the member dir
 *   (`cpx package-lock.json indexers/<member>/`). That only produces a valid
 *   standalone lockfile when the member's deps all hoist to the root. The moment
 *   a member pins a version that conflicts with another member (e.g.
 *   liquidity-pools on polkadot-api@2 while another member is on @1), its deps
 *   nest under `indexers/<member>/node_modules/...` and the copied-down lockfile
 *   no longer describes a valid standalone project — `npm ci` in Docker then
 *   fails with "Missing ... from lock file".
 *
 * What this does:
 *   Resolves the member's deps in an isolated temp dir *outside* the workspace
 *   (so npm can't walk up and treat it as a workspace member), then copies the
 *   resulting standalone package-lock.json back into the member dir.
 *
 * Usage:
 *   node scripts/sync-standalone-lock.js indexers/liquidity-pools
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const memberRel = process.argv[2];
if (!memberRel) {
  console.error('Usage: node scripts/sync-standalone-lock.js <member-dir>');
  console.error('  e.g. node scripts/sync-standalone-lock.js indexers/liquidity-pools');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const memberDir = path.resolve(repoRoot, memberRel);
const memberPkg = path.join(memberDir, 'package.json');
const memberLock = path.join(memberDir, 'package-lock.json');

if (!fs.existsSync(memberPkg)) {
  console.error(`No package.json at ${memberPkg}`);
  process.exit(1);
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'standalone-lock-'));
try {
  fs.copyFileSync(memberPkg, path.join(tmpDir, 'package.json'));
  // Seed with the existing lock (if any) so npm only diffs against package.json.
  if (fs.existsSync(memberLock)) {
    fs.copyFileSync(memberLock, path.join(tmpDir, 'package-lock.json'));
  }

  console.log(`[sync-standalone-lock] resolving ${memberRel} in ${tmpDir} ...`);
  // Disable engine-strict for this child install. We only resolve the dependency
  // tree to produce a lockfile — the host's node version is irrelevant. Without
  // this, `npm run` propagates the repo .npmrc `engine-strict=true` via
  // npm_config_engine_strict, which turns the normal EBADENGINE *warning* (e.g.
  // deps requiring node>=22 while CI/Docker run node 20) into a fatal error.
  // The real Docker build does not enforce engines (it never COPYs .npmrc), so
  // matching that behaviour here keeps the generated lock faithful.
  execFileSync(
    'npm',
    ['install', '--package-lock-only', '--no-audit', '--no-fund', '--engine-strict=false'],
    {
      cwd: tmpDir,
      stdio: 'inherit',
      env: { ...process.env, npm_config_engine_strict: 'false' },
    }
  );

  fs.copyFileSync(path.join(tmpDir, 'package-lock.json'), memberLock);
  console.log(`[sync-standalone-lock] wrote standalone lock -> ${memberRel}/package-lock.json`);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
