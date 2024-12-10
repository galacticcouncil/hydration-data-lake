import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Trade } from '../../model';

export async function getTrade({
  ctx,
  id,
  routerOperationId,
}: {
  routerOperationId?: number;
  batchOperationId?: number;
  dcaOperationId?: number;
  iceOperationId?: number;
  ctx: ProcessorContext<Store>;
  id: string;
}): Promise<Trade | null> {
  if (!id && routerOperationId === undefined) return null;

  const batchState = ctx.batchState.state;

  let trade: Trade | undefined = undefined;

  if (id) {
    trade = batchState.trades.get(id);
  } else if (routerOperationId !== undefined) {
    trade = [...batchState.trades.values()].find((t) => t.routerOperationId);
  }

  if (!trade) {
    trade = await ctx.store.findOne(Trade, {
      where: {
        ...(id ? { id } : {}),
        ...(routerOperationId !== undefined ? { routerOperationId } : {}),
      },
      relations: {
        initiator: true,
        swaps: {
          swapper: true,
          filler: true,
          fees: {
            asset: true,
            recipient: true,
          },
          inputs: {
            asset: true,
          },
          outputs: {
            asset: true,
          },
        },
      },
    });
  }
  return trade ?? null;
}
