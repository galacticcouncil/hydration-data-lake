import { Request, Response } from 'express';
import {
  getMmReserveStateResolver,
  MmReserveState,
} from '../resolvers/mmReserves/reserves.resolver';
import crypto from 'node:crypto';
import { CacheManager } from '../../../utils/cacheManager';
import { OmnipoolAssetsLatestTvlResponse } from '../../graphql/plugins/query/omnipool/omnipoolTvlMetrics/resolvers';

export const getReserves = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Access query parameters
    const { underliningAssetId, aTokenId } = req.params;

    // Validate query parameters if needed
    if (!underliningAssetId || !aTokenId) {
      res.status(400).json({
        error:
          'Missing required query parameters: underlining-asset-id or a-token-id',
      });
      return;
    }

    const cacheKey = `REST_API_MM_RESERVES_STATE::${crypto
      .createHash('md5')
      .update(`${underliningAssetId}-${aTokenId}`)
      .digest('hex')}`;

    const cachedData =
      await CacheManager.getInstance().cache.get<MmReserveState>(cacheKey);

    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const data = await getMmReserveStateResolver({
      aTokenId,
      underliningAssetId,
    });

    if (!data) {
      res.status(404).json({ error: 'Reserve not found' });
      return;
    }

    await CacheManager.getInstance().cache.set<MmReserveState>(
      cacheKey,
      data,
      3_000
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
