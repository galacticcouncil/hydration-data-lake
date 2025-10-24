import { Client } from 'pg';

// === 1. DB connection config ===
const client = new Client({
  host: '',        // or your DB host
  port: 5432,
  user: '',
  password: '',
  database: '',    // change to your DB name
  ssl: false
});

const queryText = `
  WITH latest AS (
    SELECT DISTINCT ON (h.account_id, h.asset_id)
           h.account_id,
           h.asset_id,
           h.transferable,
           h.total_locked,
           (h.transferable + h.total_locked) AS total,
           h.para_block_height,
           h.block_id
    FROM account_asset_balance_historical_data h
    WHERE (h.transferable + h.total_locked) > 0
      AND (hashtext(h.account_id) % 100) = $1
    ORDER BY h.account_id, h.asset_id, h.para_block_height DESC
  )
  INSERT INTO account_asset_balance_latest AS tgt
    (id, account_id, asset_id,
     transferable, total_locked,
     transferable_in_ref_asset_norm, total_locked_in_ref_asset_norm,
     total, para_block_height, block_id)
  SELECT
    l.account_id || '-' || l.asset_id       AS id,
    l.account_id,
    l.asset_id,
    l.transferable,
    l.total_locked,
    '0' AS transferable_in_ref_asset_norm,
    '0' AS total_locked_in_ref_asset_norm,
    l.total,
    l.para_block_height,
    l.block_id
  FROM latest l
  ON CONFLICT (id) DO UPDATE
  SET transferable      = EXCLUDED.transferable,
      total_locked      = EXCLUDED.total_locked,
      total             = EXCLUDED.total,
      para_block_height = EXCLUDED.para_block_height,
      block_id          = EXCLUDED.block_id,
      transferable_in_ref_asset_norm = '0',
      total_locked_in_ref_asset_norm = '0'
  WHERE EXCLUDED.para_block_height >  tgt.para_block_height
     OR (
          EXCLUDED.para_block_height = tgt.para_block_height
      AND (EXCLUDED.transferable, EXCLUDED.total_locked)
          IS DISTINCT FROM (tgt.transferable, tgt.total_locked)
     );
`;

async function main() {
  await client.connect();

  console.log('Starting backfill of account_asset_balance_latest...\n');

  for (let shard = 8; shard < 100; shard++) {
    console.log(`🧩 Running shard ${shard}/99 ...`);
    const start = Date.now();

    try {
      await client.query('BEGIN');
      await client.query(queryText, [shard]);
      await client.query('COMMIT');
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`✅ Shard ${shard} completed in ${elapsed}s\n`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`❌ Shard ${shard} failed:`, err.message, '\n');
      break; // stop on failure
    }
  }

  await client.end();
  console.log('🎉 Backfill complete.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
