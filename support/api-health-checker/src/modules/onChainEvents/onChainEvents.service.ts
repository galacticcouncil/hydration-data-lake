import { Inject, Injectable } from '@nestjs/common';
import {
  PolkadotApiProvider,
  PolkadotApiProviderToken,
} from '../../providers/polkadotApi.provider';
import { QueueService } from '../queue/queue.service';
import {
  BroadcastSwappedEventParams,
  BroadcastSwappedExecutionTypeValue,
  EventName,
  SwapFeeDestinationType,
  SwapFillerType,
  SwappedExecutionTypeKind,
  TradeOperationType,
} from '../../types/events';
import { Iflbjpb22ffvu4 } from '@polkadot-api/descriptors/dist/common-types';
import { CryptoUtils } from '../../utils/cryptoUtils';
import * as crypto from 'node:crypto';
import { EvmLogDecoder } from '../../utils/evmTools/evmLogDecoder';
import { u8aToHex } from '@polkadot/util';
import { Result } from 'ethers';
import { EvmEventName } from '../../utils/evmTools/types';
import { EventCheckJobPayload } from '../../types/queueJob';
import { CommonUtils } from '../../utils/commonUtils';

@Injectable()
export class OnChainEventsService {
  private broadcastSwappedEventsLastBlock: number = 0;
  private latestBestBlockReceived: number = 0;
  private mmSupplyEventLastBlock: number = 0;
  private mmBorrowEventLastBlock: number = 0;

  constructor(
    @Inject(PolkadotApiProviderToken)
    private readonly polkadotApiProvider: PolkadotApiProvider,
    private readonly queueService: QueueService,
    private readonly cryptoUtils: CryptoUtils,
    private readonly commonUtils: CommonUtils,
  ) {}

  decorateBroadcastSwappedEventPayload(
    payload: Iflbjpb22ffvu4,
  ): BroadcastSwappedEventParams {
    return {
      swapper: this.cryptoUtils.ss58ToHex(payload.swapper),
      filler: this.cryptoUtils.ss58ToHex(payload.filler),
      fillerType: {
        kind: payload.filler_type.type as SwapFillerType,
        value: `${payload.filler_type.value}`,
      },
      operation: payload.operation.type as TradeOperationType,
      operationStack: (payload.operation_stack || []).map((stackItem) => ({
        kind: stackItem.type as SwappedExecutionTypeKind,
        value: stackItem.value as BroadcastSwappedExecutionTypeValue,
      })),
      inputs: payload.inputs.map(({ amount, asset }) => ({
        assetId: asset,
        amount: amount.toString(),
      })),
      outputs: payload.outputs.map(({ amount, asset }) => ({
        assetId: asset,
        amount: amount.toString(),
      })),
      fees: payload.fees.map(({ amount, asset, destination }) => ({
        assetId: asset,
        amount: amount.toString(),
        recipientId:
          destination.type === SwapFeeDestinationType.Account &&
          destination.value
            ? this.cryptoUtils.ss58ToHex(destination.value)
            : undefined,
        destinationType: destination.type as SwapFeeDestinationType,
      })),
    };
  }

  subscribeToBroadcastSwapped() {
    this.polkadotApiProvider.typedApi.event.Broadcast.Swapped3.watch()
      .pipe()
      .forEach((event) => {
        if (this.broadcastSwappedEventsLastBlock === event.meta.block.number)
          return;

        this.broadcastSwappedEventsLastBlock = event.meta.block.number;

        this.queueService
          .setEventCheckJob({
            eventName: EventName.Broadcast_Swapped3,
            payload: {
              meta: {
                uuid: crypto.randomUUID(),
                blockHeight: event.meta.block.number,
                blockHash: event.meta.block.hash,
                timestamp: Date.now(),
                eventName: EventName.Broadcast_Swapped3,
                jobExecAttempt: 0,
              },
              payload: this.decorateBroadcastSwappedEventPayload(event.payload),
            },
          })
          .then();
      });
  }

