import { constants, storage } from '../typegenTypes/';
import {
  LbpGetAllPoolsDataInput,
  LbpGetPoolDataInput,
  LbpPoolConstants,
  LbpPoolData,
  LbpPoolStorageData,
  XykPoolAssetIds,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { BlockHeader } from '@subsquid/substrate-processor';

function getPoolConstants(block: BlockHeader): LbpPoolConstants | null {
  if (block.specVersion < 276) return null;

  let repayFee = null;
  let maxInRatio = null;
  let maxOutRatio = null;
  let minPoolLiquidity = null;
  let minTradingLimit = null;

  if (constants.lbp.repayFee.v276.is(block)) {
    const resp = constants.lbp.repayFee.v276.get(block);
    if (resp) repayFee = resp;
  }
  if (constants.lbp.maxInRatio.v276.is(block)) {
    const resp = constants.lbp.maxInRatio.v276.get(block);
    if (resp) maxInRatio = resp;
  }
  if (constants.lbp.maxOutRatio.v276.is(block)) {
    const resp = constants.lbp.maxOutRatio.v276.get(block);
    if (resp) maxOutRatio = resp;
  }
  if (constants.lbp.minPoolLiquidity.v276.is(block)) {
    const resp = constants.lbp.minPoolLiquidity.v276.get(block);
    if (resp) minPoolLiquidity = resp;
  }
  if (constants.lbp.minTradingLimit.v276.is(block)) {
    const resp = constants.lbp.minTradingLimit.v276.get(block);
    if (resp) minTradingLimit = resp;
  }

  if (
    repayFee === null ||
    maxInRatio === null ||
    maxOutRatio === null ||
    minPoolLiquidity === null ||
    minTradingLimit === null
  )
    return null;

  return {
    repayFee,
    maxInRatio,
    maxOutRatio,
    minPoolLiquidity,
    minTradingLimit,
  };
}

async function getPoolData({
  poolAddress,
  block,
}: LbpGetPoolDataInput): Promise<LbpPoolData | null> {
  if (block.specVersion < 276) return null;

  let poolStorageData: LbpPoolStorageData | null = null;

  if (storage.lbp.poolData.v276.is(block)) {
    const resp = await storage.lbp.poolData.v276.get(block, poolAddress);

    if (!resp) return null;

    poolStorageData = {
      poolAddress,
      assetAId: resp.assets[0],
      assetBId: resp.assets[1],
      owner: resp.owner,
      start: resp.start,
      end: resp.end,
      initialWeight: resp.initialWeight,
      finalWeight: resp.finalWeight,
      weightCurve: resp.weightCurve,
      fee: resp.fee,
      feeCollector: resp.feeCollector,
      repayTarget: BigInt(resp.repayTarget),
    };
  }

  if (!poolStorageData) return null;

  const constants = getPoolConstants(block);

  if (!constants) return null;

  const {
    repayFee,
    maxInRatio,
    maxOutRatio,
    minPoolLiquidity,
    minTradingLimit,
  } = constants;

  return {
    ...poolStorageData,
    repayFee,
    maxInRatio,
    maxOutRatio,
    minPoolLiquidity,
    minTradingLimit,
  };

  throw new UnknownVersionError('storage.lbp.poolData');
}

async function getAllPoolsData({
  block,
}: LbpGetAllPoolsDataInput): Promise<LbpPoolData[]> {
  const pairsPaged: LbpPoolData[] = [];

  if (block.specVersion < 276) return [];

  const constants = getPoolConstants(block);

  if (!constants) return [];

  if (storage.lbp.poolData.v276.is(block)) {
    for await (const page of storage.lbp.poolData.v276.getPairsPaged(
      100,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map(([poolAddress, poolData]) => ({
            poolAddress,
            assetAId: poolData!.assets[0],
            assetBId: poolData!.assets[1],
            owner: poolData!.owner,
            start: poolData!.start,
            end: poolData!.end,
            initialWeight: poolData!.initialWeight,
            finalWeight: poolData!.finalWeight,
            weightCurve: poolData!.weightCurve,
            fee: poolData!.fee,
            feeCollector: poolData!.feeCollector,
            repayTarget: BigInt(poolData!.repayTarget),
            ...constants,
          }))
      );
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.lbp.poolData');
}

export default { getPoolData, getAllPoolsData };
