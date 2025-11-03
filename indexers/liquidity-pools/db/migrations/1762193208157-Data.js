module.exports = class Data1762193208157 {
  name = 'Data1762193208157';

  async up(db) {
    // Prefill omnipool_asset_historical_data_latest with the latest records for each asset
    await db.query(`
      INSERT INTO omnipool_asset_historical_data_latest
        (id, omnipool_asset_id, asset_id, asset_cap, asset_shares,
         asset_hub_reserve, asset_protocol_shares, free_balance,
         para_block_height, block_id)
      SELECT DISTINCT ON (asset_id)
        substring(id from 1 for length(id) - position('-' in reverse(id))) as id,
        omnipool_asset_id, asset_id, asset_cap, asset_shares,
        asset_hub_reserve, asset_protocol_shares, free_balance,
        para_block_height, block_id
      FROM omnipool_asset_historical_data
      ORDER BY asset_id, para_block_height DESC
    `);
  }

  async down(db) {
    // Clear the prefilled data from omnipool_asset_historical_data_latest
    await db.query(`TRUNCATE TABLE omnipool_asset_historical_data_latest`);
  }
};
