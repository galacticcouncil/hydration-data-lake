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
