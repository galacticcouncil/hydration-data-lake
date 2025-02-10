export const getLatestStableswapHistoricalVolumesBatchEntriesList = `
    SELECT *
    FROM batch_stableswap_hist_vols_list
    ORDER BY id DESC
    LIMIT 1;
`;
