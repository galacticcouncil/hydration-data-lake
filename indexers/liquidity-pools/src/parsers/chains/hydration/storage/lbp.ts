import { constants, storage } from '../typegenTypes/';
import {
  GetConstantsInput,
  LbpGetAllPoolIdsInput,
  LbpGetAllPoolsDataInput,
  LbpGetPoolDataInput,
  LbpConstants,
  LbpPoolData,
  LbpPoolStorageData,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

function getConstants({ block }: GetConstantsInput): LbpConstants | null {
  if (block.specVersion < 176) return null;

  let repayFee = null;
  let maxInRatio = null;
  let maxOutRatio = null;
  let minPoolLiquidity = null;
  let minTradingLimit = null;

  if (constants.lbp.repayFee.v176.is(block)) {
    const resp = constants.lbp.repayFee.v176.get(block);
    if (resp !== undefined) repayFee = resp;
  }
  if (constants.lbp.maxInRatio.v176.is(block)) {
    const resp = constants.lbp.maxInRatio.v176.get(block);
    if (resp !== undefined) maxInRatio = resp;
  }
  if (constants.lbp.maxOutRatio.v176.is(block)) {
    const resp = constants.lbp.maxOutRatio.v176.get(block);
    if (resp !== undefined) maxOutRatio = resp;
  }
  if (constants.lbp.minPoolLiquidity.v176.is(block)) {
    const resp = constants.lbp.minPoolLiquidity.v176.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.lbp.minTradingLimit.v176.is(block)) {
    const resp = constants.lbp.minTradingLimit.v176.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }

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
  if (block.specVersion < 176) return null;

  let poolStorageData: LbpPoolStorageData | null = null;

  if (storage.lbp.poolData.v176.is(block) || block.specVersion >= 176) {
    const resp = await storage.lbp.poolData.v176.get(block, poolAddress);

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
    return poolStorageData;
  }
  throw new UnknownVersionError('storage.lbp.poolData');
}

async function getAllPoolsData({
  block,
}: LbpGetAllPoolsDataInput): Promise<LbpPoolData[]> {
  let pairsPaged: LbpPoolData[] = [];

  if (block.specVersion < 176) return [];

  if (storage.lbp.poolData.v176.is(block) || block.specVersion >= 176) {
    for await (const page of storage.lbp.poolData.v176.getPairsPaged(
      500,
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
          }))
      );
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.lbp.poolData');
}

async function getAllPoolIds({
  block,
}: LbpGetAllPoolIdsInput): Promise<string[]> {
  if (block.specVersion < 176) return [];

  if (storage.lbp.poolData.v176.is(block) || block.specVersion >= 176) {
    const ids = await storage.lbp.poolData.v176.getKeys(block);

    return ids;
  }

  throw new UnknownVersionError('storage.lbp.poolData');
}

export default { getPoolData, getAllPoolsData, getAllPoolIds, getConstants };
