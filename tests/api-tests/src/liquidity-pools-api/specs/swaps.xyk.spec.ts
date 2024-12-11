import { describe, expect, test } from '@jest/globals';
import { LiquidityPoolsGQLManager } from '../../utils/graphqlRequestManager/liquidityPoolsApi';
import { PolkadotApiManager } from '../../utils/polkadotApiManager';
import stubs from '../stubs/liquidityPools.stubs';
import { removeStringSeparators } from '../../utils';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

describe('Validation of indexed data against blockchain storage state', () => {
  beforeAll(async () => {});

  describe('Given the liquidity-pools indexer has already indexed the required block range', () => {
    describe('When querying the liquidity-pools API', () => {
      const handleXykPoolSwapAtBlockTestcase = async ({
        poolAddress,
        blockHeight,
        pdApiClientManager,
      }: {
        poolAddress: string;
        blockHeight: number;
        pdApiClientManager: PolkadotApiManager;
      }) => {
        const apiResult =
          await new LiquidityPoolsGQLManager().getXykPoolSwapAtBlock({
            blockNumber: blockHeight,
            poolAddress,
          });

        expect(apiResult ?? null).not.toBeNull();

        expect(!!apiResult && apiResult.swapFees.nodes.length > 0).toBe(true);

        expect(
          !!apiResult && apiResult.swapInputAssetBalances.nodes.length > 0
        ).toBe(true);

        expect(
          !!apiResult && apiResult.swapOutputAssetBalances.nodes.length > 0
        ).toBe(true);

        if (!apiResult) return null;

        const apiResultTestUnit = {
          swapperId: apiResult.swapperId,
          fillerId: apiResult.fillerId,
          fillerType: apiResult.fillerType,
          swapFee: {
            assetId: apiResult.swapFees.nodes[0]?.assetId,
            amount: BigInt(apiResult.swapFees.nodes[0]?.amount),
            recipientId: apiResult.swapFees.nodes[0]?.recipientId,
          },
          swapInputAssetBalances: {
            amount: BigInt(apiResult.swapInputAssetBalances.nodes[0]?.amount),
            assetId: apiResult.swapInputAssetBalances.nodes[0]?.assetId,
          },
          swapOutputAssetBalances: {
            amount: BigInt(apiResult.swapOutputAssetBalances.nodes[0]?.amount),
            assetId: apiResult.swapOutputAssetBalances.nodes[0]?.assetId,
          },
        };

        const blockEvents = (
          await (await pdApiClientManager.getApiClient()).query.system.events()
        ).toHuman() as
          | {
              phase: Record<string, any>;
              event: {
                method: string;
                section: string;
                index: string;
                data: {
                  who: string;
                  assetIn: string;
                  assetOut: string;
                  amount: string;
                  salePrice: string;
                  feeAsset: string;
                  feeAmount: string;
                  pool: string;
                };
              };
              topic: Array<any>;
            }[]
          | null;

        expect(blockEvents ?? null).not.toBeNull();

        if (!blockEvents) return null;

        const swapEvent = blockEvents.find(
          (e) =>
            e.event.method === 'SellExecuted' &&
            e.event.section === 'xyk' &&
            e.event.data &&
            u8aToHex(decodeAddress(e.event.data.pool)) === poolAddress
        );

        expect(swapEvent ?? null).not.toBeNull();
        if (!swapEvent) return null;

        const rpcResultTestUnit = {
          swapperId: u8aToHex(decodeAddress(swapEvent.event.data.who)),
          fillerId: u8aToHex(decodeAddress(swapEvent.event.data.pool)),
          fillerType: swapEvent.event.section.toUpperCase(),
          swapFee: {
            assetId: swapEvent.event.data.feeAsset,
            amount: BigInt(
              removeStringSeparators(swapEvent.event.data.feeAmount)
            ),
            recipientId: u8aToHex(decodeAddress(swapEvent.event.data.pool)),
          },
          swapInputAssetBalances: {
            amount: BigInt(removeStringSeparators(swapEvent.event.data.amount)),
            assetId: swapEvent.event.data.assetIn,
          },
          swapOutputAssetBalances: {
            amount: BigInt(
              removeStringSeparators(swapEvent.event.data.salePrice)
            ),
            assetId: swapEvent.event.data.assetOut,
          },
        };

        expect(apiResultTestUnit).toStrictEqual(rpcResultTestUnit);
      };

      describe(`Then it should return Swap details identical to what blockchain event contains at block ${stubs.xykPoolHistoricalData.blocks.blockA.height}`, () => {
        const pdApiClientManager = new PolkadotApiManager({
          blockHash: stubs.xykPoolHistoricalData.blocks.blockA.hash,
        });
        afterAll(async () => {
          await pdApiClientManager.wsClient?.disconnect();
        });

        test(`for API query Swaps for "filler" address ${stubs.xykPoolHistoricalData.pools.poolA.address}`, async () => {
          await handleXykPoolSwapAtBlockTestcase({
            poolAddress: stubs.xykPoolHistoricalData.pools.poolA.address,
            blockHeight: stubs.xykPoolHistoricalData.blocks.blockA.height,
            pdApiClientManager,
          });
        });
      });

      describe(`Then it should return Swap details identical to what blockchain event contains at block ${stubs.xykPoolHistoricalData.blocks.blockB.height}`, () => {
        const pdApiClientManager = new PolkadotApiManager({
          blockHash: stubs.xykPoolHistoricalData.blocks.blockB.hash,
        });
        afterAll(async () => {
          await pdApiClientManager.wsClient?.disconnect();
        });

        test(`for API query Swaps for "filler" address ${stubs.xykPoolHistoricalData.pools.poolA.address}`, async () => {
          await handleXykPoolSwapAtBlockTestcase({
            poolAddress: stubs.xykPoolHistoricalData.pools.poolA.address,
            blockHeight: stubs.xykPoolHistoricalData.blocks.blockB.height,
            pdApiClientManager,
          });
        });
      });
    });
  });
});
