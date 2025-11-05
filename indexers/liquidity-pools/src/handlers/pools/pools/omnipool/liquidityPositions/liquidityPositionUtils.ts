import { SqdBlock, SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  FarmLifeState,
  FarmLifeStateEventName,
  OmnipoolGlobalFarm,
  OmnipoolLiquidityPosition,
  OmnipoolLiquidityPositionEvent,
  OmnipoolLiquidityPositionStatus,
} from '../../../../../model';
import parsers from '../../../../../parsers';
import { getOrCreateAsset } from '../../../../assets/asset';
import { getOrCreateAccount } from '../../../../accounts';
import { getOrCreateOmnipoolAsset } from '../omnipoolAssets';

export async function getNewOmnipoolLiquidityPosition({
  positionId,
  assetId,
  ownerAccountId,
  amount,
  sharesAmount,
  initialAmount,
  price,
  ctx,
  blockHeader,
  eventId = null,
  noPanic = false,
}: {
  positionId: string;
  assetId?: string;
  initialAmount?: bigint;
  amount?: bigint;
  sharesAmount?: bigint;
  price?: bigint;
  ownerAccountId?: string;
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
  eventId?: string | null;
  noPanic?: boolean;
}) {
  try {
    if (!blockHeader)
      throw Error(
        `getNewOmnipoolLiquidityPosition :: blockHeader has not been provided`
      );

    const positionData = {
      assetId,
      ownerAccountId,
      amount,
      initialAmount,
      sharesAmount,
      price,
    };

    if (!assetId || !amount || !sharesAmount || !price) {
      const positionStorageData =
        await parsers.storage.omnipool.getOmnipoolLiquidityPositions({
          positionIds: [positionId],
          block: blockHeader,
        });

      if (
        !positionStorageData ||
        !positionStorageData[0] ||
        !positionStorageData[0].data
      )
        throw Error(`Storage data for position ${positionId} cannot be found;`);

      const data = positionStorageData[0].data!;

      const asset = await getOrCreateAsset({
        assetRegistryId: data.assetId,
        ctx,
        blockHeader,
        ensure: true,
      });

      if (!asset) {
        throw Error(
          `getNewOmnipoolLiquidityPosition :: asset with id ${data.assetId} cannot be found;`
        );
      }

      positionData.price = data.price;
      positionData.amount = data.amount;
      positionData.assetId = asset.id;
      positionData.sharesAmount = data.shares;
    }

    if (!ownerAccountId) {
      const nftCollectionId =
        parsers.storage.omnipool.getNftCollectionIdConstant({
          block: blockHeader,
        });

      const positionNftDetails = await parsers.storage.uniques.getAssetsData({
        collectionId: `${nftCollectionId.collectionId}`,
        assetIds: [positionId],
        block: blockHeader,
      });

      if (
        !positionNftDetails ||
        !positionNftDetails[0] ||
        !positionNftDetails[0].data
      ) {
        throw Error(`Details for position NFT ${positionId} cannot be found;`);
      }

      const account = await getOrCreateAccount({
        id: positionNftDetails[0].data?.owner,
        ctx,
      });

      if (!account) {
        throw Error(
          `Account with id ${positionNftDetails[0].data?.owner} cannot be found;`
        );
      }
      positionData.ownerAccountId = account.id;
    }

    const omnipoolAsset = await getOrCreateOmnipoolAsset({
      ctx,
      blockHeader,
      ensure: true,
      assetId: positionData.assetId,
    });

    if (!omnipoolAsset) {
      throw Error(
        `Omnipool Asset with Asset id ${positionData.assetId} cannot be found;`
      );
    }

    const positionEntity = new OmnipoolLiquidityPosition({
      id: positionId,

      account: await getOrCreateAccount({
        id: positionData.ownerAccountId!,
        ctx,
      }),
      assetId: positionData.assetId,
      omnipoolAssetId: omnipoolAsset.id,

      initialAmount: positionData.initialAmount ?? positionData.amount,
      amount: positionData.amount,
      sharesAmount: positionData.sharesAmount,
      positionNftId: positionId,
      price: positionData.price ?? null,

      status: OmnipoolLiquidityPositionStatus.PositionCreated,

      paraBlockHeight: blockHeader.height,
      relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
        blockHeader.height
      ).height,
      eventId,
    });

    return positionEntity;
  } catch (e) {
    if (noPanic) return null;
    throw e;
  }
}

export async function getOrCreateOmnipoolLiquidityPosition({
  positionId,
  ensure = false,
  blockHeader,
  ctx,
  noPanic = false,
}: {
  positionId: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  ctx: SqdProcessorContext<Store>;
  noPanic?: boolean;
}) {
  if (!positionId) return null;

  let positionEntity: OmnipoolLiquidityPosition | null | undefined =
    ctx.batchState.state.omnipoolLiquidityPositions.get(positionId);

  if (positionEntity) return positionEntity;

  positionEntity = await ctx.store.findOne(OmnipoolLiquidityPosition, {
    where: { id: positionId },
  });

  if (positionEntity) {
    ctx.batchState.state.omnipoolLiquidityPositions.set(
      positionId,
      positionEntity
    );
    return positionEntity;
  }
  if (!ensure) return null;

  if (!blockHeader) {
    throw Error(
      `getOrCreateOmnipoolLiquidityPosition :: blockHeader has not been provided`
    );
  }

  try {
    positionEntity = await getNewOmnipoolLiquidityPosition({
      positionId,
      ctx,
      blockHeader,
    });

    if (!positionEntity) return null;

    ctx.batchState.state.omnipoolLiquidityPositions.set(
      positionEntity.id,
      positionEntity
    );
    await ctx.store.upsert(positionEntity);
  } catch (e) {
    if (noPanic) return null;
    throw e;
  }

  return positionEntity;
}

export async function getNewOmnipoolLiquidityPositionEvent({
  eventName,
  position,
  assetId,
  ownerAccountId,
  amount,
  sharesAmount,
  price,
  ctx,
  eventId,
  paraBlockHeight,
}: {
  eventName: OmnipoolLiquidityPositionStatus;
  position: OmnipoolLiquidityPosition;
  assetId: string;
  amount?: bigint;
  sharesAmount?: bigint;
  price?: bigint;
  ownerAccountId: string;
  eventId: string;
  paraBlockHeight: number;
  ctx: SqdProcessorContext<Store>;
}) {
  return new OmnipoolLiquidityPositionEvent({
    id: `${position.id}-${eventId}`,
    position,
    eventName,
    accountId: ownerAccountId,
    assetId,
    amount: amount ?? null,
    sharesAmount: sharesAmount ?? null,
    price: price ?? null,
    paraBlockHeight,
    relayBlockHeight:
      ctx.batchState.getParaBlockFromCacheByHeight(paraBlockHeight)?.height,
    eventId,
  });
}
