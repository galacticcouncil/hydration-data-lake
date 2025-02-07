export const getBlockByTimestampGrtOrEq = `
    SELECT 
        height, 
        timestamp
    FROM block
    WHERE timestamp >= $1
    ORDER BY timestamp ASC
    LIMIT 1;
`;

export const getBlockByTimestampLtOrEq = `
    SELECT 
        height,
        timestamp
    FROM block
    WHERE timestamp <= $1
    ORDER BY timestamp DESC
    LIMIT 1;
`;

export const getLatestXykpoolHistoricalVolumesBatchEntriesList = `
    SELECT *
    FROM batch_xykpool_hist_vols_list
    ORDER BY id DESC
    LIMIT 1;
`;
