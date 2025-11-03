module.exports = class Data1762193328414 {
  name = 'Data1762193328414';

  async up(db) {
    // Prefill stableswap_asset_historical_data_latest with the latest records for each asset
    // We need to join with stableswap_historical_data to get pool_id and with stableswap_asset to get stableswap_asset_id
    await db.query(`
      INSERT INTO stableswap_asset_historical_data_latest
        (id, asset_id, pool_id, stableswap_asset_id, pool_historical_data_id,
         free_balance, para_block_height, block_id)
      SELECT DISTINCT ON (sahd.asset_id, shd.pool_id)
        substring(sahd.id from 1 for length(sahd.id) - position('-' in reverse(sahd.id))) as id,
        sahd.asset_id,
        shd.pool_id,
        sa.id as stableswap_asset_id,
        sahd.pool_historical_data_id,
        sahd.free_balance,
        sahd.para_block_height,
        sahd.block_id
      FROM stableswap_asset_historical_data sahd
      INNER JOIN stableswap_historical_data shd ON sahd.pool_historical_data_id = shd.id
      INNER JOIN stableswap_asset sa ON sa.asset_id = sahd.asset_id AND sa.pool_id = shd.pool_id
      ORDER BY sahd.asset_id, shd.pool_id, sahd.para_block_height DESC
    `);
  }

  async down(db) {
    // Clear the prefilled data from stableswap_asset_historical_data_latest
    await db.query(`TRUNCATE TABLE stableswap_asset_historical_data_latest`);
  }
};
