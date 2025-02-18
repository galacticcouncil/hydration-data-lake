import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BalancesTransferData } from '../../../parsers/batchBlocksParser/types';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';

export function handleMmSupplyEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {}
