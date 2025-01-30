import { describe, expect, test } from '@jest/globals';
import { LiquidityPoolsGQLManager } from '../../utils/graphqlRequestManager/liquidityPoolsApi';
import { PolkadotApiManager } from '../../utils/polkadotApiManager';
import stubs from '../stubs/liquidityPools.stubs';
import { removeStringSeparators } from '../../utils';

describe('Validation of indexed data against blockchain storage state', () => {
  beforeAll(async () => {});

  describe('Given the liquidity-pools indexer has already indexed the required block range', () => {
    describe('When querying the liquidity-pools API', () => {
      const handleXykPoolHistoricalDataAtBlockTestcase = async ({
        poolAddress,
        blockHeight,
        pdApiClientManager,
      }: {
        poolAddress: string;
        blockHeight: number;
        pdApiClientManager: PolkadotApiManager;
      }) => {
        const apiResult =
          await new LiquidityPoolsGQLManager().getXykPoolHistoricalDatumAtBlock(
            {
              blockNumber: blockHeight,
              poolAddress,
            }
          );

        expect(apiResult ?? null).not.toBeNull();
        if (!apiResult) return null;

        const apiResultTestUnit = {
          ...apiResult,
          assetABalance: BigInt(apiResult.assetABalance),
          assetBBalance: BigInt(apiResult.assetBBalance),
        };

        const poolData = await (
          await pdApiClientManager.getApiClient()
        ).query.xyk.poolAssets(poolAddress);

        expect(poolData ?? null).not.toBeNull();
        if (!poolData) return null;

        const poolDataDecorated = poolData.toHuman() as string[];

        const assertABalances = await (
          await pdApiClientManager.getApiClient()
        ).query.tokens.accounts(
          poolAddress,
          +removeStringSeparators(poolDataDecorated[0])
        );

        expect(assertABalances).not.toBeNull();
        if (!assertABalances) return null;

        const assertBBalances = await (
          await pdApiClientManager.getApiClient()
        ).query.tokens.accounts(
          poolAddress,
          +removeStringSeparators(poolDataDecorated[1])
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
          assetAId: poolDataDecorated[0],
          assetBId: poolDataDecorated[1],
          assetABalance: BigInt(
            removeStringSeparators(assertABalancesDecorated.free)
          ),
          assetBBalance: BigInt(
            removeStringSeparators(assertBBalancesDecorated.free)
          ),
          poolId: poolAddress,
          paraChainBlockHeight: blockHeight,
        };

        expect(apiResultTestUnit).toStrictEqual(rpcResultTestUnit);
      };

      describe(`Then it should return data identical to what blockchain RPC calls return at block ${stubs.xykPoolHistoricalData.blocks.blockA.height}`, () => {
        const pdApiClientManager = new PolkadotApiManager({
          blockHash: stubs.xykPoolHistoricalData.blocks.blockA.hash,
        });
        afterAll(async () => {
          await pdApiClientManager.wsClient?.disconnect();
        });

        test(`for API query XykPoolHistoricalData for pool address ${stubs.xykPoolHistoricalData.pools.poolA.address}`, async () => {
          await handleXykPoolHistoricalDataAtBlockTestcase({
            poolAddress: stubs.xykPoolHistoricalData.pools.poolA.address,
            blockHeight: stubs.xykPoolHistoricalData.blocks.blockA.height,
            pdApiClientManager,
          });
        });
      });

      describe(`Then it should return data identical to what blockchain RPC calls return at block ${stubs.xykPoolHistoricalData.blocks.blockB.height}`, () => {
        const pdApiClientManager = new PolkadotApiManager({
          blockHash: stubs.xykPoolHistoricalData.blocks.blockB.hash,
        });
        afterAll(async () => {
          await pdApiClientManager.wsClient?.disconnect();
        });

        test(`for API query XykPoolHistoricalData for pool address ${stubs.xykPoolHistoricalData.pools.poolA.address}`, async () => {
          await handleXykPoolHistoricalDataAtBlockTestcase({
            poolAddress: stubs.xykPoolHistoricalData.pools.poolA.address,
            blockHeight: stubs.xykPoolHistoricalData.blocks.blockB.height,
            pdApiClientManager,
          });
        });
      });
    });
  });
});
