export const getLatestOmnipoolAssetHistoricalVolumesBatchEntriesList = `
    SELECT *
    FROM batch_omnipool_asset_hist_vols_list
    ORDER BY id DESC
    LIMIT 1;
`;