  subscribeToNewBlock() {
    this.polkadotApiProvider.typedApi.event.RelayChainInfo.CurrentBlockNumbers.watch()
      .pipe()
      .forEach(async (event) => {
        if (this.latestBestBlockReceived === event.meta.block.number) return;

        this.latestBestBlockReceived = event.meta.block.number;

        const latestBestBlock =
          await this.polkadotApiProvider.client.getBestBlocks();

        this.queueService
          .setEventCheckJob({
            eventName: EventName.BestBlock,
            payload: {
              meta: {
                uuid: crypto.randomUUID(),
                blockHeight: event.meta.block.number,
                blockHash: event.meta.block.hash,
                timestamp: Date.now(),
                eventName: EventName.BestBlock,
                jobExecAttempt: 0,
              },
              payload: {
                height: latestBestBlock[0].number,
                hash: latestBestBlock[0].hash,
              },
            },
          })
          .then();
      });
  }

  subscribeToEvmLogEvent() {
    this.polkadotApiProvider.typedApi.event.EVM.Log.watch()
      .pipe()
      .forEach(async (event) => {
        const parsedLog = EvmLogDecoder.getInstance().tryDecodeLog({
          address: event.payload.log.address.asHex(),
          topics: event.payload.log.topics.map((t) => t.asHex()),
          data: event.payload.log.data.asHex(),
        });

        if (!parsedLog) return;

        const parsedLogData = EvmLogDecoder.getInstance().getEvmEventFromLog({
          eventName: parsedLog.name,
          address: event.payload.log.address.asHex(),
          signature: parsedLog.signature,
          args: parsedLog.args,
        });

        if (
          !parsedLogData ||
          (parsedLogData.eventName !== EvmEventName.Supply &&
            parsedLogData.eventName !== EvmEventName.Borrow)
        )
          return;

        if (
          (parsedLogData.eventName === EvmEventName.Supply &&
            this.mmSupplyEventLastBlock === event.meta.block.number) ||
          (parsedLogData.eventName === EvmEventName.Borrow &&
            this.mmBorrowEventLastBlock === event.meta.block.number)
        )
          return;

        switch (parsedLogData.eventName) {
          case EvmEventName.Supply:
            this.mmSupplyEventLastBlock = event.meta.block.number;
            this.queueService
              .setEventCheckJob({
                eventName: EventName.MoneyMarket_Supply,
                payload: {
                  meta: {
                    uuid: crypto.randomUUID(),
                    blockHeight: event.meta.block.number,
                    blockHash: event.meta.block.hash,
                    timestamp: Date.now(),
                    eventName: EventName.MoneyMarket_Supply,
                    jobExecAttempt: 0,
                  },
                  payload:
                    this.commonUtils.bigintToStringAllKeys(parsedLogData),
                } as EventCheckJobPayload<EventName.MoneyMarket_Supply>,
              })
              .then();
            break;
          case EvmEventName.Borrow:
            this.mmBorrowEventLastBlock = event.meta.block.number;

            this.queueService
              .setEventCheckJob({
                eventName: EventName.MoneyMarket_Borrow,
                payload: {
                  meta: {
                    uuid: crypto.randomUUID(),
                    blockHeight: event.meta.block.number,
                    blockHash: event.meta.block.hash,
                    timestamp: Date.now(),
                    eventName: EventName.MoneyMarket_Borrow,
                    jobExecAttempt: 0,
                  },
                  payload:
                    this.commonUtils.bigintToStringAllKeys(parsedLogData),
                } as EventCheckJobPayload<EventName.MoneyMarket_Borrow>,
              })
              .then();
            break;
          default:
        }
      });
  }

  async subscribeToEvents() {
    console.log('subscribeToEvents');
    this.subscribeToBroadcastSwapped();
    this.subscribeToNewBlock();
    this.subscribeToEvmLogEvent();
  }
}
