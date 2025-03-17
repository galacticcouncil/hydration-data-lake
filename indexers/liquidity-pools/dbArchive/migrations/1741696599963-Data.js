module.exports = class Data1741696599963 {
  name = 'Data1741696599963';

  async up(queryRunner) {
    const allAssets = await queryRunner.manager
      .createQueryBuilder()
      .select('*')
      .from('asset', 'a')
      .getRawMany();

    const allAssetsMap = new Map(allAssets.map((asset) => [asset.id, asset]));

    const batchSize = 1000;
    let offset = 0;

    while (true) {
      const events = await queryRunner.manager
        .createQueryBuilder()
        .select(['id', 'all_involved_asset_ids'])
        .from('money_market_event', 'mme')
        .offset(offset)
        .limit(batchSize)
        .getRawMany();

      if (events.length === 0) {
        break;
      }

      for (const event of events) {
        const assetIds = event.all_involved_asset_ids;

        let newDetails = new Set();
        assetsLoop: for (const assetId of assetIds) {
          if (!allAssetsMap.has(assetId)) continue assetsLoop;

          if (allAssetsMap.get(assetId).name)
            newDetails.add(allAssetsMap.get(assetId).name);
          if (allAssetsMap.get(assetId).symbol)
            newDetails.add(allAssetsMap.get(assetId).symbol);
        }

        await queryRunner.query(
          `UPDATE money_market_event
           SET "all_involved_asset_details" = $1
           WHERE id = $2`,
          [[...newDetails.values()].join('_#_'), event.id]
        );
      }

      offset += batchSize;
    }
  }

  async down(db) {}
};
