export const getAllXykpoolIds = `
    SELECT xp.id as pool_id
    FROM xykpool xp;
`;

export const getAllActiveXykpoolIds = `
  SELECT xp.id as pool_id
  FROM xykpool xp
  WHERE xp.is_destroyed IS NOT TRUE;
`;
