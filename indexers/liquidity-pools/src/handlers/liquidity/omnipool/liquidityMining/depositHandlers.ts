import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolLMSharesDepositedData,
  OmnipoolLMSharesRedepositedData,
  OmnipoolLMRewardClaimedData,
  OmnipoolLMDepositDestroyedData,
  UniquesTransferredData,
} from '../../../../parsers/batchBlocksParser/types';
import {
  getNewOmnipoolLiquidityMiningDepositEvent,
  getOrCreateOmnipoolLiquidityMiningDeposit,
} from './depositUtils';
import {
  OmnipoolYieldFarmDeposit,
  YieldFarmDepositStatus,
} from '../../../../model';
import parsers from '../../../../parsers';
import pMap from 'p-map';

export async function handleOmnipoolLMSharesDeposited(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMSharesDepositedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const depositEntity = await getOrCreateOmnipoolLiquidityMiningDeposit({
    depositId: eventParams.depositId.toString(),
    ownerAccountId: eventParams.who,
    positionId: eventParams.positionId.toString(),
    initialAmount: eventParams.sharesAmount,
    blockHeader: eventMetadata.blockHeader,
    noPanic: true,
    ctx,
  });

  if (!depositEntity) {
    console.log(`Deposit ${eventParams.depositId} not found`);
    return;
  }

  const depositEvent = getNewOmnipoolLiquidityMiningDepositEvent({
    eventName: YieldFarmDepositStatus.SharesDeposited,
    depositId: eventParams.depositId.toString(),
    globalFarmId: eventParams.globalFarmId.toString(),
    yieldFarmId: eventParams.yieldFarmId.toString(),
    assetId: eventParams.assetId.toString(),
    accountId: eventParams.who,
    sharesAmount: eventParams.sharesAmount,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  depositEntity.sharesAmount = eventParams.sharesAmount;

  ctx.batchState.state.omnipoolYieldFarmDepositEvents.set(
    depositEvent.id,
    depositEvent
  );

  ctx.batchState.state.omnipoolYieldFarmDeposits.set(
    depositEntity.id,
    depositEntity
  );
}

export async function handleOmnipoolLMDepositDestroyed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMDepositDestroyedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const depositEntity = await getOrCreateOmnipoolLiquidityMiningDeposit({
    depositId: eventParams.depositId.toString(),
    ownerAccountId: eventParams.who,
    blockHeader: eventMetadata.blockHeader,
    noPanic: true,
    ctx,
  });

  if (!depositEntity) return;

  const depositEvent = getNewOmnipoolLiquidityMiningDepositEvent({
    eventName: YieldFarmDepositStatus.DepositDestroyed,
    depositId: eventParams.depositId.toString(),
    accountId: eventParams.who,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  depositEntity.status = YieldFarmDepositStatus.DepositDestroyed;
  depositEntity.destroyedAtParaBlockHeight = eventMetadata.blockHeader.height;

  ctx.batchState.state.omnipoolYieldFarmDepositEvents.set(
    depositEvent.id,
    depositEvent
  );

  ctx.batchState.state.omnipoolYieldFarmDeposits.set(
    depositEntity.id,
    depositEntity
  );
}

export async function handleOmnipoolLMSharesRedeposited(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMSharesRedepositedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolLMRewardClaimed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMRewardClaimedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolLMDepositTransferred(
  ctx: SqdProcessorContext<Store>,
  eventCallData: UniquesTransferredData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { item, to } = eventParams;

  const depositEntity = await getOrCreateOmnipoolLiquidityMiningDeposit({
    depositId: item,
    ctx,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
    noPanic: true,
  });

  if (!depositEntity) return;

  depositEntity.accountId = to;

  ctx.batchState.state.omnipoolYieldFarmDeposits.set(
    depositEntity.id,
    depositEntity
  );

  await ctx.storeUtils.upsertWithBatches([depositEntity]);
}

/**
 * Function to initialize Omnipool Liquidity Minig Deposits on cold start of indexer.
 * It's required to have correct user's total balances.
 * @param ctx
 */
export async function initAllOmnipoolLiquidityMiningDeposits(
  ctx: SqdProcessorContext<Store>
) {
  const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
    OmnipoolYieldFarmDeposit,
    {
      where: {},
      order: {
        createdAtParaBlockHeight: 'DESC',
      },
    },
    {
      className: 'OmnipoolYieldFarmDeposit',
      originCallFn: 'initAllOmnipoolLiquidityMiningDeposits',
    }
  );

  if (hasAnyRecord) return;

  const blockToProcess = ctx.blocks[0];

  const allDeposits =
    await parsers.storage.omnipoolWarehouseLM.getAllDepositsData({
      block: blockToProcess.header,
    });

  if (!allDeposits) {
    console.log(
      `initAllOmnipoolLiquidityMiningDeposits :: No OmnipoolLM Deposits found`
    );
    return;
  }

  await pMap(
    allDeposits || [],
    async (depositData) => {
      const depositEntity = await getOrCreateOmnipoolLiquidityMiningDeposit({
        depositId: depositData.depositId.toString(),
        ensure: true,
        blockHeader: blockToProcess.header,
        ctx,
        noPanic: true,
        storageData: depositData,
      });

      if (!depositEntity) {
        console.log(
          `No position found with ID ${depositData.depositId.toString()}. [${blockToProcess.header.hash}]`
        );
        return;
      }
      const depositEvent = getNewOmnipoolLiquidityMiningDepositEvent({
        eventName: YieldFarmDepositStatus.SharesDeposited,
        depositId: depositEntity.id,
        assetId: depositEntity.assetId.toString(),
        accountId: depositEntity.accountId,
        sharesAmount: depositEntity.sharesAmount,
        eventId: blockToProcess.header.height.toString(),
        paraBlockHeight: blockToProcess.header.height,
      });

      ctx.batchState.state.omnipoolYieldFarmDeposits.set(
        depositEntity.id,
        depositEntity
      );
      ctx.batchState.state.omnipoolYieldFarmDepositEvents.set(
        depositEvent.id,
        depositEvent
      );
    },
    { concurrency: 150 }
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolYieldFarmDeposits.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolYieldFarmDepositEvents.values())
  );
}
