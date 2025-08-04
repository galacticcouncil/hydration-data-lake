export const getLatestXykpoolHistoricalVolumesBatchEntriesList = `
    SELECT *
    FROM batch_xykpool_hist_vols_list
    ORDER BY id DESC
    LIMIT 1;
`;
