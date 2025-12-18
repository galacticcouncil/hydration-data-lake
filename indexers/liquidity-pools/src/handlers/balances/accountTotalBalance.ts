import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../utils/helpers';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { getOrCreateAsset } from '../assets/asset';
import { getOrCreateAccountTotalBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
import { AccountData } from '../../parsers/types/storage';
import { SqdBlock } from '../../processor';
import { ResourceType } from '../../model';
import { BigNumber } from '@galacticcouncil/sdk';
import { getOmnipoolLiquidityPositionsForAccounts } from '../liquidity/omnipool/liquidityPositions/liquidityPositionUtils';
import { getXykLiquidityMiningDepositsForAccounts } from '../liquidity/xykpool/liquidityMining/depositsUtils';
import { getOmnipoolLiquidityMiningDepositsForAccounts } from '../liquidity/omnipool/liquidityMining/depositUtils';

type BlockHeight = number;
type AccountId = string;
type AssetRegistryId = string;
type AssetId = string;
export type AccountBalancesPerBlock = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetRegistryId, AccountData>>;
  }
>;

export type AccountPositionBalancesPerBlockPerAsset = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetId, BigNumber>>;
  }
>;

export async function handleAccountTotalBalance({
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
}) {
  const allInvolvedAccountsInBatchSet: Set<string> = new Set();

  const accountBalancesPerBlock: AccountBalancesPerBlock = new Map();

  const refAsset = await getOrCreateAsset({
    assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  if (!refAsset) throw Error('Ref asset not found');

  for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    const asset = await getOrCreateAsset({
      id: assetBalance.assetId,
      ctx,
      ensure: true,
      blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
    });

    if (!asset) throw Error(`Asset ${assetBalance.assetId} not found`);

    if (!accountBalancesPerBlock.has(assetBalance.paraBlockHeight))
      accountBalancesPerBlock.set(assetBalance.paraBlockHeight, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(
          assetBalance.paraBlockHeight
        ),
        data: new Map(),
      });

    accountBalancesPerBlock
      .get(assetBalance.paraBlockHeight)!
      .data.set(assetBalance.accountId, new Map());

    allInvolvedAccountsInBatchSet.add(assetBalance.accountId);

    const accountTotalBalance =
      await getOrCreateAccountTotalBalanceHistoricalData({
        accountId: assetBalance.accountId,
        refAssetId: refAsset.id,
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(
          assetBalance.paraBlockHeight
        ),
        ctx,
      });

    if (assetBalance.assetId === refAsset.id) {
      assetBalance.transferableInRefAssetNorm = calcPriceNormalized({
        amount: BigInt(assetBalance.transferable.toString() ?? '0'),
        assetDecimals: asset.decimals!,
        spotPrice: '1',
      });
    }

    /**
     * When we process DEbd token, we need to subtract the debt from the total
     * transferable balance.
     */
    if (asset.resourceType === ResourceType.Debt) {
      const totalBalanceWithoutDebt = BigNumber(
        accountTotalBalance.totalTransferableNorm
      ).minus(assetBalance.transferableInRefAssetNorm || '0');

      accountTotalBalance.totalTransferableNorm = (
        totalBalanceWithoutDebt.isLessThan(0)
          ? BigNumber(0)
          : totalBalanceWithoutDebt
      ).toFixed();
    } else {
      accountTotalBalance.totalTransferableNorm = BigNumber(
        accountTotalBalance.totalTransferableNorm
      )
        .plus(assetBalance.transferableInRefAssetNorm || '0')
        .toFixed();
    }

    accountTotalBalance.totalLockedNorm = BigNumber(
      accountTotalBalance.totalLockedNorm
    )
      .plus(assetBalance.totalLockedInRefAssetNorm || '0')
      .toFixed();

    ctx.batchState.state.accountAssetBalanceHistoricalData.set(
      assetBalance.id,
      assetBalance
    );

    ctx.batchState.state.accountTotalBalanceHistoricalData.set(
      accountTotalBalance.id,
      accountTotalBalance
    );
  }

  const omnipoolLiquidityPositionsMap =
    await getOmnipoolLiquidityPositionsForAccounts({
      ctx,
      involvedAccountsPerBlock: accountBalancesPerBlock,
      involvedAccountsInBatch: allInvolvedAccountsInBatchSet,
    });

  const omnipoolLiquidityMiningDepositsMap =
    await getOmnipoolLiquidityMiningDepositsForAccounts({
      ctx,
      involvedAccountsPerBlock: accountBalancesPerBlock,
      involvedAccountsInBatch: allInvolvedAccountsInBatchSet,
    });

  const xykpoolLiquidityDepositsMap =
    await getXykLiquidityMiningDepositsForAccounts({
      ctx,
      involvedAccountsPerBlock: accountBalancesPerBlock,
      involvedAccountsInBatch: allInvolvedAccountsInBatchSet,
    });

  /**
   * Add Omnipool liquidity positions to the total transferable balance.
   */
  await addLiquidityMiningWorthToTotalBalance({
    lmWorthData: xykpoolLiquidityDepositsMap,
    refAssetId: refAsset.id,
    ctx,
  });

  /**
   * Add Omnipool Liquidity Mining deposits to the total transferable balance.
   */
  await addLiquidityMiningWorthToTotalBalance({
    lmWorthData: omnipoolLiquidityMiningDepositsMap,
    refAssetId: refAsset.id,
    ctx,
  });

  /**
   * Add XYK Liquidity Mining deposits to the total transferable balance.
   */
  await addLiquidityMiningWorthToTotalBalance({
    lmWorthData: omnipoolLiquidityPositionsMap,
    refAssetId: refAsset.id,
    ctx,
  });
}

async function addLiquidityMiningWorthToTotalBalance({
  lmWorthData,
  refAssetId,
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
  refAssetId: string;
  lmWorthData: AccountPositionBalancesPerBlockPerAsset;
}) {
  for (const blockData of lmWorthData.values()) {
    for (const [accountId, accountAssetData] of blockData.data.entries()) {
      const accountTotalBalance =
        await getOrCreateAccountTotalBalanceHistoricalData({
          accountId,
          refAssetId,
          blockHeader: blockData.blockHeader,
          ctx,
        });

      for (const [assetId, balanceBn] of accountAssetData.entries()) {
        const asset = await getOrCreateAsset({
          id: assetId,
          ctx,
          ensure: true,
          blockHeader: blockData.blockHeader,
        });
        if (!asset) continue;

        const assetSpotPrice = getAssetsPairPrice({
          ctx,
          assetInId: asset.id,
          blockHeight: blockData.blockHeader.height,
        });

        /**
         * Account total balance calculation
         */
        accountTotalBalance.totalTransferableNorm = BigNumber(
          accountTotalBalance.totalTransferableNorm
        )
          .plus(
            assetSpotPrice && asset.decimals
              ? calcPriceNormalized({
                  amount: BigInt(balanceBn.toFixed() ?? '0'),
                  assetDecimals: asset.decimals,
                  spotPrice: assetSpotPrice,
                })
              : '0'
          )
          .toFixed();
      }

      ctx.batchState.state.accountTotalBalanceHistoricalData.set(
        accountTotalBalance.id,
        accountTotalBalance
      );
    }
  }
}
