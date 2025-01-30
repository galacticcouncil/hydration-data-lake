import { describe, expect, test } from '@jest/globals';
import { LiquidityPoolsGQLManager } from '../../utils/graphqlRequestManager/liquidityPoolsApi';
import { PolkadotApiManager } from '../../utils/polkadotApiManager';
import stubs from '../stubs/liquidityPools.stubs';
import { removeStringSeparators } from '../../utils';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { StorageDictionaryGQLManager } from '../../utils/graphqlRequestManager/storageDictionaryApi';

describe('Validation of indexed data against blockchain storage state', () => {
  beforeAll(async () => {});

  describe('Given the storage dictionary indexer has already indexed the required block range', () => {
    describe('When querying the storage dictionary API', () => {
      const handleLbpPoolDataAtBlockTestcase = async ({
        poolAddress,
        blockHeight,
        pdApiClientManager,
      }: {
        poolAddress: string;
        blockHeight: number;
        pdApiClientManager: PolkadotApiManager;
      }) => {
        const apiResult =
          await new StorageDictionaryGQLManager().getLbpPoolDataAtBlock({
            blockNumber: blockHeight,
            poolAddress,
          });

        expect(apiResult ?? null).not.toBeNull();
        if (!apiResult) return null;

        const assetAData = apiResult.lbpPoolAssetsDataByPoolId.nodes.find(
          (asset) => asset?.assetId === apiResult.assetAId
        );
        const assetBData = apiResult.lbpPoolAssetsDataByPoolId.nodes.find(
          (asset) => asset?.assetId === apiResult.assetBId
        );

        expect(assetAData ?? null).not.toBeNull();
        if (!assetAData) return null;

        expect(assetBData ?? null).not.toBeNull();
        if (!assetBData) return null;

        const apiResultTestUnit = {
          start: apiResult.start ?? null,
          end: apiResult.end ?? null,
          initialWeight: apiResult.initialWeight,
          finalWeight: apiResult.finalWeight,
          feeCollectorId: apiResult.feeCollector,
          fee: apiResult.fee,
          weightCurve: apiResult.weightCurve,
          poolId: poolAddress,
          assetAId: apiResult.assetAId.toString(),
          assetBId: apiResult.assetBId.toString(),
          assetABalance: BigInt(assetAData.balances.free),
          assetBBalance: BigInt(assetBData.balances.free),
          repayTarget: BigInt(apiResult.repayTarget),
          paraChainBlockHeight: blockHeight,
        };

        const poolData = await (
          await pdApiClientManager.getApiClient()
        ).query.lbp.poolData(poolAddress);

        expect(poolData ?? null).not.toBeNull();
        if (!poolData) return null;

        const poolDataDecorated = poolData.toHuman() as {
          owner: string;
          start?: string;
          end?: string;
          assets: string[];
          initialWeight: string;
          finalWeight: string;
          weightCurve: string;
          fee: string[];
          feeCollector: string;
          repayTarget: string;
        };

        const assertABalances = await (
          await pdApiClientManager.getApiClient()
        ).query.tokens.accounts(
          poolAddress,
          +removeStringSeparators(poolDataDecorated.assets[0])
        );

        expect(assertABalances).not.toBeNull();
        if (!assertABalances) return null;

        const assertBBalances = await (
          await pdApiClientManager.getApiClient()
        ).query.tokens.accounts(
          poolAddress,
          +removeStringSeparators(poolDataDecorated.assets[1])
        );

        expect(assertBBalances).not.toBeNull();
        if (!assertBBalances) return null;

        const assertABalancesDecorated = assertABalances.toHuman() as {
          free: string;
        };
        const assertBBalancesDecorated = assertBBalances.toHuman() as {
          free: string;
        };

        const rpcResultTestUnit = {
          start: poolDataDecorated.start
            ? +removeStringSeparators(poolDataDecorated.start)
            : null,
          end: poolDataDecorated.end
            ? +removeStringSeparators(poolDataDecorated.end)
            : null,
          initialWeight: +removeStringSeparators(
            poolDataDecorated.initialWeight
          ),
          finalWeight: +removeStringSeparators(poolDataDecorated.finalWeight),
          feeCollectorId: u8aToHex(
            decodeAddress(poolDataDecorated.feeCollector)
          ),
          fee: [
            +removeStringSeparators(poolDataDecorated.fee[0]),
            +removeStringSeparators(poolDataDecorated.fee[1]),
          ],
          repayTarget: BigInt(
            removeStringSeparators(poolDataDecorated.repayTarget)
          ),
          weightCurve: poolDataDecorated.weightCurve,
          poolId: poolAddress,
          assetAId: removeStringSeparators(poolDataDecorated.assets[0]),
          assetBId: removeStringSeparators(poolDataDecorated.assets[1]),
          assetABalance: BigInt(
            removeStringSeparators(assertABalancesDecorated.free)
          ),
          assetBBalance: BigInt(
            removeStringSeparators(assertBBalancesDecorated.free)
          ),
          paraChainBlockHeight: blockHeight,
        };

        expect(apiResultTestUnit).toStrictEqual(rpcResultTestUnit);
      };

      describe(`Then it should return data identical to what blockchain RPC calls return at block ${stubs.lbpPoolHistoricalData.blocks.blockA.height}`, () => {
        const pdApiClientManager = new PolkadotApiManager({
          blockHash: stubs.lbpPoolHistoricalData.blocks.blockA.hash,
        });
        beforeAll(async () => {});
        afterAll(async () => {
          await pdApiClientManager.wsClient?.disconnect();
        });

        test(`for API query LbpPoolData for pool address ${stubs.lbpPoolHistoricalData.pools.poolA.address}`, async () => {
          await handleLbpPoolDataAtBlockTestcase({
            poolAddress: stubs.lbpPoolHistoricalData.pools.poolA.address,
            blockHeight: stubs.lbpPoolHistoricalData.blocks.blockA.height,
            pdApiClientManager,
          });
        });
      });

      describe(`Then it should return data identical to what blockchain RPC calls return at block ${stubs.lbpPoolHistoricalData.blocks.blockB.height}`, () => {
        const pdApiClientManager = new PolkadotApiManager({
          blockHash: stubs.lbpPoolHistoricalData.blocks.blockB.hash,
        });
        beforeAll(async () => {});
        afterAll(async () => {
          await pdApiClientManager.wsClient?.disconnect();
        });

        test(`for API query LbpPoolData for pool address ${stubs.lbpPoolHistoricalData.pools.poolA.address}`, async () => {
          await handleLbpPoolDataAtBlockTestcase({
            poolAddress: stubs.lbpPoolHistoricalData.pools.poolA.address,
            blockHeight: stubs.lbpPoolHistoricalData.blocks.blockB.height,
            pdApiClientManager,
          });
        });
      });
    });
  });
});
